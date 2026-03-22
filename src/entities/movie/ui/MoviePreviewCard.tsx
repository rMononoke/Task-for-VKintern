import type { ReactNode } from 'react'
import { Text, Title } from '@vkontakte/vkui'
import { Link } from 'react-router'

import type { MovieCard } from '@/entities/movie/model/types'

type MoviePreviewCardProps = {
  movie: MovieCard
  actionSlot?: ReactNode
}

function formatRating(rating: number | null) {
  return rating === null ? 'Нет оценки' : `KP ${rating.toFixed(1)}`
}

export function MoviePreviewCard({ movie, actionSlot }: MoviePreviewCardProps) {
  const genresLabel =
    movie.genres.length > 0
      ? movie.genres.slice(0, 3).join(' • ')
      : 'Жанр не указан'

  return (
    <div className="movie-card">
      <div className="movie-card__body">
        <Link className="movie-card__link" to={`/movies/${movie.id}`}>
          <div className="movie-card__poster">
            {movie.posterUrlPreview ? (
              <img
                className="movie-card__image"
                src={movie.posterUrlPreview}
                alt={`Постер: ${movie.title}`}
                loading="lazy"
              />
            ) : (
              <div className="movie-card__image movie-card__image--fallback">
                <span>Нет постера</span>
              </div>
            )}
          </div>

          <div className="movie-card__content">
            <div className="movie-card__chips">
              <span className="movie-chip">{formatRating(movie.rating)}</span>
              <span className="movie-chip movie-chip--muted">
                {movie.year ?? 'Год не указан'}
              </span>
            </div>

            <Title level="3" weight="2">
              {movie.title}
            </Title>
            <Text>{genresLabel}</Text>
          </div>
        </Link>

        {actionSlot ? <div className="movie-card__actions">{actionSlot}</div> : null}
      </div>
    </div>
  )
}
