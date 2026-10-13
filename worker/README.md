# VYAJ Cloudflare Worker

The Worker serves VYAJ APIs at `/api/v1/actions/*`. The frontend is a static GitHub Pages export; API credentials must remain server-side.

## Deploy

From the repository root:

```bash
npx wrangler login
npx wrangler secret put GROQ_API_KEY
npx wrangler secret put SERPAPI_API_KEY
npx wrangler secret put IGNAV_API_KEY
npx wrangler secret put RESEND_API_KEY
npx wrangler deploy
```

Only configure credentials for services you intend to use. Enter secrets interactively and never commit them. The deployed Worker base URL must match the GitHub Actions variable `NEXT_PUBLIC_VYAJ_API_URL` (no trailing slash and no `/api` suffix).

## Local development

1. Copy `.dev.vars.example` to `.dev.vars`.
2. Add development credentials to `.dev.vars`; do not commit that file.
3. Run `npx wrangler dev`.
4. Set `NEXT_PUBLIC_VYAJ_API_URL=http://localhost:8787` in the frontend's local environment.

The D1 binding and migrations directory are declared in `wrangler.toml`. The initial schema is in `migrations/0001_initial_schema.sql` and creates the users, sessions, and trips tables plus lookup indexes. Inspect the target database, then apply pending migrations with `npx wrangler d1 migrations apply vyaj-production --remote`. Do not assume production has been migrated just because the file exists in Git.

## Current endpoint behavior

- `POST /api/v1/actions/plan-trip` (and legacy alias `POST /api/plan`): AI-generated itinerary via Groq.
- `POST /api/v1/actions/search-flights`: flight search via SerpApi / Google Flights.
- `POST /api/v1/actions/flight-booking-options`: booking-link lookup via Ignav when a valid booking reference is supplied.
- `POST /api/v1/actions/signup` and `/login`: account operations using D1, subject to correct schema/configuration.
- `POST /api/v1/actions/save-trip` and `/list-trips`: authenticated trip persistence using D1, subject to correct schema/configuration.
- `POST /api/v1/actions/join-waitlist`: validates an email and sends a welcome message via Resend. The website stores the waitlist registration separately through Formspree.
- Other registered actions currently return `coming_soon`; they do not perform the advertised operation.

A successful code path is not proof of correct production configuration. Run controlled end-to-end tests for D1, each provider integration, email delivery, and authentication before launch.

## Security and launch checks

- CORS origin checks are not authentication and do not stop non-browser clients from calling public endpoints.
- Configure Cloudflare rate limiting and bot protection before broad promotion, especially for AI and flight-search endpoints.
- Keep all provider credentials in Worker secrets. Never use `NEXT_PUBLIC_*` for private keys.
- Verify D1 schema, backup/recovery, password hashing, session expiration/revocation, and authorization on every user-owned trip operation.
- Do not log credentials, session tokens, or unnecessary personal data.
- Itinerary prices/opening hours are estimates unless independently verified. A flight search or booking link is not a booking confirmation.
