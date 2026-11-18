import { clearManager, requireManagerOrigin } from '../../utils/manager-auth'

export default defineEventHandler(async event => {
  requireManagerOrigin(event)
  await clearManager(event)
  return { ok: true }
})
