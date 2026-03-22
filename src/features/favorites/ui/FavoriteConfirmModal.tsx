import { Button, Text } from '@vkontakte/vkui'

type FavoriteConfirmModalProps = {
  movieTitle: string
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function FavoriteConfirmModal({
  movieTitle,
  isOpen,
  onConfirm,
  onCancel,
}: FavoriteConfirmModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="custom-modal" role="presentation" onClick={onCancel}>
      <div
        className="custom-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="favorite-confirm-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="custom-modal__close"
          aria-label="Закрыть окно"
          onClick={onCancel}
        >
          ×
        </button>

        <div className="custom-modal__content">
          <h2 id="favorite-confirm-title" className="details-page__section-title">
            Добавить фильм в избранное
          </h2>
          <Text>
            Фильм «{movieTitle}» будет сохранен в отдельном списке и останется доступен после
            перезагрузки страницы.
          </Text>
        </div>

        <div className="custom-modal__actions">
          <Button mode="secondary" size="m" onClick={onCancel}>
            Отмена
          </Button>
          <Button mode="primary" size="m" onClick={onConfirm}>
            Добавить
          </Button>
        </div>
      </div>
    </div>
  )
}
