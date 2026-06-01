import { tourPhotos } from '~/data/social-proof'

export default defineEventHandler(() => ({
  items: tourPhotos,
  source: 'local-data',
  nextStep: 'Replace with CMS/storage query and image transform pipeline.'
}))
