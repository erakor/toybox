import React, { createContext, useContext, useEffect, useState } from 'react'
import { STATION_THEMES, type StationThemeConfig, StationThemeId } from '../types/theme'

interface ThemeContextValue {
  theme: StationThemeConfig
  setThemeId: (id: StationThemeId) => void
  allThemes: StationThemeConfig[]
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: STATION_THEMES[0],
  setThemeId: () => {},
  allThemes: STATION_THEMES,
})

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState<StationThemeId>(StationThemeId.CockpitHorn)

  const theme = STATION_THEMES.find((t) => t.id === themeId) ?? STATION_THEMES[0]

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-style', theme.id)
    root.style.setProperty('--bv-canvas', theme.canvasBg)
    root.style.setProperty('--bv-plate', theme.plateBg)
    root.style.setProperty('--bv-plate-alt', theme.plateAltBg)
    root.style.setProperty('--bv-card', theme.cardBg)
    root.style.setProperty('--bv-card-header', theme.cardHeaderBg)
    root.style.setProperty('--bv-crt', theme.crtBg)
    root.style.setProperty('--bv-border', theme.borderColor)
    root.style.setProperty('--bv-shadow', theme.shadowColor)
    root.style.setProperty('--bv-ink', theme.inkText)
    root.style.setProperty('--bv-muted', theme.mutedText)
    document.body.style.backgroundColor = theme.canvasBg
    document.body.style.color = theme.inkText
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setThemeId, allThemes: STATION_THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useStationTheme() {
  return useContext(ThemeContext)
}
