# VYAJ AI backend

This Cloudflare Worker keeps the Gemini API key server-side and exposes one endpoint: POST /api/plan.

## Deploy it

1. Create a Cloudflare account and install Node.js on your computer.
2. In a terminal, clone your repo and run npm install.
3. From the repository root, install Wrangler locally: npm install --save-dev wrangler.
4. Authenticate: npx wrangler login.
5. From the repository root, add the API key as a Worker secret (paste it only into the terminal prompt): npx wrangler secret put GEMINI_API_KEY
6. Deploy the Worker: npx wrangler deploy.
7. Copy the Worker URL printed by Wrangler, usually https://vyaj-ai-api.<your-account>.workers.dev.
8. In GitHub repository Settings → Secrets and variables → Actions → Variables, create NEXT_PUBLIC_VYAJ_API_URL with the Worker URL, without a trailing slash.
9. The GitHub Pages build workflow must pass NEXT_PUBLIC_VYAJ_API_URL into the build environment. The workflow file is .github/workflows/nextjs.yml.
10. After redeployment, open https://vyaj.eu and test the planner.

## Local development

- Copy .dev.vars.example to .dev.vars and put your key in that local file (never commit .dev.vars).
- Run npx wrangler dev; the API will usually be available at http://localhost:8787.
- For local Next.js development, set NEXT_PUBLIC_VYAJ_API_URL=http://localhost:8787 before starting the site.

## Security and product notes

- The API key is only read from Cloudflare Worker secrets; it is never bundled into the browser.
- The Worker only accepts requests from vyaj.eu, www.vyaj.eu, and localhost development origins.
- API usage can cost money and is subject to Google quotas. Check AI Studio's usage and billing before public launch.
- This starter backend is not a complete abuse-prevention system. Add Cloudflare rate limiting or Turnstile and monitoring before promoting the public planner widely.
- It generates planning suggestions, not verified live facts. Opening hours, ticket prices, routes, and bookings need separate data providers.
