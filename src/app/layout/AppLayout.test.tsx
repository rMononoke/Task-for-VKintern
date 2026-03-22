import '@vkontakte/vkui/dist/vkui.css'
import '@/index.css'

import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'

import { AppLayout } from '@/app/layout/AppLayout'
import { THEME_STORAGE_KEY } from '@/app/theme/model/themeStorage'
import { renderWithProviders } from '@/test/renderWithProviders'

function renderLayout(route = '/') {
  return renderWithProviders(
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<div>Catalog content</div>} />
        <Route path="favorites" element={<div>Favorites content</div>} />
      </Route>
    </Routes>,
    { route },
  )
}

describe('AppLayout', () => {
  it('toggles the theme and persists the choice', async () => {
    const user = userEvent.setup()

    renderLayout()

    const themeToggle = screen.getByRole('button', { name: 'Переключить тему' })

    expect(themeToggle).toHaveAttribute('aria-pressed', 'false')
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')

    await user.click(themeToggle)

    expect(themeToggle).toHaveAttribute('aria-pressed', 'true')
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(document.body).toHaveAttribute('data-theme', 'dark')
    expect(document.documentElement.style.colorScheme).toBe('dark')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('keeps the VKUI root stretchable and transparent in dark theme', async () => {
    const user = userEvent.setup()

    renderLayout()

    const themeToggle = screen.getByRole('button', { name: 'Переключить тему' })

    await user.click(themeToggle)

    const vkuiRoot = document.querySelector('.vkui__root')
    const appRootHost = document.querySelector('.vkuiAppRoot__host')

    expect(vkuiRoot).not.toBeNull()
    expect(appRootHost).not.toBeNull()
    expect(window.getComputedStyle(appRootHost as Element).backgroundColor).toBe(
      'rgba(0, 0, 0, 0)',
    )
  })
})
