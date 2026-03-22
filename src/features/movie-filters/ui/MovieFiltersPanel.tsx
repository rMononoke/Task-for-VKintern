import { useEffect, useId, useState, type KeyboardEvent } from 'react'
import { Button, Spinner, Text } from '@vkontakte/vkui'

import type { MovieFilterOption } from '@/entities/movie/model/types'
import {
  DEFAULT_CATALOG_FILTER_VALUES,
  type MovieCatalogFilterValues,
} from '@/features/movie-filters/model/searchParams'

const CURRENT_YEAR = new Date().getFullYear()
const MIN_AVAILABLE_YEAR = 1888

type MovieFiltersPanelProps = {
  activeFiltersCount: number
  genreOptions: MovieFilterOption[]
  isGenreOptionsLoading: boolean
  values: MovieCatalogFilterValues
  onToggleGenre: (genreId: string) => void
  onRatingFromChange: (ratingFrom: number) => void
  onRatingToChange: (ratingTo: number) => void
  onYearFromChange: (yearFrom: number) => void
  onYearToChange: (yearTo: number) => void
  onReset: () => void
}

type DraftNumberInputProps = {
  label: string
  value: number
  inputMode: 'decimal' | 'numeric'
  fallback: number
  min: number
  max: number
  sanitize: (value: string) => string
  onCommit: (value: number) => void
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function sanitizeIntegerDraft(value: string) {
  return value.replace(/[^\d]/g, '')
}

function sanitizeDecimalDraft(value: string) {
  const normalizedValue = value.replace(',', '.').replace(/[^\d.]/g, '')
  const [integerPart = '', ...fractionParts] = normalizedValue.split('.')

  if (fractionParts.length === 0) {
    return integerPart
  }

  return `${integerPart}.${fractionParts.join('')}`
}

function parseCommittedNumber(
  value: string,
  fallback: number,
  min: number,
  max: number,
) {
  if (value.trim() === '') {
    return fallback
  }

  const parsedValue = Number(value)

  if (Number.isNaN(parsedValue)) {
    return fallback
  }

  return clamp(parsedValue, min, max)
}

function handleCommitByEnter(
  event: KeyboardEvent<HTMLInputElement>,
  commit: () => void,
) {
  if (event.key !== 'Enter') {
    return
  }

  commit()
  event.currentTarget.blur()
}

function DraftNumberInput({
  label,
  value,
  inputMode,
  fallback,
  min,
  max,
  sanitize,
  onCommit,
}: DraftNumberInputProps) {
  const [draftValue, setDraftValue] = useState(String(value))

  useEffect(() => {
    setDraftValue(String(value))
  }, [value])

  function commit() {
    const nextValue = parseCommittedNumber(draftValue, fallback, min, max)

    setDraftValue(String(nextValue))

    if (nextValue !== value) {
      onCommit(nextValue)
    }
  }

  function handleChange(nextRawValue: string) {
    const nextDraftValue = sanitize(nextRawValue)

    setDraftValue(nextDraftValue)

    if (nextDraftValue.trim() === '') {
      if (value !== fallback) {
        onCommit(fallback)
      }

      return
    }

    const parsedValue = Number(nextDraftValue)

    if (
      Number.isNaN(parsedValue) ||
      parsedValue < min ||
      parsedValue > max ||
      parsedValue === value
    ) {
      return
    }

    onCommit(parsedValue)
  }

  return (
    <label className="filter-field">
      <span className="filter-field__label">{label}</span>
      <input
        className="filter-field__input"
        type="text"
        inputMode={inputMode}
        value={draftValue}
        onChange={(event) => handleChange(event.currentTarget.value)}
        onBlur={commit}
        onKeyDown={(event) => handleCommitByEnter(event, commit)}
      />
    </label>
  )
}

export function MovieFiltersPanel({
  activeFiltersCount,
  genreOptions,
  isGenreOptionsLoading,
  values,
  onToggleGenre,
  onRatingFromChange,
  onRatingToChange,
  onYearFromChange,
  onYearToChange,
  onReset,
}: MovieFiltersPanelProps) {
  const filtersBodyId = useId()
  const [isCollapsed, setIsCollapsed] = useState(activeFiltersCount === 0)

  return (
    <div className="filters-panel">
      <div className="filters-panel__header">
        <div className="filters-panel__copy">
          <p className="surface-section__eyebrow">Фильтры</p>
          <Text>
            Здесь можно выбрать несколько жанров одновременно, а также сузить
            результаты по году выхода и рейтингу.
          </Text>
        </div>

        <div className="catalog-summary">
          <span className="catalog-summary__item">
            Активно фильтров: {activeFiltersCount}
          </span>
          <Button
            mode="secondary"
            size="m"
            aria-expanded={!isCollapsed}
            aria-controls={filtersBodyId}
            onClick={() => setIsCollapsed((currentValue) => !currentValue)}
          >
            {isCollapsed ? 'Показать фильтры' : 'Скрыть фильтры'}
          </Button>
          <Button mode="secondary" size="m" onClick={onReset}>
            Сбросить
          </Button>
        </div>
      </div>

      {!isCollapsed ? (
        <div id={filtersBodyId} className="filters-layout">
          <div className="filter-group">
            <div className="filter-group__label-row">
              <span className="filter-group__label">Жанры</span>
              <Text>Можно выбрать несколько значений сразу</Text>
            </div>

            {isGenreOptionsLoading ? (
              <div className="filters-loading">
                <Spinner size="s" />
                <Text>Загружаем список жанров...</Text>
              </div>
            ) : (
              <div className="filter-chip-list">
                {genreOptions.map((genre) => {
                  const isSelected = values.genres.includes(genre.id)

                  return (
                    <button
                      key={genre.id}
                      type="button"
                      className={`filter-chip${isSelected ? ' filter-chip--active' : ''}`}
                      aria-pressed={isSelected}
                      onClick={() => onToggleGenre(genre.id)}
                    >
                      {genre.label}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="filter-grid">
            <DraftNumberInput
              label="Рейтинг от"
              value={values.ratingFrom}
              inputMode="decimal"
              fallback={DEFAULT_CATALOG_FILTER_VALUES.ratingFrom}
              min={0}
              max={10}
              sanitize={sanitizeDecimalDraft}
              onCommit={onRatingFromChange}
            />

            <DraftNumberInput
              label="Рейтинг до"
              value={values.ratingTo}
              inputMode="decimal"
              fallback={DEFAULT_CATALOG_FILTER_VALUES.ratingTo}
              min={0}
              max={10}
              sanitize={sanitizeDecimalDraft}
              onCommit={onRatingToChange}
            />

            <DraftNumberInput
              label="Год от"
              value={values.yearFrom}
              inputMode="numeric"
              fallback={DEFAULT_CATALOG_FILTER_VALUES.yearFrom}
              min={MIN_AVAILABLE_YEAR}
              max={CURRENT_YEAR}
              sanitize={sanitizeIntegerDraft}
              onCommit={onYearFromChange}
            />

            <DraftNumberInput
              label="Год до"
              value={values.yearTo}
              inputMode="numeric"
              fallback={DEFAULT_CATALOG_FILTER_VALUES.yearTo}
              min={MIN_AVAILABLE_YEAR}
              max={CURRENT_YEAR}
              sanitize={sanitizeIntegerDraft}
              onCommit={onYearToChange}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
