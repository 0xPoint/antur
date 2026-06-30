import assert from 'node:assert/strict'
import test from 'node:test'

import { sortReviewsByDateDesc } from '../utils/reviews.js'

test('sortReviewsByDateDesc sorts newest first and breaks date ties by id', () => {
  const reviews = [
    { id: 'b', date: '2026-06-20' },
    { id: 'old', date: '2026-06-10' },
    { id: 'a', date: '2026-06-20' },
    { id: 'newest', date: '2026-06-30' }
  ]

  assert.deepEqual(sortReviewsByDateDesc(reviews).map((review) => review.id), ['newest', 'a', 'b', 'old'])
})

test('sortReviewsByDateDesc does not mutate the source array', () => {
  const reviews = [
    { id: 'old', date: '2026-06-10' },
    { id: 'new', date: '2026-06-30' }
  ]
  const sorted = sortReviewsByDateDesc(reviews)

  assert.notEqual(sorted, reviews)
  assert.deepEqual(reviews.map((review) => review.id), ['old', 'new'])
})
