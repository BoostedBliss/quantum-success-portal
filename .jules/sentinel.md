## 2024-05-24 - Rate Limiting & Helmet Missing
**Vulnerability:** Missing rate limiting on sensitive AI generation endpoints.
**Learning:** `server.ts` exposes a POST endpoint `/api/oracle/synthesize` that calls the Google GenAI API. There is no rate limiting in place. A malicious actor could repeatedly call this endpoint, leading to exhaustion of the `GEMINI_API_KEY` quota, causing a Denial of Service (DoS) for legitimate users and potentially incurring costs.
**Prevention:** Always implement rate limiting on endpoints that consume external API quotas or perform expensive operations.

## 2024-06-12 - Missing Security Headers
**Vulnerability:** Missing fundamental security headers on the Express server (X-XSS-Protection, X-Frame-Options, X-Content-Type-Options, etc.).
**Learning:** While implementing Helmet to address this, the Content Security Policy (CSP) headers broke Vite's development environment features. This is a common pattern when adding strict CSP to local dev servers with HMR.
**Prevention:** When applying Helmet middleware alongside a Vite dev server, always configure it with `{ contentSecurityPolicy: false }` or apply CSP conditionally only in the production build environment.
