# Booking development foundation

This is unfinished, local-only work. It is not connected to public APIs, real bookings, YooKassa, notifications, or manager authentication. Do not use for real customers or payments. The legal terms have not been approved.

To validate the migration and transactional reservation functions, use a **new dedicated local PostgreSQL database** and never an existing database:

```sh
createdb antur_booking_dev_check
psql -v ON_ERROR_STOP=1 -d antur_booking_dev_check -f server/database/booking/001-schema.sql
PGDATABASE=antur_booking_dev_check node --experimental-strip-types scripts/check-booking-db.mjs
```

The script inserts synthetic data. `booking-preview` is a local mock with synthetic dates and a disabled payment button. See `docs/booking-implementation-plan.md` for outstanding decisions. The current database functions are a foundation, not a complete security or payments implementation; every future writer must follow the same transaction/locking protocol.
