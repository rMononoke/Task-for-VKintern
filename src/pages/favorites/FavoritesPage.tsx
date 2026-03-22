import { Button, Text, Title } from '@vkontakte/vkui'

import { MoviePreviewCard } from '@/entities/movie/ui/MoviePreviewCard'
import { useFavorites } from '@/features/favorites/model/useFavorites'

export function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites()

  return (
    <div className="page-stack">
      <section className="surface-section">
        <div className="surface-section__header">
          <div className="surface-section__copy">
            <p className="surface-section__eyebrow">Избранное</p>
            <h1 className="surface-section__title">
              <Title level="2" weight="2">
                Избранные фильмы
              </Title>
            </h1>
            <Text>
              Здесь хранится список фильмов, которые вы отметили как "избранное"
            </Text>
          </div>

          <div className="catalog-summary">
            <span className="catalog-summary__item">Сохранено: {favorites.length}</span>
          </div>
        </div>

        {favorites.length > 0 ? (
          <div className="favorites-grid" data-testid="favorites-grid">
            {favorites.map((movie) => (
              <MoviePreviewCard
                key={movie.id}
                movie={movie}
                actionSlot={
                  <Button
                    mode="secondary"
                    size="s"
                    aria-label={`Удалить из избранного: ${movie.title}`}
                    onClick={() => removeFavorite(movie.id)}
                  >
                    Удалить
                  </Button>
                }
              />
            ))}
          </div>
        ) : (
          <div className="catalog-state">
            <h2 className="catalog-state__title">Избранное пока пусто</h2>
            <Text>
              Откройте страницу фильма, нажмите «Добавить в избранное» и подтвердите действие.
            </Text>
          </div>
        )}
      </section>
    </div>
  )
}
