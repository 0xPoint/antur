# Content Model

## Route Offer

Source today: `data/routes.ts`.

Future source: CMS or database table.

Fields:

- `slug`: stable URL id.
- `title`: route page H1 and card title.
- `kicker`: short category or duration label.
- `duration`: booking/calendar display.
- `price`: public starting price when applicable.
- `description`: indexable summary.
- `highlights`: included activities, prices, or route facts.
- `image` and `imageAlt`: SEO and accessibility media.

## Reviews

Source today: `data/social-proof.ts`.

Future source: database with moderation.

Only approved reviews should be server-rendered. Pending reviews stay private until moderation.

## Tour Photos

Source today: `data/social-proof.ts`.

Future source: object storage plus metadata in CMS/DB.

Photo metadata must include route, date, alt text, and moderation status so fresh gallery pages remain indexable.
