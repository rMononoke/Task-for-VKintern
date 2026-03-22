import assert from 'node:assert/strict'
import test from 'node:test'

import {
  createMovieCatalogSearchParams,
  parseMovieCatalogSearchParams,
} from './searchParams.ts'

test('parseMovieCatalogSearchParams keeps string genres and normalizes duplicates', () => {
  const filters = parseMovieCatalogSearchParams(
    new URLSearchParams(
      'genres=%D1%84%D1%8D%D0%BD%D1%82%D0%B5%D0%B7%D0%B8,%D0%B0%D0%BD%D0%B8%D0%BC%D0%B5,%D0%B0%D0%BD%D0%B8%D0%BC%D0%B5&ratingFrom=7.4&yearTo=2010',
    ),
  )

  assert.deepEqual(filters, {
    genres: ['аниме', 'фэнтези'],
    ratingFrom: 7.4,
    ratingTo: 10,
    yearFrom: 1888,
    yearTo: 2010,
  })
})

test('createMovieCatalogSearchParams serializes string genres back into the URL', () => {
  const searchParams = createMovieCatalogSearchParams({
    genres: ['аниме', 'фэнтези'],
    ratingFrom: 8,
    ratingTo: 9.5,
    yearFrom: 2000,
    yearTo: 2012,
  })

  assert.equal(searchParams.get('genres'), 'аниме,фэнтези')
  assert.equal(searchParams.get('ratingFrom'), '8')
  assert.equal(searchParams.get('ratingTo'), '9.5')
  assert.equal(searchParams.get('yearFrom'), '2000')
  assert.equal(searchParams.get('yearTo'), '2012')
})
