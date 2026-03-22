import { describe, expect, it } from 'vitest'

import {
  readThemePreference,
  THEME_STORAGE_KEY,
  writeThemePreference,
} from '@/app/theme/model/themeStorage'

describe('themeStorage', () => {
  it('returns light theme by default', () => {
    expect(readThemePreference()).toBe('light')
  })

  it('reads a stored theme value', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark')

    expect(readThemePreference()).toBe('dark')
  })

  it('writes a theme value to localStorage', () => {
    writeThemePreference('dark')

    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })
})
