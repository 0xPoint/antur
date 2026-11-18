import { randomUUID, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { useSession, type H3Event } from 'h3'
import { bookingPool } from './booking-db'

const scrypt = promisify(scryptCallback)
type ManagerSession = { id?: string }

function configFor(event: H3Event) {
  const config = useRuntimeConfig(event)
  if (String(config.bookingEnabled) !== 'true' || !config.bookingDatabaseUrl || !config.managerUsername || !config.managerPasswordHash || config.managerSessionSecret.length < 32 || !config.managerOrigin) {
    throw createError({ statusCode: 503, statusMessage: 'Manager access is not configured' })
  }
  return config
}

export function requireManagerOrigin(event: H3Event) {
  const config = configFor(event)
  if (getHeader(event, 'origin') !== config.managerOrigin) throw createError({ statusCode: 403, statusMessage: 'Invalid request origin' })
  return config
}

async function managerSession(event: H3Event) {
  const config = configFor(event)
  return useSession<ManagerSession>(event, {
    name: 'antur-manager', password: config.managerSessionSecret, maxAge: 60 * 60 * 8,
    cookie: { httpOnly: true, secure: !import.meta.dev, sameSite: 'strict', path: '/api/manager' }
  })
}

export async function requireManager(event: H3Event) {
  const config = configFor(event)
  const session = await managerSession(event)
  if (!session.data.id || !/^[0-9a-f-]{36}$/.test(session.data.id)) throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  const result = await bookingPool(config.bookingDatabaseUrl).query('SELECT username FROM manager_sessions WHERE id=$1 AND expires_at > now()', [session.data.id])
  if (!result.rowCount || result.rows[0].username !== config.managerUsername) throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  return result.rows[0].username as string
}

export async function clearManager(event: H3Event) {
  const config = configFor(event)
  const session = await managerSession(event)
  if (session.data.id && /^[0-9a-f-]{36}$/.test(session.data.id)) await bookingPool(config.bookingDatabaseUrl).query('DELETE FROM manager_sessions WHERE id=$1', [session.data.id])
  await session.clear()
}

export async function loginManager(event: H3Event, username: string, password: string) {
  const config = requireManagerOrigin(event)
  const pool = bookingPool(config.bookingDatabaseUrl)
  const client = await pool.connect()
  let authenticated = false
  let locked = false
  try {
    await client.query('BEGIN')
    const guard = await client.query('SELECT failures, locked_until > now() AS locked FROM manager_login_guard WHERE id=true FOR UPDATE')
    if (!guard.rowCount) throw new Error('Manager auth migration not applied')
    locked = guard.rows[0].locked === true
    if (!locked) {
      const parts = config.managerPasswordHash.split(':')
      if (parts.length !== 3 || parts[0] !== 'scrypt' || !/^[a-f0-9]{32}$/.test(parts[1] || '') || !/^[a-f0-9]{128}$/.test(parts[2] || '')) throw new Error('Invalid manager password hash')
      const expected = Buffer.from(parts[2]!, 'hex')
      const actual = await scrypt(password, Buffer.from(parts[1]!, 'hex'), 64) as Buffer
      authenticated = username === config.managerUsername && timingSafeEqual(expected, actual)
      if (authenticated) await client.query('UPDATE manager_login_guard SET failures=0, locked_until=NULL WHERE id=true')
      else await client.query(`UPDATE manager_login_guard SET
        failures=CASE WHEN locked_until IS NOT NULL AND locked_until <= now() THEN 1 ELSE failures+1 END,
        locked_until=CASE WHEN locked_until IS NOT NULL AND locked_until <= now() THEN NULL WHEN failures+1 >= 5 THEN now()+interval '15 minutes' ELSE NULL END
        WHERE id=true`)
    }
    await client.query('COMMIT')
  } catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release() }
  if (locked) throw createError({ statusCode: 429, statusMessage: 'Try again later' })
  if (!authenticated) throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  const session = await managerSession(event)
  await clearManager(event)
  const id = randomUUID()
  await pool.query("DELETE FROM manager_sessions WHERE expires_at <= now()")
  await pool.query("INSERT INTO manager_sessions(id,username,expires_at) VALUES($1,$2,now()+interval '8 hours')", [id, config.managerUsername])
  await session.update({ id })
}
