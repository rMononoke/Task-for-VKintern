import { useEffect, useMemo, useState, type PropsWithChildren } from 'react'

import { ThemeContext } from '@/app/theme/model/ThemeContext'
import {
  readThemePreference,
  writeThemePreference,
  type AppTheme,
} from '@/app/theme/model/themeStorage'

function applyTheme(theme: AppTheme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  document.body.dataset.theme = theme
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<AppTheme>(() => readThemePreference())

  useEffect(() => {
    applyTheme(theme)
    writeThemePreference(theme)
  }, [theme])

  const contextValue = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      toggleTheme: () =>
        setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light')),
    }),
    [theme],
  )

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}
