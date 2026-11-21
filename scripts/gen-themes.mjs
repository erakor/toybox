// Regenerates src/lib/theme/themes.css from themes.ts. Run: pnpm gen:themes
import { writeFileSync } from 'node:fs'
import { createServer } from 'vite'

const server = await createServer({
  configFile: false,
  server: { middlewareMode: true },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true },
  logLevel: 'error',
})
try {
  const { themesCss } = await server.ssrLoadModule('/src/lib/theme/css.ts')
  writeFileSync(new URL('../src/lib/theme/themes.css', import.meta.url), themesCss())
} finally {
  await server.close()
}
