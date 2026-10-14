# VYAJ — Plan less. Travel more.

VYAJ is a premium travel-planning web experience built with Next.js, React, and TypeScript. The frontend is exported as a static site to GitHub Pages; APIs run on a Cloudflare Worker.

## Architecture

```text
Browser (GitHub Pages / vyaj.eu)
  ├── Static Next.js export
  ├── lib/api.ts
  │    └── Cloudflare Worker (worker/index.js)
  │          ├── Groq API — AI itinerary generation
  │          ├── SerpApi — flight search
  │          ├── Ignav — flight booking-link lookup
  │          ├── Resend — waitlist welcome email
  │          └── Cloudflare D1 — account/session/trip storage
  └── Formspree — waitlist registration
```

GitHub Pages only hosts static files. Do not add Next.js server routes expecting them to run on Pages.

## Current implementation status

### Implemented in code; production configuration and end-to-end behavior still need verification

- AI trip planning through `POST /api/v1/actions/plan-trip` using the Groq API server-side.
- Account signup/login and session handling using the Worker and D1.
- Saving and listing trips for an authenticated user.
- Flight search through SerpApi / Google Flights and a separate booking-link lookup through Ignav.
- Waitlist registration through the Formspree form, with a separate best-effort welcome email through the Worker/Resend.
- CORS allowlist, request validation/size limits, and upstream timeouts for supported Worker actions.

A code path is not proof that production secrets, database schema, provider quotas, email delivery, and deployed configuration are all correct. Verify these with controlled end-to-end tests before launch.

### Explicitly not implemented yet

Several registered actions intentionally return `coming_soon`. These include collaborative trip actions such as voting, invitations, notifications, destination search, trip adjustments, and other actions without a complete implementation. The UI must not present these as working features.

The planner returns AI-generated suggestions, not verified live prices, opening hours, routes, inventory, or booking confirmations. Flight results and booking links depend on configured third-party services and must be checked in production.

## Local development

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

The site runs at `http://localhost:3000`.

### Frontend configuration

Set the GitHub Actions repository variable:

- `NEXT_PUBLIC_VYAJ_API_URL`: the actual deployed Worker base URL, without a trailing slash or `/api` suffix.

For local development, set `NEXT_PUBLIC_VYAJ_API_URL=http://localhost:8787` in `.env.local` when running `npx wrangler dev`.

This URL is public configuration, not a secret.

### Worker secrets and local variables

The Worker uses server-side credentials. Never put provider API keys in `NEXT_PUBLIC_*` variables or commit real keys.

Local setup:

1. Copy `.dev.vars.example` to `.dev.vars`.
2. Put real development credentials in `.dev.vars`.
3. Run `npx wrangler dev`.

Production secrets are configured through Wrangler, for example:

```bash
npx wrangler secret put GROQ_API_KEY
npx wrangler secret put SERPAPI_API_KEY
npx wrangler secret put IGNAV_API_KEY
npx wrangler secret put RESEND_API_KEY
npx wrangler deploy
```

Only configure secrets for providers/features actually being used. Enter secrets at Wrangler's interactive prompt. The Worker also requires the D1 database binding configured in `wrangler.toml` and the relevant database tables to exist. The repository includes `migrations/0001_initial_schema.sql`; inspect the target first, then apply pending migrations with `npx wrangler d1 migrations apply vyaj-production --remote`. This repository change does not itself apply the migration to production.

## API contracts

All action endpoints use JSON over HTTPS and `POST`.

| Endpoint | Current behavior |
| --- | --- |
| `/api/v1/actions/plan-trip` | Generates an AI itinerary when Groq is configured. |
| `/api/v1/actions/signup`, `/login` | Account operations using D1, if the database and schema are correctly configured. |
| `/api/v1/actions/save-trip`, `/list-trips` | Authenticated trip persistence in D1, if configured. |
| `/api/v1/actions/search-flights` | Flight search using SerpApi / Google Flights. |
| `/api/v1/actions/flight-booking-options` | Looks up provider booking links using Ignav when given a valid booking reference. |
| `/api/v1/actions/join-waitlist` | Sends a welcome email through Resend; the website separately stores registrations through Formspree. |
| Other registered actions | Return an explicit `coming_soon` response until implemented. |

The legacy `/api/plan` route remains an alias for `plan-trip`. Do not treat an HTTP 200 response by itself as proof that a feature completed: inspect the JSON `status` and expected data.

## Build, checks, and deployment

```bash
npm run build
npm run lint
```

GitHub Actions builds and deploys the static export to GitHub Pages on pushes to `main`. The Worker deploy workflow runs when Worker/config files change. Check both workflows before testing `https://vyaj.eu`.

Useful checks:

- `VYAJ Worker smoke test`: validates production CORS and attempts a real AI itinerary request.
- `VYAJ live browser smoke test`: checks selected desktop/mobile UI behavior against the deployed website.
- `VYAJ backend feature audit`: reports which registered actions are placeholders. It is a manual workflow and should be run after backend changes.

Automated checks cover only their stated scenarios; they do not replace real-device testing, email inbox checks, database verification, or provider account/billing checks.

## Launch blockers and known limitations

- **Rate limiting:** CORS is not authentication and does not stop direct API abuse. Configure Cloudflare rate limiting and suitable bot protection/monitoring before broad public promotion of AI and flight endpoints.
- **Secrets:** verify required production Worker secrets are present and valid without printing their values in logs.
- **D1:** verify schema migrations, backups, access control, and production signup/login/save/list flows.
- **Waitlist:** submit a controlled test address; verify Formspree registration and separately check whether the welcome email arrives. The Worker email request is not the waitlist's storage system.
- **Flight services:** verify API credentials, quotas, response mapping, currency, and booking links. Search results are not booking confirmations.
- **Responsive/accessibility:** test on real iPhone Safari and Android browsers as well as desktop. A successful build or Chromium smoke test does not prove iOS behavior. Safari may still permit pinch zoom despite website restrictions.
- **Privacy and security:** review consent/privacy copy, data retention, password/session handling, abuse protection, and third-party data flows before public launch.

## Security notes

Never commit API keys, cookies, access tokens, or private credentials. If a key is accidentally exposed, revoke and rotate it immediately.
