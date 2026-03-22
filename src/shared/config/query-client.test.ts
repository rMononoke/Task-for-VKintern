import { describe, expect, it } from 'vitest'

import {
  createQueryClient,
  shouldRetryCatalogQuery,
} from '@/shared/config/query-client'

describe('query-client', () => {
  it('does not retry quota and access errors', () => {
    expect(
      shouldRetryCatalogQuery(
        0,
        new Error('You exceeded the quota. You have sent 516 request, but available 500 per day'),
      ),
    ).toBe(false)

    expect(
      shouldRetryCatalogQuery(
        0,
        new Error('You don\'t have permissions. See https://kinopoiskapiunofficial.tech'),
      ),
    ).toBe(false)
  })

  it('retries transient errors only once', () => {
    expect(shouldRetryCatalogQuery(0, new Error('Network Error'))).toBe(true)
    expect(shouldRetryCatalogQuery(1, new Error('Network Error'))).toBe(false)
  })

  it('installs the retry strategy into the shared query client', () => {
    const queryClient = createQueryClient()
    const retryOption = queryClient.getDefaultOptions().queries?.retry

    expect(retryOption).toBeTypeOf('function')
    expect((retryOption as typeof shouldRetryCatalogQuery)(0, new Error('Network Error'))).toBe(true)
    expect(
      (retryOption as typeof shouldRetryCatalogQuery)(
        0,
        new Error('You exceeded the quota. You have sent 516 request, but available 500 per day'),
      ),
    ).toBe(false)
  })
})
