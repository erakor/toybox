import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        test: { name: 'unit', environment: 'node', include: ['src/**/*.test.ts'] },
      },
      {
        extends: true,
        plugins: [storybookTest({ configDir: '.storybook' })],
        // Tailwind's dev server adds utilities lazily, which races with axe. Test against the built CSS.
        resolve: {
          alias: {
            '@erakor/toybox/styles.css': fileURLToPath(
              new URL('./dist/toybox.css', import.meta.url),
            ),
          },
        },
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({
              launchOptions: {
                executablePath: process.env.CHROMIUM_PATH ?? undefined,
                args: ['--no-sandbox'],
              },
            }),
            instances: [{ browser: 'chromium', viewport: { width: 1280, height: 1600 } }],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
})
