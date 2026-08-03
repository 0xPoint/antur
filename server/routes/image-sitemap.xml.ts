import { routeOffers } from '~/data/routes'
import { tourPhotos } from '~/data/social-proof'

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const routeSlugByName: Record<string, string> = {
  'Бухта Русская': 'buhta-russkaya',
  'Глубоководная рыбалка': 'glubokovodnaya-rybalka',
  'Крабовое сафари': 'ostrov-starichkov',
  'Морская рыбалка': 'rybalka',
  'Остров Старичков': 'ostrov-starichkov',
  'Прибрежная рыбалка': 'rybalka'
}

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl as string
  const baseURL = config.app.baseURL || '/'
  const withBase = (path: string) => `${baseURL.replace(/\/$/, '')}${path}`
  const absolute = (path: string) => new URL(withBase(path), siteUrl).toString()

  const galleryImages = tourPhotos.filter((photo) => photo.kind !== 'video').map((photo) => ({
    src: photo.src,
    title: photo.route,
    caption: photo.caption || photo.alt
  }))

  const routeImages = routeOffers.map((offer) => ({
    page: offer.path,
    images: [
      {
        src: offer.pageImage || offer.image,
        title: offer.title,
        caption: offer.pageImageAlt || offer.imageAlt
      },
      ...(offer.gallery || []).map((item) => ({
        src: item.src,
        title: offer.title,
        caption: item.caption || item.alt
      })),
      ...tourPhotos
        .filter((photo) => photo.kind !== 'video' && (photo.routeSlug || routeSlugByName[photo.route]) === offer.slug)
        .map((photo) => ({
          src: photo.src,
          title: offer.title,
          caption: photo.caption || photo.alt
        }))
    ]
  }))

  const urlEntries = [
    {
      loc: absolute('/gallery/'),
      images: galleryImages
    },
    ...routeImages.map((entry) => ({
      loc: absolute(entry.page),
      images: entry.images
    }))
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries.map((entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
${entry.images.map((image) => `    <image:image>
      <image:loc>${escapeXml(absolute(image.src))}</image:loc>
      <image:title>${escapeXml(image.title)}</image:title>
      <image:caption>${escapeXml(image.caption)}</image:caption>
    </image:image>`).join('\n')}
  </url>`).join('\n')}
</urlset>
`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
