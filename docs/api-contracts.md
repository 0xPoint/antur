# API Contracts

Current APIs are stubs. They define the integration shape for the expandable MVP.

> Product decision as of 2026-08-03: the public site does not show dates,
> available seats, or automatic booking confirmation. Guests confirm a trip by
> phone because weather, customs/border procedures, and actual group occupancy
> must be checked manually. Keep the placeholder contracts stable, but do not
> connect their stub data to the public UI until this decision is reviewed.

## `GET /api/availability`

Query:

- `route`
- `month`

Returns route availability by date and slot.

Deferred. Stub dates must never be rendered as real availability.

## `POST /api/bookings`

Creates a booking draft or lead. Future implementation should validate contact data, lock a slot, and return a booking id.

Deferred. A future implementation must remain pending until a manager confirms
the weather, required clearances, group occupancy, and final route conditions.

## `POST /api/payments/create`

Creates a payment intent for a booking. Future implementation should never expose provider secrets to the browser.

Deferred. Do not create a payment before the trip has been manually confirmed.

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
