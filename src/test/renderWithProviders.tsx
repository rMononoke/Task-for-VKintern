import { QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { PropsWithChildren, ReactElement } from 'react'
import { MemoryRouter } from 'react-router'
import { AppRoot, ConfigProvider } from '@vkontakte/vkui'

import { ThemeContext } from '@/app/theme/model/ThemeContext'
import { ThemeProvider } from '@/app/theme/model/ThemeProvider'
import { ComparisonProvider } from '@/features/comparison/model/ComparisonProvider'
import { FavoritesProvider } from '@/features/favorites/model/FavoritesProvider'
import { createQueryClient } from '@/shared/config/query-client'

type RenderOptions = {
  route?: string
}

export function renderWithProviders(
  ui: ReactElement,
  { route = '/' }: RenderOptions = {},
) {
  const queryClient = createQueryClient()

  function Wrapper({ children }: PropsWithChildren) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <ThemeProvider>
          <ThemeContext.Consumer>
            {(themeContext) => (
              <ConfigProvider colorScheme={themeContext?.theme ?? 'light'}>
                <AppRoot>
                  <QueryClientProvider client={queryClient}>
                    <ComparisonProvider>
                      <FavoritesProvider>{children}</FavoritesProvider>
                    </ComparisonProvider>
                  </QueryClientProvider>
                </AppRoot>
              </ConfigProvider>
            )}
          </ThemeContext.Consumer>
        </ThemeProvider>
      </MemoryRouter>
    )
  }

  return {
    queryClient,
    ...render(ui, { wrapper: Wrapper }),
  }
}
