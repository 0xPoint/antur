import { loginManager } from '../../utils/manager-auth'
import { readManagerBody } from '../../utils/manager-body'

export default defineEventHandler(async event => {
  const body = await readManagerBody(event)
  if (typeof body?.username !== 'string' || typeof body?.password !== 'string' || body.username.length > 128 || body.password.length > 512) throw createError({ statusCode: 400, statusMessage: 'Invalid request' })
  await loginManager(event, body.username, body.password)
  return { ok: true }
})
