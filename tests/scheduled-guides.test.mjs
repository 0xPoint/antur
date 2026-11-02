import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

const page = {
  slug: 'test-scheduled-article', path: '/guides/test-scheduled-article/', eyebrow: 'Тест', title: 'UNIQUE_SCHEDULED_CONTENT',
  description: 'Описание', seoTitle: 'Заголовок', seoDescription: 'Описание', updatedAt: '2026-11-02',
  heroImage: '/images/hero.jpg', heroAlt: 'Море', ctaContext: 'Маршрут', sections: [], serviceLinks: [], relatedSlugs: [], faq: []
}
const run = (entries, time = '2026-11-04T21:59:59Z') => {
  const dir = mkdtempSync(join(tmpdir(), 'antur-guides-'))
  try {
    for (const [name, entry] of Object.entries(entries)) writeFileSync(join(dir, `${name}.json`), JSON.stringify(entry))
    const out = join(dir, 'result.ts')
    const result = spawnSync(process.execPath, ['scripts/prepare-scheduled-guides.mjs'], { encoding: 'utf8', env: { ...process.env, ANTUR_GUIDE_INPUT: dir, ANTUR_GUIDE_OUTPUT: out, ANTUR_BUILD_TIME: time } })
    return { ...result, generated: result.status === 0 ? readFileSync(out, 'utf8') : '' }
  } finally { rmSync(dir, { recursive: true, force: true }) }
}
const approved = { status: 'approved', publishAt: '2026-11-05T09:00:00+11:00', hubSection: 'Планирование', page }

test('scheduled content appears only at or after the approved publication instant', () => {
  const before = run({ article: approved })
  assert.equal(before.status, 0)
  assert.doesNotMatch(before.generated, /UNIQUE_SCHEDULED_CONTENT|test-scheduled-article/)
  const at = run({ article: approved }, '2026-11-04T22:00:00Z')
  assert.equal(at.status, 0)
  assert.match(at.generated, /UNIQUE_SCHEDULED_CONTENT/)
})
test('drafts remain private from generated output even after their intended date', () => {
  const result = run({ draft: { ...approved, status: 'draft' } }, '2027-01-01T00:00:00Z')
  assert.equal(result.status, 0)
  assert.doesNotMatch(result.generated, /UNIQUE_SCHEDULED_CONTENT/)
})
test('approved articles require unambiguous date, valid hub section and unique slug', () => {
  for (const entry of [
    { ...approved, publishAt: '2026-11-05' },
    { ...approved, hubSection: 'bad' },
    { ...approved, page: { ...page, updatedAt: '2027-99-99' } },
    { ...approved, page: { ...page, updatedAt: '2027-02-29' } },
    { ...approved, page: { ...page, slug: 'kogda-luchshe-ehat-na-kamchatku', path: '/guides/kogda-luchshe-ehat-na-kamchatku/' } }
  ]) assert.notEqual(run({ article: entry }).status, 0)
})
