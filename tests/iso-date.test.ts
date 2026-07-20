import assert from 'node:assert/strict'
import test from 'node:test'

import { latestIsoDate } from '../utils/iso-date.js'

test('latestIsoDate returns the latest valid content date', () => {
  assert.equal(latestIsoDate('2026-06-01', undefined, '2026-07-20', '2026-07-10'), '2026-07-20')
})

test('latestIsoDate rejects an empty or invalid set', () => {
  assert.throws(() => latestIsoDate(undefined, '20.07.2026'), TypeError)
})
