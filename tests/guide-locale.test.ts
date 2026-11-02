import assert from 'node:assert/strict'
import test from 'node:test'
import { isRussianOnlyGuidePath } from '../utils/guide-locale.js'

test('guide hub and future guide pages remain Russian-only', () => {
  assert.equal(isRussianOnlyGuidePath('/guides/'), true)
  assert.equal(isRussianOnlyGuidePath('/guides/new-scheduled-guide/'), true)
  assert.equal(isRussianOnlyGuidePath('/guides/buhta-russkaya/'), true)
  assert.equal(isRussianOnlyGuidePath('/guides-other/'), false)
  assert.equal(isRussianOnlyGuidePath('/morskie-progulki/buhta-russkaya/'), false)
})
