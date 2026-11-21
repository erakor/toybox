# Toybox

Toy-inspired React components: 8 primitives, 9 instruments and an energy flow chart, with 7 themes.
The repo also holds the BrickVolt demo dashboard, which imports only from the library.

## Install

Toybox is installed from GitHub and is not published to npm. Pin a release tag:

```bash
pnpm add github:erakor/toybox#vX.Y.Z react react-dom lucide-react
```

The package builds `dist/` on install through its `prepare` script.

## Use

```tsx
import { Button, ToyboxThemeProvider, ToyboxThemeId } from '@erakor/toybox'
import '@erakor/toybox/styles.css'

export function App() {
  return (
    <ToyboxThemeProvider defaultTheme={ToyboxThemeId.NightShift}>
      <Button variant="accent">Dispatch</Button>
    </ToyboxThemeProvider>
  )
}
```

`ToyboxThemeProvider` renders a wrapper with `data-toybox-theme="<id>"`, so themes are scoped to a
subtree and can be nested. It never writes to `<html>`. Read the active theme with `useToyboxTheme()`.

## Themes

`cockpit-horn`, `dump-cab`, `lineless-blocks`, `cream-decal`, `screenprint-toy`, `night-shift` (dark)
and `high-contrast`.

To add a theme:

1. Add a config to `src/lib/theme/themes.ts` (and a `ToyboxThemeId` entry).
2. Run `pnpm gen:themes` to regenerate `src/lib/theme/themes.css`.
3. Add any border or shadow rules for it to `src/lib/styles.css`.

## Development

| Command                | What it does                                                         |
| ---------------------- | -------------------------------------------------------------------- |
| `pnpm dev`             | Demo app on port 3000                                                |
| `pnpm storybook`       | Storybook on port 6006, theme switcher in the toolbar                |
| `pnpm build:lib`       | Library build into `dist/` (ESM, types, `toybox.css`)                |
| `pnpm build`           | Demo build into `demo-dist/`                                         |
| `pnpm build-storybook` | Static Storybook into `storybook-static/`                            |
| `pnpm test`            | Unit tests                                                           |
| `pnpm test:storybook`  | Story tests in Chromium: play functions and a11y checks, all stories |

Checks, as run in CI: `pnpm typecheck && pnpm lint && pnpm format:check && pnpm knip && pnpm test`.
Requires Node 26 and pnpm 12 (see `.nvmrc`). Shared config comes from
[erakor/toolchain](https://github.com/erakor/toolchain).
