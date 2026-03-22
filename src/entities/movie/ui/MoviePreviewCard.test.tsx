import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MoviePreviewCard } from '@/entities/movie/ui/MoviePreviewCard'
import { renderWithProviders } from '@/test/renderWithProviders'

describe('MoviePreviewCard', () => {
  it('renders the action button inside the same movie tile shell', () => {
    renderWithProviders(
      <MoviePreviewCard
        movie={{
          id: 1,
          title: 'Джентльмены',
          year: 2019,
          rating: 8.7,
          posterUrl: null,
          posterUrlPreview: null,
          countries: [],
          genres: ['криминал', 'боевик', 'комедия'],
        }}
        actionSlot={<button type="button">Сравнить</button>}
      />,
    )

    const actionButton = screen.getByRole('button', { name: 'Сравнить' })

    expect(actionButton.closest('.movie-card')).not.toBeNull()
  })
})
