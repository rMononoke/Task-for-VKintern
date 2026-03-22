type ImportMetaEnvLike = {
  readonly VITE_APP_TITLE?: string
  readonly VITE_KINOPOISK_API_BASE_URL?: string
  readonly VITE_KINOPOISK_API_KEY?: string
}

export type AppEnv = {
  appTitle: string
  apiBaseUrl: string
  apiKey: string
}

function ensureEnvValue(value: string | undefined, key: string) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }

  return value
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

export function getAppEnv(env: ImportMetaEnvLike): AppEnv {
  return {
    appTitle: env.VITE_APP_TITLE?.trim() || 'Film Search',
    apiBaseUrl: trimTrailingSlash(
      ensureEnvValue(
        env.VITE_KINOPOISK_API_BASE_URL,
        'VITE_KINOPOISK_API_BASE_URL',
      ),
    ),
    apiKey: ensureEnvValue(env.VITE_KINOPOISK_API_KEY, 'VITE_KINOPOISK_API_KEY'),
  }
}

export const appEnv = getAppEnv(import.meta.env)
