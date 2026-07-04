import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const outputDir = process.argv[2]

if (!outputDir) {
  console.error('Usage: node scripts/generate-static-redirects.mjs <output-dir>')
  process.exit(1)
}

const redirectsFile = path.resolve('public/_redirects')
const rootDir = path.resolve(outputDir)

const withTrailingSlash = (value) => value === '/' ? '/' : `${value.replace(/\/+$/, '')}/`

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const redirectPage = (targetPath) => `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Страница переехала | Антур</title>
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="https://anturkamchatka.ru${targetPath}">
  <meta http-equiv="refresh" content="0; url=${targetPath}">
</head>
<body>
  <p>Страница переехала. Открываем <a href="${escapeHtml(targetPath)}">${escapeHtml(targetPath)}</a>.</p>
</body>
</html>
`

const file = await readFile(redirectsFile, 'utf8')
const redirects = new Map()

for (const line of file.split('\n')) {
  const trimmed = line.trim()

  if (!trimmed || trimmed.startsWith('#')) {
    continue
  }

  const [source, target, status] = trimmed.split(/\s+/)

  if (!source?.startsWith('/') || !target?.startsWith('/') || status !== '301') {
    continue
  }

  redirects.set(withTrailingSlash(source), withTrailingSlash(target))
}

for (const [source, target] of redirects) {
  const sourceDir = path.join(rootDir, source.replace(/^\/+/, ''))
  const outputFile = path.join(sourceDir, 'index.html')

  await mkdir(sourceDir, { recursive: true })
  await writeFile(outputFile, redirectPage(target), 'utf8')
}
