import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { themesCss } from './css'
import { TOYBOX_THEMES, ToyboxThemeId } from './themes'

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

describe('themes', () => {
  it('has seven themes with unique ids', () => {
    expect(TOYBOX_THEMES).toHaveLength(7)
    expect(new Set(TOYBOX_THEMES.map((t) => t.id)).size).toBe(7)
    expect(Object.values(ToyboxThemeId)).toHaveLength(7)
  })

  it('keeps themes.css in sync with themes.ts (run pnpm gen:themes)', () => {
    const file = readFileSync(new URL('./themes.css', import.meta.url), 'utf8')
    const normalize = (css: string) => css.replaceAll('"', "'").replace(/\s+/g, ' ').trim()
    expect(normalize(file)).toBe(normalize(themesCss()))
  })

  it('meets WCAG AA text contrast on the dark and high contrast themes', () => {
    for (const id of [ToyboxThemeId.NightShift, ToyboxThemeId.HighContrast]) {
      const t = TOYBOX_THEMES.find((x) => x.id === id)!
      expect(contrast(t.inkText, t.canvasBg)).toBeGreaterThanOrEqual(4.5)
      expect(contrast(t.inkText, t.cardBg)).toBeGreaterThanOrEqual(4.5)
      expect(contrast(t.mutedText, t.cardBg)).toBeGreaterThanOrEqual(4.5)
      expect(contrast(t.accentText, t.accentBg)).toBeGreaterThanOrEqual(4.5)
    }
  })
})
