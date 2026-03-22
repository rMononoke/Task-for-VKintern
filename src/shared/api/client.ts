import axios from 'axios'

import { appEnv } from '@/shared/api/env'

function serializeApiParams(
  params: Record<
    string,
    boolean | number | string | Array<boolean | number | string> | undefined
  >,
) {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) {
      continue
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        searchParams.append(key, String(item))
      }

      continue
    }

    searchParams.append(key, String(value))
  }

  return searchParams.toString()
}

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status

    if (status === 401) {
      return 'Ключ PoiskKino API не принят. Проверьте значение в `.env.local`.'
    }

    if (status === 403) {
      return 'Суточный лимит запросов PoiskKino API исчерпан. Дождитесь сброса лимита или используйте другой ключ.'
    }

    if (status === 429) {
      return 'PoiskKino API временно ограничил частоту запросов. Попробуйте повторить попытку чуть позже.'
    }

    const responseMessage =
      error.response?.data?.message ?? error.response?.data?.error

    if (typeof responseMessage === 'string' && responseMessage.trim() !== '') {
      return responseMessage
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Не удалось выполнить запрос к PoiskKino API.'
}

export const apiClient = axios.create({
  baseURL: appEnv.apiBaseUrl,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': appEnv.apiKey,
  },
  paramsSerializer: {
    serialize: serializeApiParams,
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(new Error(getApiErrorMessage(error))),
)
