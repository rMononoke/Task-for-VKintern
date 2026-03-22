export const movieQueryKeys = {
  all: ['movies'] as const,
  genres: () => [...movieQueryKeys.all, 'genres'] as const,
  details: (movieId: number) =>
    [...movieQueryKeys.all, 'details', movieId] as const,
  list: (serializedFilters: string) =>
    [...movieQueryKeys.all, 'list', serializedFilters] as const,
}
