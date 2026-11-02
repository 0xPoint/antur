# Booking development foundation

This is unfinished, local-only work. It is not connected to public APIs, real bookings, YooKassa, notifications, or manager authentication. Do not use for real customers or payments. The legal terms have not been approved.

To validate the migration and transactional reservation functions, use a **new dedicated local PostgreSQL database** and never an existing database:

```sh
createdb antur_booking_dev_check
psql -v ON_ERROR_STOP=1 -d antur_booking_dev_check -f server/database/booking/001-schema.sql
psql -v ON_ERROR_STOP=1 -d antur_booking_dev_check -f server/database/booking/002-manager-auth.sql
psql -v ON_ERROR_STOP=1 -d antur_booking_dev_check -f server/database/booking/003-manager-sessions.sql
psql -v ON_ERROR_STOP=1 -d antur_booking_dev_check -f server/database/booking/004-month-versions.sql
PGDATABASE=antur_booking_dev_check node --experimental-strip-types scripts/check-booking-db.mjs
```

The script inserts synthetic data. `booking-preview` is a local mock with synthetic dates and a disabled payment button. See `docs/booking-implementation-plan.md` for outstanding decisions. The current database functions are a foundation, not a complete security or payments implementation; every future writer must follow the same transaction/locking protocol.

The manager page is `/manager/`; manager APIs stay disabled unless `NUXT_BOOKING_ENABLED=true`, a database URL, username, password hash, session secret (32 or more characters), and exact origin are all configured. The origin must match the browser origin including port. Cookies are secure outside development; use HTTPS on any deployed server. The current implementation provides a single shared manager account and month availability only. Manager access still requires security review, proper hosting, backups, and operational setup before production.

To create a password hash without placing the password in command history (zsh):

```sh
read -rs '?Пароль: ' task_manager_password
printf '%s' "$task_manager_password" | node scripts/hash-manager-password.mjs
unset task_manager_password
```

Store the resulting hash and a separately generated random session secret in server-only secret storage, never in git. Configure `NUXT_MANAGER_USERNAME`, `NUXT_MANAGER_PASSWORD_HASH`, `NUXT_MANAGER_SESSION_SECRET`, and `NUXT_MANAGER_ORIGIN` as documented in `.env.example`. Rotating the session secret immediately invalidates all sealed cookies.
