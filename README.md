# VYAJ — Plan less. Travel more.

VYAJ is a premium travel-planning experience built with Next.js, React, and TypeScript. The frontend is exported as a static site for GitHub Pages; product APIs run separately on a Cloudflare Worker so private credentials never enter the browser bundle.

## Current implementation

- Responsive VYAJ landing experience with destination inspiration, FAQs, and waitlist UI.
- Trip-planner modal with validated required destination, THINKING status, real API request, actual itinerary rendering on confirmed API success, and a separate Coming Soon result for explicit `coming_soon` responses.
- Central typed API client in `lib/api.ts`, including a request timeout and user-safe network/API errors.
- Versioned Worker action contracts. The trip planner calls the Gemini API server-side; the other registered actions explicitly return `coming_soon` until implemented.
- API secrets are read only by the Worker, not exposed as `NEXT_PUBLIC_*` values.

## Architecture

```text
Browser (GitHub Pages / vyaj.eu)
  └── lib/api.ts
       └── NEXT_PUBLIC_VYAJ_API_URL
            └── Cloudflare Worker (worker/index.ts)
                 └── Gemini API (server-side GEMINI_API_KEY)
```

GitHub Pages only hosts static files. Do not add Next.js server routes expecting them to run on Pages.

## Local development

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

The website runs at `http://localhost:3000`. Without the Worker URL, the planner will show a friendly service-connection message rather than pretending it generated a trip.

## Environment variables and secrets

### Frontend build variable

Set the GitHub Actions repository variable:

- Name: `NEXT_PUBLIC_VYAJ_API_URL`
- Value: the base URL of your deployed Cloudflare Worker, for example `https://vyaj-ai-api.<your-account>.workers.dev` (use the actual URL shown by Cloudflare; do not guess it).

Path suffixes are added by the API client. Do not include `/api` in the variable.

For local builds, create `.env.local` with:

```bash
NEXT_PUBLIC_VYAJ_API_URL=https://your-actual-worker-url
```

This URL is public configuration, not a secret.

### Worker secret

Set the secret in Cloudflare, never in the frontend or GitHub Pages files:

```bash
npx wrangler secret put GEMINI_API_KEY
npx wrangler deploy
```

Run these commands from the repository root. Wrangler uses `wrangler.toml` and deploys `worker/index.ts`. Enter the key only at Wrangler's interactive prompt. Never commit it to the repository.

Allowed browser origins are explicitly listed in `worker/index.ts`; update that list deliberately if the production domain changes.

## API contract

All endpoints use JSON over HTTPS and `POST`. The base URL is the Worker URL.

### Implemented

| Endpoint | Request fields | Successful response |
| --- | --- | --- |
| `/api/v1/actions/plan-trip` | `destination` (required string), `duration`, `travellers`, `style`, `notes` | `{ status: "available", feature: "plan-trip", itinerary: ... }` |

The older `/api/plan` route remains as a compatibility alias. Requests are size-limited, user inputs are length-limited, and the upstream AI request has a timeout. Itinerary prices and opening hours are estimates, not live-verified data.

### Registered stubs

These endpoints validate that a JSON object was sent and return an explicit feature state. They do not save data, send invitations, search live inventory, or perform a vote.

| Endpoint | Contract / state |
| --- | --- |
| `/api/v1/actions/decide-for-us` | `{ status: "coming_soon", feature: "decide-for-us" }` |
| `/api/v1/actions/surprise-me` | `{ status: "coming_soon", feature: "surprise-me" }` |
| `/api/v1/actions/search-destinations` | `{ status: "coming_soon", feature: "search-destinations" }` |
| `/api/v1/actions/adjust-itinerary` | `{ status: "coming_soon", feature: "adjust-itinerary" }` |
| `/api/v1/actions/invite-travelers` | `{ status: "coming_soon", feature: "invite-travelers" }` |
| `/api/v1/actions/submit-vote` | `{ status: "coming_soon", feature: "submit-vote" }` |
| `/api/v1/actions/view-notifications` | `{ status: "coming_soon", feature: "view-notifications" }` |

### Error response

Errors use non-2xx HTTP status codes and a safe JSON body, for example:

```json
{ "error": "We couldn't build that itinerary just now. Please try again." }
```

The client distinguishes network/timeout/server errors from a real `coming_soon` response. A failed request is never converted into a Coming Soon result.

HTTP statuses currently used include `400` invalid request, `403` disallowed origin, `404` unknown endpoint, `405` unsupported method, `413` oversized request, `429` upstream quota/rate response, `502` upstream failure, and `504` timeout.

## Build, checks, and deployment

```bash
npm run build
npm run lint
```

GitHub Actions builds the static export and deploys it to GitHub Pages on pushes to `main`. Confirm the `Deploy VYAJ to GitHub Pages` workflow succeeds before testing `https://vyaj.eu`. After adding/updating `NEXT_PUBLIC_VYAJ_API_URL`, trigger a new workflow run because the value is embedded at build time.

### Deploying the Worker

1. Install/authenticate Wrangler: `npx wrangler login`.
2. Add the Gemini secret with `npx wrangler secret put GEMINI_API_KEY`.
3. Deploy with `npx wrangler deploy`.
4. Copy the real Worker URL printed by Cloudflare.
5. Add that URL as the GitHub Actions repository variable `NEXT_PUBLIC_VYAJ_API_URL`.
6. Re-run the GitHub Pages workflow.

## Known limitations — be explicit

- Group collaboration, voting, notifications, destination search, itinerary adjustment, and invitations are API stubs returning `coming_soon`; they are not implemented product operations yet.
- The current email waitlist form is a local UI demo only; it does not persist addresses or send confirmation email.
- Authentication, user accounts, persistent trips, database storage, invitation delivery, and production-grade rate limiting are not implemented.
- No live booking, real-time prices, opening hours, or transport availability are connected.
- The Worker currently has CORS/origin checks, request size/field limits, and an upstream timeout, but CORS is not authentication and is not a substitute for rate limiting. Add an edge rate-limit rule before promoting the AI endpoint to broad public use.
- Responsive and accessibility checks should be completed on real device/browser sizes; a successful production build alone does not prove visual correctness.

## Security notes

Never commit API keys, cookies, access tokens, or private credentials. Never put secrets in `NEXT_PUBLIC_*` variables. If a key is accidentally exposed, revoke and rotate it immediately.
