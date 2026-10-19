import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: 'http://localhost:4173', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173/en',
    reuseExistingServer: false,
    env: {
      DEMO_FAILURES: 'true',
      SESSION_SECRET: 'local-test-session-secret-at-least-32-characters',
    },
  },
});
