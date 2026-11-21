import { withThemeFromJSXProvider } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react-vite'
import { TOYBOX_THEMES, ToyboxThemeProvider } from '@erakor/toybox'
import '@erakor/toybox/styles.css'

const themes = Object.fromEntries(TOYBOX_THEMES.map((t) => [t.id, t.id]))

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    a11y: { test: 'error' },
  },
  decorators: [
    withThemeFromJSXProvider({
      themes,
      defaultTheme: TOYBOX_THEMES[0].id,
      Provider: ({ theme, children }) => (
        <ToyboxThemeProvider theme={theme as (typeof TOYBOX_THEMES)[number]['id']} className="p-6">
          {children}
        </ToyboxThemeProvider>
      ),
    }),
  ],
}

export default preview
