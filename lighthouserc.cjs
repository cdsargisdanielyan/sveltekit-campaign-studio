const sharedAssertions = {
  'categories:performance': [
    'error',
    { minScore: 0.95, aggregationMethod: 'median-run' },
  ],
  'categories:accessibility': ['error', { minScore: 0.95 }],
  'categories:best-practices': ['error', { minScore: 0.95 }],
  'categories:seo': ['error', { minScore: 0.95 }],
  'largest-contentful-paint': [
    'error',
    { maxNumericValue: 2000, aggregationMethod: 'median-run' },
  ],
  'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
  'total-blocking-time': ['error', { maxNumericValue: 200 }],
};
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview -- --port 4173 --strictPort',
      startServerReadyPattern: 'Local',
      url: [
        'http://localhost:4173/en',
        'http://localhost:4173/en/blog/sub-second-lcp-on-a-content-site',
        'http://localhost:4173/en/dashboard/items',
      ],
      numberOfRuns: 3,
      puppeteerScript: './scripts/lighthouse-auth.cts',
      puppeteerLaunchOptions: { headless: true, args: ['--no-sandbox'] },
      settings: {
        formFactor: 'mobile',
        screenEmulation: {
          mobile: true,
          width: 412,
          height: 823,
          deviceScaleFactor: 1.75,
          disabled: false,
        },
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4,
          requestLatencyMs: 562.5,
          downloadThroughputKbps: 1474.56,
          uploadThroughputKbps: 675,
        },
        // Authentication must survive Lighthouse storage reset between runs.
        disableStorageReset: true,
        chromeFlags: '--no-sandbox',
      },
    },
    assert: { assertions: sharedAssertions },
    upload: { target: 'filesystem', outputDir: '.lighthouseci/reports' },
  },
};
