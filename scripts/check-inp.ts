import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import puppeteer from 'puppeteer-core';
import type { Browser } from 'puppeteer-core';
import { chromium } from '@playwright/test';
import { startTimespan } from 'lighthouse';

const origin = 'http://localhost:4173';
const server = spawn(
  process.execPath,
  [
    'node_modules/vite/bin/vite.js',
    'preview',
    '--host',
    'localhost',
    '--port',
    '4173',
    '--strictPort',
  ],
  {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {
      ...process.env,
      SESSION_SECRET: 'inp-lab-session-secret-at-least-32-characters',
    },
  },
);
let listening = false;
let serverOutput = '';
server.stdout?.on('data', (chunk: Buffer) => {
  const text = chunk.toString();
  serverOutput += text;
  if (text.includes('Local')) listening = true;
});
server.stderr?.on('data', (chunk: Buffer) => {
  serverOutput += chunk.toString();
});
let browser: Browser | undefined;
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null)
      throw new Error(`INP preview exited before readiness: ${serverOutput}`);
    try {
      ready = listening && (await fetch(`${origin}/en`)).ok;
    } catch {
      /* Preview is still starting. */
    }
    if (ready) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  if (!ready) throw new Error('INP preview did not start');
  browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || chromium.executablePath(),
    headless: true,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 412,
    height: 823,
    deviceScaleFactor: 1.75,
    isMobile: true,
    hasTouch: true,
  });
  await page.goto(`${origin}/en/login`);
  await page.evaluate(async () => {
    const response = await fetch('/en/login', {
      method: 'POST',
      body: new URLSearchParams({
        email: 'viewer@demo.test',
        password: 'demo1234',
      }),
    });
    if (!response.ok) throw new Error('INP authentication failed');
  });
  await mkdir('.lighthouseci/inp', { recursive: true });
  const paths = [
    '/en',
    '/en/blog/sub-second-lcp-on-a-content-site',
    '/en/dashboard/items',
  ];
  for (const [index, path] of paths.entries()) {
    await page.goto(origin + path, { waitUntil: 'networkidle0' });
    const { endTimespan } = await startTimespan(page, {
      config: {
        extends: 'lighthouse:default',
        settings: {
          onlyAudits: ['interaction-to-next-paint'],
          throttlingMethod: 'devtools',
          formFactor: 'mobile',
          throttling: {
            cpuSlowdownMultiplier: 4,
            rttMs: 150,
            throughputKbps: 1638.4,
          },
        },
      },
    });
    for (let i = 0; i < 4; i++) {
      await page.click('.theme');
      await page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
      );
    }
    if (path.includes('/dashboard')) {
      await page.click('main > div button');
      await page.waitForSelector('[role="dialog"]');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Escape');
    }
    const result = await endTimespan();
    if (!result)
      throw new Error(`Lighthouse did not return a result for ${path}`);
    const report = result.lhr;
    const inp = report.audits['interaction-to-next-paint']?.numericValue;
    await writeFile(
      `.lighthouseci/inp/route-${index}.json`,
      JSON.stringify(report),
    );
    if (typeof inp !== 'number' || !Number.isFinite(inp))
      throw new Error(`INP was not measured on ${path}`);
    console.log(`${path}: lab INP ${inp.toFixed(1)}ms / 200ms`);
    if (inp >= 200) throw new Error(`INP budget exceeded on ${path}`);
  }
} finally {
  await browser?.close();
  server.kill();
}
