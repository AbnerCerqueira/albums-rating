import { loadEnvFile } from 'node:process'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

loadEnvFile('.env.test')

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    coverage: {
      include: ['src/contexts/**'],
      exclude: ['src/contexts/!common'],
      provider: 'v8',
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['test/unit/**/*.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'integration',
          include: ['test/integration/**/*.test.ts'],
          globalSetup: 'test/global-setup.ts',
          setupFiles: ['test/setup-files/database.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'e2e',
          include: ['test/e2e/**/*.test.ts'],
          globalSetup: 'test/global-setup.ts',
          setupFiles: ['test/setup-files/database.ts'],
        },
      },
    ],
  },
})
