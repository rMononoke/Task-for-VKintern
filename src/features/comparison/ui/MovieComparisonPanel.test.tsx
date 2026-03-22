import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { MovieComparisonPanel } from '@/features/comparison/ui/MovieComparisonPanel'
import { renderWithProviders } from '@/test/renderWithProviders'

const selectedMovies = [
  {
    id: 1,
    title: '1+1',
    year: 2011,
    rating: 8.9,
    posterUrl: null,
    posterUrlPreview: 'poster-1',
    countries: [],
    genres: ['драма'],
  },
  {
    id: 2,
    title: 'Брат',
    year: 1997,
    rating: 8.4,
    posterUrl: null,
    posterUrlPreview: 'poster-2',
    countries: [],
    genres: ['драма'],
  },
]

describe('MovieComparisonPanel', () => {
  it('allows collapsing and expanding the comparison body', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <MovieComparisonPanel
        selectedMovies={selectedMovies}
        comparisonMovies={[]}
        isPending={false}
        onClear={() => undefined}
      />,
    )

    const toggleButton = screen.getByRole('button', { name: 'Скрыть сравнение' })
    const comparisonRegion = screen.getByRole('region', {
      name: 'Область сравнения фильмов',
    })

    expect(comparisonRegion).toBeVisible()

    await user.click(toggleButton)

    expect(screen.getByRole('button', { name: 'Показать сравнение' })).toBeInTheDocument()
    expect(comparisonRegion).not.toBeVisible()
  })
})
