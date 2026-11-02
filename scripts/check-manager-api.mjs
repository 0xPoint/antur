// Only run against the locally configured throwaway database and dev server.
import assert from 'node:assert/strict'
import pg from 'pg'
const origin = 'http://127.0.0.1:3013'
if (process.env.PGDATABASE !== 'antur_booking_dev_check') throw new Error('Test database required')
const db = new pg.Pool()
const json = { 'content-type': 'application/json', origin }
const body = JSON.stringify({ username: 'test-manager', password: 'local-test-password-only' })
async function request(path, options = {}) { return fetch(origin + path, { redirect: 'manual', ...options }) }
try {
  await db.query('UPDATE manager_login_guard SET failures=0, locked_until=NULL WHERE id=true')
  assert.equal((await request('/api/manager/month?month=2027-07')).status, 401)
  assert.equal((await request('/api/manager/login', { method: 'POST', headers: { ...json, origin: 'https://example.invalid' }, body })).status, 403)
  assert.equal((await request('/api/manager/login', { method: 'POST', headers: json, body: JSON.stringify({ username: 'test-manager', password: 'wrong' }) })).status, 401)
  const login = await request('/api/manager/login', { method: 'POST', headers: json, body })
  assert.equal(login.status, 200)
  const rawCookie = login.headers.get('set-cookie') || ''
  assert.match(rawCookie.toLowerCase(), /httponly/)
  assert.match(rawCookie.toLowerCase(), /samesite=strict/)
  const cookie = rawCookie.split(';')[0]
  const headers = { ...json, cookie }
  assert.equal((await request('/api/manager/session', { headers })).status, 200)
  const month = await request('/api/manager/month?month=2027-07', { headers })
  assert.equal(month.status, 200)
  const { boat, version } = await month.json()
  assert.ok(boat)
  const update = JSON.stringify({ boatId: Number(boat.id), year: 2027, month: 7, openDays: [1, 15, 31], version })
  assert.equal((await request('/api/manager/month', { method: 'PUT', headers: { ...headers, origin: 'https://example.invalid' }, body: update })).status, 403)
  assert.equal((await request('/api/manager/month', { method: 'PUT', headers, body: update })).status, 200)
  assert.equal((await request('/api/manager/month', { method: 'PUT', headers, body: update })).status, 409)
  assert.equal((await request('/api/manager/logout', { method: 'POST', headers })).status, 200)
  assert.equal((await request('/api/manager/session', { headers })).status, 401)
  for (let i = 0; i < 5; i++) assert.equal((await request('/api/manager/login', { method: 'POST', headers: json, body: JSON.stringify({ username: 'bad', password: 'wrong' }) })).status, 401)
  assert.equal((await request('/api/manager/login', { method: 'POST', headers: json, body })).status, 429)
  console.log('Manager API checks passed: authentication, origin checks, month update, logout and login throttling.')
} finally {
  await db.query('UPDATE manager_login_guard SET failures=0, locked_until=NULL WHERE id=true')
  await db.end()
}
