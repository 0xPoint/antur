import type { Pool } from 'pg'

/** Public view contains no guest information. Time zone is fixed to Kamchatka. */
export async function getMonthAvailability(pool: Pool, year: number, month: number) {
  if (!Number.isInteger(year) || year < 2026 || year > 2100 || !Number.isInteger(month) || month < 1 || month > 12) throw new Error('INVALID_MONTH')
  const first = `${year}-${String(month).padStart(2, '0')}-01`
  const result = await pool.query(`
    SELECT to_char(d.day,'YYYY-MM-DD') AS date, d.is_open, b.capacity,
      t.id::text AS trip_id, t.route, t.kind, t.confirmation,
      to_char(t.starts_at AT TIME ZONE 'Asia/Kamchatka','HH24:MI') AS starts_at,
      COALESCE(SUM(bk.guests) FILTER (WHERE bk.status IN ('paid','manual_pending','manual_confirmed')),0)::int AS booked,
      COALESCE(SUM(bk.guests) FILTER (WHERE bk.status='held' AND bk.hold_expires_at > now()),0)::int AS held
    FROM booking_days d JOIN boats b ON b.id=d.boat_id
    LEFT JOIN trips t ON t.day_id=d.id AND t.confirmation <> 'cancelled'
    LEFT JOIN bookings bk ON bk.trip_id=t.id
    WHERE d.day >= $1::date AND d.day < ($1::date + interval '1 month')
    GROUP BY d.id, b.id, t.id ORDER BY d.day, t.starts_at`, [first])
  return result.rows.map(row => ({
    date: row.date as string,
    open: row.is_open as boolean,
    capacity: row.capacity as number,
    trip: row.trip_id ? {
      id: row.trip_id as string, route: row.route as string | null,
      kind: row.kind as string, confirmation: row.confirmation as string,
      startsAt: row.starts_at as string, booked: row.booked as number,
      available: row.kind === 'private' ? 0 : Math.max(0, row.capacity - row.booked - row.held)
    } : null
  }))
}
