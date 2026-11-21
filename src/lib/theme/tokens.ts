import type { ToyboxThemeConfig } from './themes'

/** Color tokens that become `--bv-*` CSS variables, in a stable order. */
const CSS_VAR_TOKENS = {
  canvasBg: '--bv-canvas',
  sidebarBg: '--bv-sidebar',
  sidebarHeaderBg: '--bv-sidebar-header',
  topBarBg: '--bv-top-bar',
  bezelBg: '--bv-bezel',
  nameplateBg: '--bv-nameplate',
  plateBg: '--bv-plate',
  plateAltBg: '--bv-plate-alt',
  cardBg: '--bv-card',
  cardHeaderBg: '--bv-card-header',
  crtBg: '--bv-crt',
  borderColor: '--bv-border',
  shadowColor: '--bv-shadow',
  inkText: '--bv-ink',
  mutedText: '--bv-muted',
  accentBg: '--bv-accent',
  accentText: '--bv-accent-text',
  kpiYellowBg: '--bv-kpi-yellow',
  kpiBlueBg: '--bv-kpi-blue',
  pipeLight: '--bv-pipe-light',
  pipeLavender: '--bv-pipe-lavender',
  pipeRed: '--bv-pipe-red',
} as const satisfies Partial<Record<keyof ToyboxThemeConfig, string>>

/** One `[data-toybox-theme]` CSS block for a theme. */
export function themeCssBlock(theme: ToyboxThemeConfig, selectorPrefix = ''): string {
  const lines = Object.entries(CSS_VAR_TOKENS).map(
    ([token, cssVar]) =>
      `  ${cssVar}: ${String(theme[token as keyof typeof CSS_VAR_TOKENS]).toLowerCase()};`,
  )
  return `${selectorPrefix}[data-toybox-theme='${theme.id}'] {\n${lines.join('\n')}\n}\n`
}
