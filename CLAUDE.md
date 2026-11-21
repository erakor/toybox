# Toybox

React component library (`src/lib`, imported as `@erakor/toybox`) plus the BrickVolt demo app
(`src/App.tsx`, `src/components/views`, `src/hooks`). The demo must import only from `@erakor/toybox`.

## Commands

- Checks: `pnpm typecheck && pnpm lint && pnpm format:check && pnpm knip && pnpm test`
- Stories: `pnpm test:storybook` (builds the lib first; needs Chromium, set `CHROMIUM_PATH` if
  Playwright's own browser is missing), `pnpm build-storybook`
- Library: `pnpm build:lib` (also runs on install via `prepare`); demo: `pnpm build`
- Node 26 and pnpm 12. Lint and format config come from `@erakor/toolchain` (pinned tag).

## Conventions

- No enums (`erasableSyntaxOnly`): use `as const` objects with a same-named union type.
- Themes are scoped with `data-toybox-theme`, never written to `<html>`. After editing `themes.ts`
  run `pnpm gen:themes`; a unit test fails if `themes.css` is stale.
- Every library component has a `*.stories.tsx` next to it. Stories run axe (`a11y: error`), so use
  text colors with 4.5:1 contrast. Avoid out of gamut Tailwind colors like `red-600` behind white
  text, axe cannot read them; use a hex value.
- Shared mock data lives in `src/lib/fixtures.ts`; `useFactoryTelemetry` imports it.
- Do not add dependencies nothing imports (knip fails CI).
