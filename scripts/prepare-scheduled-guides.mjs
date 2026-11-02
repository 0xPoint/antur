import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const input = resolve(process.env.ANTUR_GUIDE_INPUT || resolve(root, 'content/scheduled-guides'))
const output = resolve(process.env.ANTUR_GUIDE_OUTPUT || resolve(root, 'data/.generated-scheduled-guides.ts'))
const now = process.env.ANTUR_BUILD_TIME ? Date.parse(process.env.ANTUR_BUILD_TIME) : Date.now()
if (!Number.isFinite(now)) throw new Error('Invalid ANTUR_BUILD_TIME')
const sections = ['Планирование', 'Подготовка', 'Маршруты']
const mandatory = ['slug', 'path', 'eyebrow', 'title', 'description', 'seoTitle', 'seoDescription', 'updatedAt', 'heroImage', 'heroAlt', 'ctaContext']
const knownSlugs = new Set([...readFileSync(resolve(root, 'data/guide-pages.ts'), 'utf8').matchAll(/\bslug:\s*'([^']+)'/g)].map(m => m[1]))
const published = []
for (const file of readdirSync(input).filter(name => name.endsWith('.json')).sort()) {
  const entry = JSON.parse(readFileSync(resolve(input, file), 'utf8'))
  if (!entry || !['draft', 'approved'].includes(entry.status)) throw new Error(`${file}: status must be draft or approved`)
  if (entry.status === 'draft') continue
  if (typeof entry.publishAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})$/.test(entry.publishAt) || !Number.isFinite(Date.parse(entry.publishAt))) throw new Error(`${file}: publishAt must be an ISO date with timezone`)
  const [year, month, day] = entry.publishAt.slice(0, 10).split('-').map(Number)
  const calendarDate = new Date(Date.UTC(year, month - 1, day))
  if (calendarDate.getUTCFullYear() !== year || calendarDate.getUTCMonth() !== month - 1 || calendarDate.getUTCDate() !== day) throw new Error(`${file}: invalid calendar date`)
  const page = entry.page
  if (!page || !mandatory.every(key => typeof page[key] === 'string' && page[key].trim())) throw new Error(`${file}: missing required page fields`)
  if (page.expertReviewed !== undefined && typeof page.expertReviewed !== 'boolean') throw new Error(`${file}: expertReviewed must be a boolean`)
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(page.slug) || page.path !== `/guides/${page.slug}/`) throw new Error(`${file}: invalid slug or path`)
  if (knownSlugs.has(page.slug)) throw new Error(`${file}: duplicate slug ${page.slug}`)
  knownSlugs.add(page.slug)
  if (!sections.includes(entry.hubSection)) throw new Error(`${file}: invalid hubSection`)
  if (!['sections', 'serviceLinks', 'relatedSlugs', 'faq'].every(key => Array.isArray(page[key]))) throw new Error(`${file}: missing page arrays`)
  const hasStrings = (item, keys) => item && keys.every(key => typeof item[key] === 'string' && item[key].trim())
  const updated = /^\d{4}-\d{2}-\d{2}$/.test(page.updatedAt) ? new Date(`${page.updatedAt}T00:00:00Z`) : new Date(NaN)
  if (!Number.isFinite(updated.getTime()) || updated.toISOString().slice(0, 10) !== page.updatedAt || !page.sections.every(item => hasStrings(item, ['title', 'text'])) || !page.serviceLinks.every(item => hasStrings(item, ['title', 'text', 'path', 'eyebrow'])) || !page.faq.every(item => hasStrings(item, ['question', 'answer'])) || !page.relatedSlugs.every(item => typeof item === 'string')) throw new Error(`${file}: invalid article content`)
  if (Date.parse(entry.publishAt) <= now) published.push({ hubSection: entry.hubSection, page: { ...page, expertReviewed: page.expertReviewed === true, publishedAt: entry.publishAt } })
}
mkdirSync(dirname(output), { recursive: true })
writeFileSync(output, `// Generated at build time. Do not edit.\nimport type { GuidePage } from './guide-pages'\n\nexport const scheduledGuides: { hubSection: string; page: GuidePage }[] = ${JSON.stringify(published, null, 2)}\n`)
console.log(`Prepared ${published.length} scheduled guide(s).`)
