import { defineConfig, devices } from '@playwright/test'

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:5173'
const CI = !!process.env.CI

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 2 : undefined,
  reporter: CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: BASE_URL,
    locale: 'pt-BR',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, grep: /@mobile/ },
  ],

  // Sobe backend (profile dev) e frontend automaticamente; reaproveita se já estiverem rodando.
  // O PostgreSQL precisa estar no ar: `docker compose up -d` na raiz do repositório.
  webServer: [
    {
      command: './mvnw -q spring-boot:run -Dspring-boot.run.profiles=dev',
      cwd: '../backend',
      port: 8080,
      timeout: 180_000,
      reuseExistingServer: !CI,
      env: {
        ...(process.env.E2E_DB_URL ? { DB_URL: process.env.E2E_DB_URL } : {}),
      },
    },
    {
      command: 'npm run dev',
      cwd: '../frontend',
      url: BASE_URL,
      timeout: 60_000,
      reuseExistingServer: !CI,
    },
  ],
})
