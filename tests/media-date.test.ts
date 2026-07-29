import assert from 'node:assert/strict'
import test from 'node:test'

import { formatMediaDate } from '../utils/media-date.js'

test('media date is formatted per locale', () => {
  assert.equal(formatMediaDate('2026-07-29', 'ru'), '29 июля 2026 г.')
  assert.equal(formatMediaDate('2026-07-29', 'en'), '29 July 2026')
  assert.equal(formatMediaDate('2026-07-29', 'zh'), '2026年7月29日')
})

test('media date keeps the stored calendar day', () => {
  assert.match(formatMediaDate('2026-01-01', 'en'), /^1 January 2026$/)
  assert.match(formatMediaDate('2026-12-31', 'en'), /^31 December 2026$/)
})

test('media date rejects malformed and impossible dates', () => {
  assert.throws(() => formatMediaDate('29.07.2026', 'ru'), TypeError)
  assert.throws(() => formatMediaDate('2026-7-29', 'ru'), TypeError)
  assert.throws(() => formatMediaDate('2026-02-31', 'ru'), TypeError)
  assert.throws(() => formatMediaDate('2026-13-01', 'ru'), TypeError)
})
