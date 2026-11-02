import assert from 'node:assert/strict'
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const root = process.cwd()
const sandbox = mkdtempSync(join(tmpdir(), 'antur-publication-'))
const excluded = new Set(['.git', '.nuxt', '.output', '.tmp', 'node_modules', '.playwright-cli', 'output'])
const run = (command, args, time) => {
  const result = spawnSync(command, args, {
    cwd: sandbox, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, ANTUR_BUILD_TIME: time, NUXT_IGNORE_LOCK: '1', ANTUR_GUIDE_INPUT: '', ANTUR_GUIDE_OUTPUT: '' }
  })
  if (result.status !== 0) throw new Error(`${args.join(' ')} failed (${result.status}):\n${result.stderr}\n${result.stdout.slice(-5000)}`)
}
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const path = join(dir, entry.name)
  return entry.isDirectory() ? walk(path) : entry.isFile() ? [path] : []
})
try {
  for (const entry of readdirSync(root)) {
    if (!excluded.has(entry) && entry !== '.env' && (!entry.startsWith('.env.') || entry === '.env.example')) cpSync(join(root, entry), join(sandbox, entry), { recursive: true })
  }
  symlinkSync(resolve(root, 'node_modules'), join(sandbox, 'node_modules'), 'dir')
  const page = {
    slug: 'buhta-russkaya', path: '/guides/buhta-russkaya/', eyebrow: 'Тест', title: 'UNIQUE_SCHEDULED_INTEGRATION_TITLE',
    description: 'Описание', seoTitle: 'Тестовый материал', seoDescription: 'Описание', updatedAt: '2026-11-02',
    heroImage: '/images/hero-kamchatka-boat.jpg', heroAlt: 'Море', ctaContext: 'Маршрут',
    expertReviewed: false,
    sections: [{ title: 'Раздел', text: 'UNIQUE_SCHEDULED_INTEGRATION_BODY' }], serviceLinks: [], relatedSlugs: [], faq: []
  }
  writeFileSync(join(sandbox, 'content/scheduled-guides/integration.json'), JSON.stringify({ status: 'approved', publishAt: '2027-03-01T10:00:00+12:00', hubSection: 'Планирование', page }))
  const build = (time) => {
    run(process.execPath, ['scripts/prepare-scheduled-guides.mjs'], time)
    run(process.execPath, ['node_modules/nuxt/bin/nuxt.mjs', 'generate'], time)
  }
  const publicDir = join(sandbox, '.output/public')
  build('2027-02-28T21:59:59Z')
  assert.ok(walk(publicDir).every(file => !readFileSync(file).includes(Buffer.from('UNIQUE_SCHEDULED_INTEGRATION'))), 'Future article text leaked into the public output')
  assert.ok(!walk(publicDir).some(file => file.includes('/guides/buhta-russkaya/')), 'Future article path leaked into the public output')
  build('2027-02-28T22:00:00Z')
  const html = readFileSync(join(publicDir, page.path, 'index.html'), 'utf8')
  assert.match(html, /UNIQUE_SCHEDULED_INTEGRATION_BODY/)
  assert.doesNotMatch(html, /Экспертная проверка|"reviewedBy"/)
  assert.doesNotMatch(html, /\/(en|zh)\/guides\/buhta-russkaya/)
  const languageNav = html.match(/<nav class="language-switcher"[\s\S]*?<\/nav>/)?.[0]
  assert.ok(languageNav, 'Language switcher not found')
  assert.match(languageNav, /href="\/guides\/buhta-russkaya\/"/)
  assert.doesNotMatch(languageNav, /href="\/morskie-progulki\/buhta-russkaya\/"/)
  assert.match(readFileSync(join(publicDir, 'guides/index.html'), 'utf8'), /guides\/buhta-russkaya/)
  assert.match(readFileSync(join(publicDir, 'sitemap.xml'), 'utf8'), /guides\/buhta-russkaya/)
  console.log('Scheduled article: hidden before publication; full build, language links, hub and sitemap verified after publication.')
} finally {
  rmSync(sandbox, { recursive: true, force: true })
}
