export type AppTheme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'film-search:theme'

function isAppTheme(value: string | null): value is AppTheme {
  return value === 'light' || value === 'dark'
}

export function readThemePreference(): AppTheme {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

  return isAppTheme(storedTheme) ? storedTheme : 'light'
}

export function writeThemePreference(theme: AppTheme) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
}
