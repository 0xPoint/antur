import assert from 'node:assert/strict'
import test from 'node:test'

import { toVideoPublicationDateTime } from '../utils/video-date.js'

test('video publication date includes Kamchatka time and timezone', () => {
  assert.equal(
    toVideoPublicationDateTime('2026-05-27'),
    '2026-05-27T00:00:00+12:00'
  )
})

test('video publication date rejects malformed and impossible dates', () => {
  assert.throws(() => toVideoPublicationDateTime('2026-05-27T12:00:00'), TypeError)
  assert.throws(() => toVideoPublicationDateTime('2026-02-30'), TypeError)
})
