import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { TOYBOX_THEMES, ToyboxThemeId, type ToyboxThemeConfig } from './themes'

interface ToyboxThemeContextValue {
  theme: ToyboxThemeConfig
  setThemeId: (id: ToyboxThemeId) => void
  allThemes: ToyboxThemeConfig[]
}

const ToyboxThemeContext = createContext<ToyboxThemeContextValue>({
  theme: TOYBOX_THEMES[0],
  setThemeId: () => {},
  allThemes: TOYBOX_THEMES,
})

interface ToyboxThemeProviderProps {
  children: ReactNode
  /** Controlled theme id. Omit to let the provider keep its own state. */
  theme?: ToyboxThemeId
  /** Initial theme when uncontrolled. */
  defaultTheme?: ToyboxThemeId
  onThemeChange?: (id: ToyboxThemeId) => void
  className?: string
}

/**
 * Wraps children in an element carrying `data-toybox-theme`, so themes are scoped to
 * the subtree and can be nested. Never writes to `<html>`.
 */
export function ToyboxThemeProvider({
  children,
  theme: controlledId,
  defaultTheme = ToyboxThemeId.CockpitHorn,
  onThemeChange,
  className,
}: ToyboxThemeProviderProps) {
  const [innerId, setInnerId] = useState<ToyboxThemeId>(defaultTheme)
  const themeId = controlledId ?? innerId
  const theme = TOYBOX_THEMES.find((t) => t.id === themeId) ?? TOYBOX_THEMES[0]

  const value = useMemo<ToyboxThemeContextValue>(
    () => ({
      theme,
      allThemes: TOYBOX_THEMES,
      setThemeId: (id) => {
        setInnerId(id)
        onThemeChange?.(id)
      },
    }),
    [theme, onThemeChange],
  )

  return (
    <ToyboxThemeContext.Provider value={value}>
      <div
        data-toybox-theme={theme.id}
        className={`toybox-root${className ? ` ${className}` : ''}`}
      >
        {children}
      </div>
    </ToyboxThemeContext.Provider>
  )
}

export function useToyboxTheme(): ToyboxThemeContextValue {
  return useContext(ToyboxThemeContext)
}
