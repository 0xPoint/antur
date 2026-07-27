const legacyRedirects: Record<string, string> = {
  '/morskie-progulki-kamchatka-2026/': '/morskie-progulki/',
  '/routes/avachinskaya-buhta/': '/morskie-progulki/avachinskaya-buhta/',
  '/routes/ostrov-starichkov/': '/morskie-progulki/ostrov-starichkov/',
  '/routes/buhta-russkaya/': '/morskie-progulki/buhta-russkaya/',
  '/krabovoe-safari-kamchatka/': '/morskie-progulki/krabovoe-safari/',
  '/routes/rybalka/': '/rybalka/morskaya-rybalka/',
  '/routes/morskaya-rybalka/': '/rybalka/morskaya-rybalka/',
  '/routes/glubokovodnaya-rybalka/': '/rybalka/glubokovodnaya-rybalka/',
  '/arenda-katera-kamchatka/': '/arenda-katera/',
  '/en/routes/morskaya-rybalka/': '/en/routes/rybalka/',
  '/zh/routes/morskaya-rybalka/': '/zh/routes/rybalka/',
  '/guides/gde-uvidet-kitov-na-kamchatke/': '/kity-na-kamchatke/'
}

const normalizePagePath = (pathname: string) =>
  pathname === '/' ? '/' : `${pathname.replace(/\/+$/, '')}/`

const shouldSkipTrailingSlash = (pathname: string) => {
  const lastSegment = pathname.split('/').pop() || ''

  return (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/__nuxt_error') ||
    pathname.startsWith('/_nuxt/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/videos/') ||
    lastSegment.includes('.')
  )
}

export default defineEventHandler((event) => {
  const requestUrl = getRequestURL(event)
  const normalizedPath = normalizePagePath(requestUrl.pathname)
  const legacyTarget = legacyRedirects[normalizedPath]

  if (legacyTarget) {
    return sendRedirect(event, `${legacyTarget}${requestUrl.search}`, 301)
  }

  // Во время prerender Nuxt ставит статические роуты в очередь без trailing slash
  // (формат vue-router); редирект здесь записал бы meta-refresh заглушку поверх
  // уже сгенерированного HTML страницы.
  if (import.meta.prerender) {
    return
  }

  if (!shouldSkipTrailingSlash(requestUrl.pathname) && requestUrl.pathname !== normalizedPath) {
    return sendRedirect(event, `${normalizedPath}${requestUrl.search}`, 301)
  }
})
