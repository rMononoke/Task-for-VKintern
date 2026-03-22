import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router'

import { AppLayout } from '@/app/layout/AppLayout'
import { FavoritesPage } from '@/pages/favorites/FavoritesPage'
import { CatalogPage } from '@/pages/home/CatalogPage'
import { MovieDetailsPage } from '@/pages/movie-details/MovieDetailsPage'
import { NotFoundPage } from '@/pages/not-found/NotFoundPage'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route index element={<CatalogPage />} />
      <Route path="favorites" element={<FavoritesPage />} />
      <Route path="movies/:movieId" element={<MovieDetailsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>,
  ),
)

export function AppRouter() {
  return <RouterProvider router={router} />
}
