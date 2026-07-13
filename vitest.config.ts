import { loadEnvFile } from 'node:process'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

loadEnvFile('.env.test')

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      exclude: ['src/contexts/!common'],
      include: ['src/contexts/**'],
      provider: 'v8',
    },
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          include: ['test/**/unit/**/*.test.ts'],
          name: 'unit',
        },
      },

      {
        extends: true,
        test: {
          globalSetup: 'test/global-setup.ts',
          include: ['test/**/e2e/**/*.test.ts'],
          name: 'e2e',
          setupFiles: ['test/setup-files/database.ts'],
        },
      },
    ],
  },
})
