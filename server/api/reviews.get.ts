import { reviews } from '~/data/social-proof'

export default defineEventHandler(() => ({
  items: reviews,
  source: 'local-data'
}))
