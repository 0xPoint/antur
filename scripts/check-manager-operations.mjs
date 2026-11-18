import assert from 'node:assert/strict'
import pg from 'pg'
import { performManagerOperation } from '../server/database/booking/manager-operations.ts'
import { createHold, markVerifiedPayment } from '../server/database/booking/reservations.ts'

if (process.env.PGDATABASE !== 'antur_booking_dev_check') throw new Error('Test database required')
const pool = new pg.Pool()
try {
  const boat = Number((await pool.query("INSERT INTO boats(name,capacity) VALUES('operations-test',11) RETURNING id")).rows[0].id)
  const op = input => performManagerOperation(pool,'test-manager',input)
  const created = await op({ action:'createTrip', boatId:boat, date:'2027-07-20', start:'08:00', end:'16:00', route:'russkaya', kind:'shared' })
  const tripId = Number(created.id)
  await assert.rejects(op({ action:'createTrip', boatId:boat, date:'2027-07-20', start:'10:00', end:'17:00', route:'fishing', kind:'shared' }),/TRIP_OVERLAP/)
  const guest = (guests, paymentKopecks, revision) => op({ action:'addGuest', tripId, revision, name:'Test', phone:'70000000000', guests, paymentKopecks })
  await guest(5,500000,0)
  await guest(1,100000,1)
  let trip = (await pool.query('SELECT confirmation,revision FROM trips WHERE id=$1',[tripId])).rows[0]
  assert.deepEqual(trip, { confirmation:'confirmed', revision:2 })
  await assert.rejects(guest(6,600000,2),/NOT_ENOUGH_SEATS/)
  await assert.rejects(guest(1,100000,1),/STALE_TRIP/)
  const booking = (await pool.query('SELECT id FROM bookings WHERE trip_id=$1 AND guests=5',[tripId])).rows[0].id
  await assert.rejects(op({ action:'cancelBooking', tripId, revision:2, bookingId:booking }),/PAYMENT_REVIEW_REQUIRED/)
  await op({ action:'cancelBooking', tripId, revision:2, bookingId:booking, paymentAcknowledged:true })
  trip = (await pool.query('SELECT confirmation,revision FROM trips WHERE id=$1',[tripId])).rows[0]
  assert.deepEqual(trip, { confirmation:'confirmed', revision:3 })
  assert.equal((await pool.query('SELECT refund_review FROM bookings WHERE id=$1',[booking])).rows[0].refund_review,true)
  await op({ action:'changeRoute',tripId,revision:3,route:'starichkov',guestsAgreed:true })
  await op({ action:'moveTrip',tripId,revision:4,date:'2027-07-21',start:'09:00',end:'15:00',guestsAgreed:true })
  const moved = (await pool.query("SELECT to_char(d.day,'YYYY-MM-DD') AS date, t.route FROM trips t JOIN booking_days d ON d.id=t.day_id WHERE t.id=$1",[tripId])).rows[0]
  assert.deepEqual(moved,{date:'2027-07-21',route:'starichkov'})
  const day = await pool.query('UPDATE booking_days SET is_open=true WHERE boat_id=$1 AND day=$2',[boat,'2027-07-21'])
  assert.equal(day.rowCount,1)
  await createHold(pool,{tripId,route:'starichkov',guests:1,name:'Test',phone:'70000000000'})
  await assert.rejects(op({action:'cancelTrip',tripId,revision:6,guestsNotified:true}),/ACTIVE_CHECKOUT/)
  await pool.query("UPDATE bookings SET hold_expires_at=now()-interval '1 minute' WHERE trip_id=$1 AND status='held'",[tripId])
  await op({action:'cancelTrip',tripId,revision:6,guestsNotified:true})
  assert.equal((await pool.query('SELECT confirmation FROM trips WHERE id=$1',[tripId])).rows[0].confirmation,'cancelled')
  const needsReview = (await pool.query("SELECT id FROM bookings WHERE trip_id=$1 AND status='manual_confirmed'",[tripId])).rows[0].id
  assert.equal((await pool.query('SELECT refund_review FROM bookings WHERE id=$1',[needsReview])).rows[0].refund_review,true)
  await op({action:'resolveRefund',tripId,revision:7,bookingId:needsReview,note:'Refund checked manually',refundKopecks:0,manuallyVerified:true})
  assert.equal((await pool.query('SELECT refund_review FROM bookings WHERE id=$1',[needsReview])).rows[0].refund_review,false)
  const from = Number((await op({action:'createTrip',boatId:boat,date:'2027-07-22',start:'08:00',end:'16:00',route:'russkaya',kind:'shared'})).id)
  const to = Number((await op({action:'createTrip',boatId:boat,date:'2027-07-23',start:'08:00',end:'16:00',route:'starichkov',kind:'shared'})).id)
  await op({action:'addGuest',tripId:from,revision:0,name:'Test',phone:'70000000000',guests:2,paymentKopecks:200000})
  const moving = (await pool.query('SELECT id FROM bookings WHERE trip_id=$1',[from])).rows[0].id
  await op({action:'reduceGuests',tripId:from,revision:1,bookingId:moving,guests:1,paymentAcknowledged:true})
  assert.equal((await pool.query('SELECT refund_review FROM bookings WHERE id=$1',[moving])).rows[0].refund_review,true)
  await op({action:'resolveRefund',tripId:from,revision:2,bookingId:moving,note:'Reviewed',refundKopecks:100000,manuallyVerified:true})
  await op({action:'transferBooking',tripId:from,revision:3,targetTripId:to,targetRevision:0,bookingId:moving,guestAgreed:true})
  assert.deepEqual((await pool.query('SELECT trip_id::text,route,status FROM bookings WHERE id=$1',[moving])).rows[0],{trip_id:String(to),route:'starichkov',status:'manual_confirmed'})
  await assert.rejects(op({action:'transferBooking',tripId:from,revision:1,targetTripId:to,targetRevision:0,bookingId:moving,guestAgreed:true}),/STALE_TRIP/)
  const online = Number((await op({action:'createTrip',boatId:boat,date:'2027-07-24',start:'08:00',end:'16:00',route:'russkaya',kind:'shared'})).id)
  await pool.query('UPDATE booking_days SET is_open=true WHERE boat_id=$1 AND day=$2',[boat,'2027-07-24'])
  const onlineHold = await createHold(pool,{tripId:online,route:'russkaya',guests:1,name:'Online test',phone:'70000000000'})
  await markVerifiedPayment(pool,onlineHold.id)
  await op({action:'cancelBooking',tripId:online,revision:2,bookingId:onlineHold.id,paymentAcknowledged:true})
  await assert.rejects(op({action:'resolveRefund',tripId:online,revision:3,bookingId:onlineHold.id,note:'Cannot resolve without provider',refundKopecks:0,manuallyVerified:true}),/REFUND_PROVIDER_UNAVAILABLE/)
  console.log('Manager operation checks passed: overlap, seats, payment threshold, stale edits, refund review, move and cancellation.')
} finally { await pool.end() }
