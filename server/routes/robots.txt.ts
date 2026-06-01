export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl as string
  const baseURL = config.app.baseURL || '/'
  const sitemapUrl = new URL(`${baseURL.replace(/\/$/, '')}/sitemap.xml`, siteUrl).toString()

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')

  return `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`
})
