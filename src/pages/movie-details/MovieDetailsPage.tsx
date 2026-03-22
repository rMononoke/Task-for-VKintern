import { useState } from 'react'
import { Button, Spinner, Text } from '@vkontakte/vkui'
import { useParams } from 'react-router'

import { useMovieDetails } from '@/entities/movie/api/useMovieDetails'
import { useComparison } from '@/features/comparison/model/useComparison'
import { useFavorites } from '@/features/favorites/model/useFavorites'
import { FavoriteConfirmModal } from '@/features/favorites/ui/FavoriteConfirmModal'

function formatRating(rating: number | null) {
  return rating === null ? 'Нет оценки' : `KP ${rating.toFixed(1)}`
}

function formatDuration(duration: number | null) {
  return duration === null ? 'Длительность не указана' : `${duration} мин`
}

export function MovieDetailsPage() {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const { movieId } = useParams()
  const parsedMovieId = Number(movieId)
  const isMovieIdValid = Number.isInteger(parsedMovieId) && parsedMovieId > 0
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const { toggleMovie, isSelected } = useComparison()
  const { data, isPending, isError, error } = useMovieDetails(
    isMovieIdValid ? parsedMovieId : null,
  )

  if (!isMovieIdValid) {
    return (
      <section className="surface-section">
        <div className="catalog-state">
          <h2 className="catalog-state__title">Некорректный идентификатор фильма</h2>
          <Text>Проверьте ссылку и попробуйте открыть страницу заново.</Text>
        </div>
      </section>
    )
  }

  if (isPending) {
    return (
      <section className="surface-section">
        <div className="catalog-state">
          <Spinner size="m" />
          <h2 className="catalog-state__title">Загружаем информацию о фильме</h2>
          <Text>Сейчас загрузим постер, описание, рейтинг и основные факты.</Text>
        </div>
      </section>
    )
  }

  if (isError || !data) {
    return (
      <section className="surface-section">
        <div className="catalog-state">
          <h2 className="catalog-state__title">Не удалось загрузить фильм</h2>
          <Text>
            {error instanceof Error
              ? error.message
              : 'Попробуйте открыть страницу еще раз чуть позже.'}
          </Text>
        </div>
      </section>
    )
  }

  const movie = data
  const alreadyInFavorites = isFavorite(movie.id)
  const alreadyInComparison = isSelected(movie.id)

  function handleConfirmAddToFavorites() {
    addFavorite(movie)
    setIsConfirmModalOpen(false)
  }

  return (
    <>
      <section className="surface-section">
        <div className="details-page">
          <div className="details-page__poster">
            {movie.posterUrl ? (
              <img
                className="details-page__image"
                src={movie.posterUrl}
                alt={`Постер: ${movie.title}`}
              />
            ) : (
              <div className="movie-card__image movie-card__image--fallback">
                <span>Нет постера</span>
              </div>
            )}
          </div>

          <div className="details-page__content">
            <p className="surface-section__eyebrow">Фильм</p>
            <h1 className="details-page__title">{movie.title}</h1>

            <div className="movie-card__chips">
              <span className="movie-chip">{formatRating(movie.rating)}</span>
              <span className="movie-chip movie-chip--muted">
                {movie.year ?? 'Год не указан'}
              </span>
            </div>

            <div className="details-page__facts">
              <div className="details-page__fact">
                <span className="details-page__fact-label">Жанры</span>
                <Text>
                  {movie.genres.length > 0
                    ? movie.genres.join(' • ')
                    : 'Жанры не указаны'}
                </Text>
              </div>

              <div className="details-page__fact">
                <span className="details-page__fact-label">Страны</span>
                <Text>
                  {movie.countries.length > 0
                    ? movie.countries.join(' • ')
                    : 'Страны не указаны'}
                </Text>
              </div>

              <div className="details-page__fact">
                <span className="details-page__fact-label">Длительность</span>
                <Text>{formatDuration(movie.duration)}</Text>
              </div>
            </div>

            <div className="details-page__description">
              <h2 className="details-page__section-title">Описание</h2>
              <Text>{movie.description}</Text>
            </div>

            <div className="details-page__actions">
              {alreadyInFavorites ? (
                <Button
                  mode="secondary"
                  size="m"
                  onClick={() => removeFavorite(movie.id)}
                >
                  Удалить из избранного
                </Button>
              ) : (
                <Button
                  mode="primary"
                  size="m"
                  onClick={() => setIsConfirmModalOpen(true)}
                >
                  Добавить в избранное
                </Button>
              )}

              <Button
                mode="tertiary"
                size="m"
                className={`movie-card__compare-button${
                  alreadyInComparison ? ' movie-card__compare-button--selected' : ''
                }`}
                onClick={() => toggleMovie(movie)}
              >
                {alreadyInComparison
                  ? 'Убрать из сравнения'
                  : 'Добавить в сравнение'}
              </Button>

              {movie.webUrl ? (
                <Button
                  mode="secondary"
                  size="m"
                  href={movie.webUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Открыть в Кинопоиске
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <FavoriteConfirmModal
        movieTitle={movie.title}
        isOpen={isConfirmModalOpen}
        onConfirm={handleConfirmAddToFavorites}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </>
  )
}
