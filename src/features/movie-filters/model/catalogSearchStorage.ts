export const CATALOG_SEARCH_STORAGE_KEY = 'vk-films:catalog-search'

function getCatalogSearchStorage(storage: Storage | null = null) {
  if (storage) {
    return storage
  }

  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage
}

export function readStoredCatalogSearch(storage?: Storage | null) {
  const catalogSearchStorage = getCatalogSearchStorage(storage)

  if (!catalogSearchStorage) {
    return ''
  }

  try {
    const storedSearch = catalogSearchStorage.getItem(CATALOG_SEARCH_STORAGE_KEY)

    if (!storedSearch) {
      return ''
    }

    return storedSearch.startsWith('?') ? storedSearch : `?${storedSearch}`
  } catch {
    return ''
  }
}

export function writeStoredCatalogSearch(
  search: string,
  storage?: Storage | null,
) {
  const catalogSearchStorage = getCatalogSearchStorage(storage)

  if (!catalogSearchStorage) {
    return
  }

  try {
    if (search === '' || search === '?') {
      catalogSearchStorage.removeItem(CATALOG_SEARCH_STORAGE_KEY)
      return
    }

    catalogSearchStorage.setItem(
      CATALOG_SEARCH_STORAGE_KEY,
      search.startsWith('?') ? search : `?${search}`,
    )
  } catch {
    return
  }
}
