import axios from 'axios'

import { appEnv } from '@/shared/api/env'

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status

    if (status === 402) {
      return 'Дневной лимит запросов Kinopoisk API исчерпан. Укажите новый API-ключ.'
    }

    if (status === 429) {
      return 'Слишком много запросов к Kinopoisk API. Подождите немного и повторите попытку.'
    }

    const responseMessage = error.response?.data?.message

    if (typeof responseMessage === 'string' && responseMessage.trim() !== '') {
      return responseMessage
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Не удалось выполнить запрос к Kinopoisk API.'
}

export const apiClient = axios.create({
  baseURL: appEnv.apiBaseUrl,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': appEnv.apiKey,
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(new Error(getApiErrorMessage(error))),
)
