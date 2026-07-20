import { tourPhotos } from '~/data/social-proof'
import { toVideoPublicationDateTime } from '~/utils/video-date'
import { videoWatchPageByMediaId } from '~/data/video-pages'

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl as string
  const baseURL = config.app.baseURL || '/'
  const withBase = (path: string) => `${baseURL.replace(/\/$/, '')}${path}`
  const absolute = (path: string) => new URL(withBase(path), siteUrl).toString()
  const videos = tourPhotos.filter((item) => item.kind === 'video' && item.posterSrc)

  const entriesByLocation = new Map<string, typeof videos>()

  for (const video of videos) {
    const loc = absolute(videoWatchPageByMediaId.get(video.id)?.path || '/gallery/')
    entriesByLocation.set(loc, [...(entriesByLocation.get(loc) || []), video])
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${[...entriesByLocation].map(([loc, locationVideos]) => `  <url>
    <loc>${escapeXml(loc)}</loc>
${locationVideos.map((video) => `    <video:video>
      <video:thumbnail_loc>${escapeXml(absolute(video.posterSrc!))}</video:thumbnail_loc>
      <video:title>${escapeXml(video.alt)}</video:title>
      <video:description>${escapeXml(video.caption || video.alt)}</video:description>
      <video:content_loc>${escapeXml(absolute(video.videoSrc || video.src))}</video:content_loc>
      <video:publication_date>${escapeXml(toVideoPublicationDateTime(video.date))}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
    </video:video>`).join('\n')}
  </url>`).join('\n')}
</urlset>
`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
