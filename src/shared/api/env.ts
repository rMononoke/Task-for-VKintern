type ImportMetaEnvLike = {
  readonly VITE_APP_TITLE?: string
  readonly VITE_POISKKINO_API_BASE_URL?: string
  readonly VITE_POISKKINO_API_KEY?: string
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

function pickEnvValue(
  env: ImportMetaEnvLike,
  keys: string[],
) {
  for (const key of keys) {
    const value = env[key as keyof ImportMetaEnvLike]

    if (typeof value === 'string' && value.trim() !== '') {
      return value
    }
  }

  return undefined
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

export function getAppEnv(env: ImportMetaEnvLike): AppEnv {
  const apiBaseUrl = pickEnvValue(env, [
    'VITE_POISKKINO_API_BASE_URL',
    'VITE_KINOPOISK_API_BASE_URL',
  ])
  const apiKey = pickEnvValue(env, [
    'VITE_POISKKINO_API_KEY',
    'VITE_KINOPOISK_API_KEY',
  ])

  return {
    appTitle: env.VITE_APP_TITLE?.trim() || 'Film Search',
    apiBaseUrl: trimTrailingSlash(
      ensureEnvValue(apiBaseUrl, 'VITE_POISKKINO_API_BASE_URL'),
    ),
    apiKey: ensureEnvValue(apiKey, 'VITE_POISKKINO_API_KEY'),
  }
}

export const appEnv = getAppEnv(import.meta.env)
