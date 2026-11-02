import type { Pool } from 'pg'

/** Save manager-selected dates for one calendar month. Past bookings remain intact. */
export async function saveMonth(pool: Pool, boatId: number, year: number, month: number, openDays: number[], actor: string) {
  if (!Number.isSafeInteger(boatId) || boatId < 1 || !Number.isInteger(year) || year < 2026 || year > 2100 || !Number.isInteger(month) || month < 1 || month > 12 || !actor.trim()) throw new Error('INVALID_MONTH')
  const length = new Date(Date.UTC(year, month, 0)).getUTCDate()
  if (openDays.some(day => !Number.isInteger(day) || day < 1 || day > length) || new Set(openDays).size !== openDays.length) throw new Error('INVALID_DAYS')
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const boat = await client.query('SELECT id FROM boats WHERE id=$1 FOR UPDATE', [boatId])
    if (!boat.rowCount) throw new Error('BOAT_NOT_FOUND')
    for (let day = 1; day <= length; day++) {
      const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      await client.query(`INSERT INTO booking_days (boat_id,day,is_open) VALUES($1,$2,$3)
        ON CONFLICT (boat_id,day) DO UPDATE SET is_open=excluded.is_open`, [boatId, date, openDays.includes(day)])
    }
    await client.query("INSERT INTO booking_audit(actor,action,entity_type,entity_id,details) VALUES($1,'save_month','boat',$2,$3::jsonb)", [actor, String(boatId), JSON.stringify({ year, month, openDays })])
    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally { client.release() }
}
