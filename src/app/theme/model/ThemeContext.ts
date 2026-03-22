import { createContext } from 'react'

import type { AppTheme } from '@/app/theme/model/themeStorage'

export type ThemeContextValue = {
  theme: AppTheme
  isDark: boolean
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
