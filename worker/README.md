# VYAJ Cloudflare Worker

The Worker serves the VYAJ API at `/api/v1/actions/*`. The trip planner uses Groq server-side through `GROQ_API_KEY`; do not put this secret in frontend variables or commit it.

## Deploy

From the repository root:

```bash
npx wrangler login
npx wrangler secret put GROQ_API_KEY
npx wrangler deploy
```

Wrangler reads `wrangler.toml` and deploys `worker/index.js`. Enter the key only at the interactive prompt. The deployed Worker URL should match the GitHub Actions variable `NEXT_PUBLIC_VYAJ_API_URL` (base URL only, no trailing slash or `/api` suffix).

## Local development

- Copy `.dev.vars.example` to `.dev.vars` and set `GROQ_API_KEY` locally.
- Run `npx wrangler dev` to start the Worker locally.
- Set `NEXT_PUBLIC_VYAJ_API_URL=http://localhost:8787` for the Next.js app during local development.

## Current behavior and limitations

- Implemented endpoint: `POST /api/v1/actions/plan-trip` (legacy alias: `POST /api/plan`).
- The planner returns AI-generated itinerary suggestions and broad estimates, not live prices, verified opening hours, live routes, or booking confirmation.
- `join-waitlist` validates the email and attempts a welcome email via Resend using `RESEND_API_KEY`. It does not persist the waitlist; the website's Formspree form is the waitlist registration store.
- Other registered actions currently return `coming_soon`; they do not authenticate users, save trips, book travel, or persist itinerary edits.
- CORS origin checks are not authentication and do not prevent abuse by themselves. Configure Cloudflare rate limiting/Turnstile and monitoring before broad promotion.
- Allowed browser origins are defined in `worker/index.js`. Update that allowlist deliberately if the production domain changes.
