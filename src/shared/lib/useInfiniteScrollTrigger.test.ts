import assert from 'node:assert/strict'
import test from 'node:test'

import { shouldLoadMoreByViewport } from './useInfiniteScrollTrigger.ts'

test('shouldLoadMoreByViewport triggers loading when sentinel is near the viewport', () => {
  assert.equal(
    shouldLoadMoreByViewport({
      canLoadMore: true,
      isLoading: false,
      sentinelTop: 900,
      viewportHeight: 700,
      preloadDistance: 320,
    }),
    true,
  )
})

test('shouldLoadMoreByViewport blocks loading when request is already in progress', () => {
  assert.equal(
    shouldLoadMoreByViewport({
      canLoadMore: true,
      isLoading: true,
      sentinelTop: 900,
      viewportHeight: 700,
      preloadDistance: 320,
    }),
    false,
  )
})
