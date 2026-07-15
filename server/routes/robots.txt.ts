export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl as string
  const baseURL = config.app.baseURL || '/'
  const rootUrl = new URL(baseURL, siteUrl)
  const sitemapUrl = new URL(`${baseURL.replace(/\/$/, '')}/sitemap.xml`, siteUrl).toString()
  const imageSitemapUrl = new URL(`${baseURL.replace(/\/$/, '')}/image-sitemap.xml`, siteUrl).toString()
  const videoSitemapUrl = new URL(`${baseURL.replace(/\/$/, '')}/video-sitemap.xml`, siteUrl).toString()
  const llmsUrl = new URL(`${baseURL.replace(/\/$/, '')}/llms.txt`, siteUrl).toString()
  const llmsFullUrl = new URL(`${baseURL.replace(/\/$/, '')}/llms-full.txt`, siteUrl).toString()
  const host = rootUrl.hostname

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')

  return `User-agent: *
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Yandex
Allow: /

Sitemap: ${sitemapUrl}
Sitemap: ${imageSitemapUrl}
Sitemap: ${videoSitemapUrl}
Host: ${host}

# AI agent context: ${llmsUrl}
# Full AI agent context: ${llmsFullUrl}
`
})
