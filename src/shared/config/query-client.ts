import { QueryClient } from '@tanstack/react-query'

const NON_RETRIABLE_ERROR_PATTERNS = [
  /api-ключ/i,
  /лимит/i,
  /quota/i,
  /exceeded the quota/i,
  /permissions/i,
  /don't have permissions/i,
  /слишком много запросов/i,
  /status code 40[129]/i,
]

export function shouldRetryCatalogQuery(
  failureCount: number,
  error: unknown,
) {
  if (error instanceof Error) {
    const message = error.message.trim()

    if (
      NON_RETRIABLE_ERROR_PATTERNS.some((pattern) => pattern.test(message))
    ) {
      return false
    }
  }

  return failureCount < 1
}

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: shouldRetryCatalogQuery,
        staleTime: 1000 * 60 * 5,
      },
    },
  })
}
