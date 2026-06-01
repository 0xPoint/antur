# API Contracts

Current APIs are stubs. They define the integration shape for the expandable MVP.

## `GET /api/availability`

Query:

- `route`
- `month`

Returns route availability by date and slot.

## `POST /api/bookings`

Creates a booking draft or lead. Future implementation should validate contact data, lock a slot, and return a booking id.

## `POST /api/payments/create`

Creates a payment intent for a booking. Future implementation should never expose provider secrets to the browser.

## `POST /api/payments/webhook`

Receives provider events. Must verify signature before marking a booking as paid.

## `GET /api/reviews`

Returns approved reviews only.

## `POST /api/reviews`

Accepts a review for moderation.

## `GET /api/photos/recent`

Returns approved recent tour photos.

## `POST /api/leads`

Accepts quick lead capture from forms or CTA flows.
