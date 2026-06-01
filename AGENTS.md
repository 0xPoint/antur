# Antur Agents And Skills

This file fixes the product roles and skill expectations for the Antur MVP. Runtime sub-agents may help during development, but this document is the repo source of truth.

## Product Goal

Build an expandable SSR MVP for sea tours and deep-sea fishing in Kamchatka. The site must attract clients now and support booking calendar, payments, reviews, fresh tour photos, SEO pages, and CMS/API-backed content later.

## Roles

- Frontend developer: owns Nuxt pages, Vue components, accessibility, responsive layout, Core Web Vitals.
- UX/UI designer: owns premium marine visual system, mobile CTA behavior, image hierarchy, readability.
- Marketing/copywriter: owns offer, route descriptions, CTA text, objections, FAQ, lead capture flow.
- SEO specialist: owns indexed route pages, metadata, JSON-LD, sitemap, robots, internal linking, content freshness.
- DevOps/backend engineer: owns deployment, Nitro server routes, runtime config, payment webhooks, storage/CDN, monitoring.
- Content manager: owns route data, approved reviews, fresh tour photos, seasonal text, prices.

## Skills Applied

- Frontend architecture: Nuxt 3 SSR/hybrid rendering, structured data, componentized pages.
- SEO implementation: server-rendered content, route pages, LocalBusiness/TouristTrip/FAQ schema, generated sitemap.
- Mobile conversion: sticky CTA, contact modal, short high-intent sections.
- Performance: local optimized JPEG assets, explicit image sizes, lazy-loaded below-the-fold media.
- Product extensibility: API stubs for availability, bookings, payments, reviews, photos, leads.

## Rules

- Important SEO content must render on the server. Do not move route descriptions, prices, FAQ, approved reviews, or fresh photo captions into client-only fetches.
- Payment secrets and webhook secrets belong only in server runtime config.
- User-generated content must be moderated before it is rendered on public pages.
- Images must be uploaded as originals, transformed into web sizes, and rendered with dimensions to avoid layout shift.
- Route/API contracts in `server/api` are placeholders but should remain stable as frontend integration begins.
- Do not reinvent standard interaction patterns or infrastructure. If a mature, documented solution exists on the web or in the chosen framework, prefer it over custom mechanics unless there is a clear product reason.

## Commands

- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm generate`
