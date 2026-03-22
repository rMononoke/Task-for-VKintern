import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'

import { DEFAULT_MOVIE_FILTERS } from '@/entities/movie/model/constants'
import type { MovieFilters } from '@/entities/movie/model/types'
import {
  readStoredCatalogSearch,
  writeStoredCatalogSearch,
} from '@/features/movie-filters/model/catalogSearchStorage'
import {
  createMovieCatalogSearchParams,
  DEFAULT_CATALOG_FILTER_VALUES,
  parseMovieCatalogSearchParams,
  type MovieCatalogFilterValues,
} from '@/features/movie-filters/model/searchParams'

export function useMovieCatalogFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filterValues = parseMovieCatalogSearchParams(searchParams)
  const serializedSearchParams = searchParams.toString()
  const hasHydratedStoredSearch = useRef(false)

  useEffect(() => {
    if (serializedSearchParams !== '') {
      writeStoredCatalogSearch(`?${serializedSearchParams}`)
      hasHydratedStoredSearch.current = true
      return
    }

    if (!hasHydratedStoredSearch.current) {
      const storedSearch = readStoredCatalogSearch()

      hasHydratedStoredSearch.current = true

      if (storedSearch !== '') {
        setSearchParams(new URLSearchParams(storedSearch), {
          replace: true,
        })
      }

      return
    }

    writeStoredCatalogSearch('')
  }, [serializedSearchParams, setSearchParams])

  function updateFilterValues(nextValues: MovieCatalogFilterValues) {
    setSearchParams(createMovieCatalogSearchParams(nextValues), {
      replace: true,
    })
  }

  return {
    filterValues,
    queryFilters: {
      ...DEFAULT_MOVIE_FILTERS,
      ...filterValues,
      page: 1,
    } satisfies MovieFilters,
    toggleGenre(genreId: string) {
      const nextGenres = filterValues.genres.includes(genreId)
        ? filterValues.genres.filter((currentGenreId) => currentGenreId !== genreId)
        : [...filterValues.genres, genreId]

      updateFilterValues({
        ...filterValues,
        genres: nextGenres,
      })
    },
    setRatingFrom(ratingFrom: number) {
      updateFilterValues({
        ...filterValues,
        ratingFrom,
      })
    },
    setRatingTo(ratingTo: number) {
      updateFilterValues({
        ...filterValues,
        ratingTo,
      })
    },
    setYearFrom(yearFrom: number) {
      updateFilterValues({
        ...filterValues,
        yearFrom,
      })
    },
    setYearTo(yearTo: number) {
      updateFilterValues({
        ...filterValues,
        yearTo,
      })
    },
    resetFilters() {
      updateFilterValues(DEFAULT_CATALOG_FILTER_VALUES)
    },
  }
}
