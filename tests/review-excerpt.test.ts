import assert from 'node:assert/strict'
import test from 'node:test'

import {
  getReviewExcerpt,
  REVIEW_EXCERPT_MAX_LENGTH,
  REVIEW_EXCERPT_TRUNCATION_SLACK,
  shouldTruncateReviewText
} from '../utils/review-excerpt.js'

test('review excerpt keeps short and near-limit text intact', () => {
  const shortText = 'Отличная морская прогулка'
  const nearLimitText = 'а'.repeat(REVIEW_EXCERPT_MAX_LENGTH + REVIEW_EXCERPT_TRUNCATION_SLACK)

  assert.equal(shouldTruncateReviewText(shortText), false)
  assert.equal(getReviewExcerpt(shortText), shortText)
  assert.equal(shouldTruncateReviewText(nearLimitText), false)
  assert.equal(getReviewExcerpt(nearLimitText), nearLimitText)
})

test('review excerpt truncates long text on a word boundary when possible', () => {
  const text = `${'Камчатка '.repeat(40)}финал`
  const excerpt = getReviewExcerpt(text)

  assert.equal(shouldTruncateReviewText(text), true)
  assert.equal(excerpt.endsWith('...'), true)
  assert.equal(excerpt.includes('финал'), false)
  assert.equal(/\s\.\.\.$/.test(excerpt), false)
})

test('review excerpt falls back to hard trim for text without spaces', () => {
  const text = 'а'.repeat(REVIEW_EXCERPT_MAX_LENGTH + REVIEW_EXCERPT_TRUNCATION_SLACK + 1)

  assert.equal(getReviewExcerpt(text), `${'а'.repeat(REVIEW_EXCERPT_MAX_LENGTH)}...`)
})

test('review excerpt respects expanded state and empty text', () => {
  const text = 'текст '.repeat(80)

  assert.equal(getReviewExcerpt('', { expanded: false }), '')
  assert.equal(shouldTruncateReviewText(text, { expanded: true }), false)
  assert.equal(getReviewExcerpt(text, { expanded: true }), text)
})
