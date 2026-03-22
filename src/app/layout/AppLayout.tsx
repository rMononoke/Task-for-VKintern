import { Outlet, useLocation, useNavigate } from 'react-router'
import { Button, Div, Text, Title } from '@vkontakte/vkui'

import { useTheme } from '@/app/theme/model/useTheme'
import { readStoredCatalogSearch } from '@/features/movie-filters/model/catalogSearchStorage'

type NavigationItem = {
  label: string
  to: string
}

const navigationItems: NavigationItem[] = [
  { label: 'Каталог', to: '/' },
  { label: 'Избранное', to: '/favorites' },
]

export function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()

  function handleNavigate(to: string) {
    if (to !== '/') {
      navigate(to)
      return
    }

    const search =
      location.pathname === '/' ? location.search : readStoredCatalogSearch()

    navigate({
      pathname: to,
      search,
    })
  }

  return (
    <div className="app-shell">
      <Div className="app-shell__hero">
        <div className="app-shell__hero-top">
          <div className="app-shell__hero-copy">
            <Title className="app-shell__hero-title" level="1" weight="1">
              VK Фильмы
            </Title>
            <Text>
              Данный сервис предназначен для просмотра информации о фильмах
            </Text>
          </div>

          <div className="theme-switcher">
            <span className="theme-switcher__label">
              {isDark ? 'Темная тема' : 'Светлая тема'}
            </span>
            <button
              type="button"
              className={`theme-switcher__toggle${isDark ? ' theme-switcher__toggle--active' : ''}`}
              aria-label="Переключить тему"
              aria-pressed={isDark}
              onClick={toggleTheme}
            >
              <span className="theme-switcher__track">
                <span className="theme-switcher__thumb" />
              </span>
            </button>
          </div>
        </div>

        <div className="route-nav" aria-label="Навигация по приложению">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.to

            return (
              <Button
                key={item.to}
                mode={isActive ? 'primary' : 'secondary'}
                size="m"
                onClick={() => handleNavigate(item.to)}
              >
                {item.label}
              </Button>
            )
          })}
        </div>
      </Div>

      <main className="app-shell__content">
        <Outlet />
      </main>
    </div>
  )
}
