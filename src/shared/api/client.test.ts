import { describe, expect, it } from 'vitest'

import { getApiErrorMessage } from '@/shared/api/client'

describe('api client error mapping', () => {
  it('maps quota exceeded errors to a friendly message', () => {
    expect(
      getApiErrorMessage({
        isAxiosError: true,
        response: {
          status: 402,
          data: {
            message:
              'You exceeded the quota. You have sent 516 request, but available 500 per day',
          },
        },
      }),
    ).toBe('Дневной лимит запросов Kinopoisk API исчерпан. Укажите новый API-ключ.')
  })

  it('maps too many requests errors to a friendly message', () => {
    expect(
      getApiErrorMessage({
        isAxiosError: true,
        response: {
          status: 429,
          data: {
            message: 'Too many requests',
          },
        },
      }),
    ).toBe('Слишком много запросов к Kinopoisk API. Подождите немного и повторите попытку.')
  })
})
