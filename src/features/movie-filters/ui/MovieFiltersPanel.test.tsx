import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { MovieFiltersPanel } from '@/features/movie-filters/ui/MovieFiltersPanel'
import { renderWithProviders } from '@/test/renderWithProviders'

function renderFiltersPanel() {
  const props = {
    activeFiltersCount: 0,
    genreOptions: [{ id: 1, label: 'драма' }],
    isGenreOptionsLoading: false,
    values: {
      genres: [],
      ratingFrom: 0,
      ratingTo: 10,
      yearFrom: 1990,
      yearTo: new Date().getFullYear(),
    },
    onToggleGenre: vi.fn(),
    onRatingFromChange: vi.fn(),
    onRatingToChange: vi.fn(),
    onYearFromChange: vi.fn(),
    onYearToChange: vi.fn(),
    onReset: vi.fn(),
  }

  renderWithProviders(<MovieFiltersPanel {...props} />)

  return props
}

describe('MovieFiltersPanel', () => {
  it('lets the user fully clear a field and type a new year manually', async () => {
    const user = userEvent.setup()
    const props = renderFiltersPanel()

    await user.click(screen.getByRole('button', { name: 'Показать фильтры' }))

    const input = screen.getByLabelText('Год от')

    await user.clear(input)
    await user.type(input, '1995')
    await user.tab()

    expect(props.onYearFromChange).toHaveBeenCalledWith(1995)
  })

  it('keeps years earlier than 1990 available after manual input', async () => {
    const user = userEvent.setup()
    const props = renderFiltersPanel()

    await user.click(screen.getByRole('button', { name: 'Показать фильтры' }))

    const input = screen.getByLabelText('Год от')

    await user.clear(input)
    await user.type(input, '1888')
    await user.tab()

    expect(props.onYearFromChange).toHaveBeenCalledWith(1888)
  })

  it('is collapsed by default and expands by button click', async () => {
    const user = userEvent.setup()

    renderFiltersPanel()

    expect(screen.queryByLabelText('Рейтинг от')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Показать фильтры' }))

    expect(screen.getByLabelText('Рейтинг от')).toBeInTheDocument()
  })
})
