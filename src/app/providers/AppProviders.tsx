import { QueryClientProvider } from '@tanstack/react-query'
import { type PropsWithChildren, useState } from 'react'
import { AppRoot, ConfigProvider } from '@vkontakte/vkui'

import { ThemeProvider } from '@/app/theme/model/ThemeProvider'
import { useTheme } from '@/app/theme/model/useTheme'
import { ComparisonProvider } from '@/features/comparison/model/ComparisonProvider'
import { FavoritesProvider } from '@/features/favorites/model/FavoritesProvider'
import { createQueryClient } from '@/shared/config/query-client'

function ThemedAppProviders({ children }: PropsWithChildren) {
  const { theme } = useTheme()

  return (
    <ConfigProvider colorScheme={theme}>
      <AppRoot>{children}</AppRoot>
    </ConfigProvider>
  )
}

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => createQueryClient())

  return (
    <ThemeProvider>
      <ThemedAppProviders>
        <QueryClientProvider client={queryClient}>
          <ComparisonProvider>
            <FavoritesProvider>{children}</FavoritesProvider>
          </ComparisonProvider>
        </QueryClientProvider>
      </ThemedAppProviders>
    </ThemeProvider>
  )
}
