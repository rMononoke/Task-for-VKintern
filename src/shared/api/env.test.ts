import { describe, expect, it } from 'vitest'

import { getAppEnv } from '@/shared/api/env'

describe('env', () => {
  it('maps and normalizes environment values', () => {
    expect(
      getAppEnv({
        VITE_APP_TITLE: '  Film Search  ',
        VITE_KINOPOISK_API_BASE_URL: 'https://example.com/api/',
        VITE_KINOPOISK_API_KEY: 'secret',
      }),
    ).toEqual({
      appTitle: 'Film Search',
      apiBaseUrl: 'https://example.com/api',
      apiKey: 'secret',
    })
  })

  it('throws when required variables are missing', () => {
    expect(() =>
      getAppEnv({
        VITE_APP_TITLE: 'Film Search',
      }),
    ).toThrow('Missing required environment variable: VITE_KINOPOISK_API_BASE_URL')
  })
})
