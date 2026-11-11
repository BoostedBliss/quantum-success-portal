## 2024-05-24 - Rate Limiting & Helmet Missing
**Vulnerability:** Missing rate limiting on sensitive AI generation endpoints.
**Learning:** `server.ts` exposes a POST endpoint `/api/oracle/synthesize` that calls the Google GenAI API. There is no rate limiting in place. A malicious actor could repeatedly call this endpoint, leading to exhaustion of the `GEMINI_API_KEY` quota, causing a Denial of Service (DoS) for legitimate users and potentially incurring costs.
**Prevention:** Always implement rate limiting on endpoints that consume external API quotas or perform expensive operations.
## 2026-11-03 - Adding Helmet security headers and fixing generic error leakage
**Vulnerability:** Missing security headers and potential information disclosure in API error response.
**Learning:** Implementing Helmet in Express + Vite setups must bypass CSP constraints via `contentSecurityPolicy: false` to avoid breaking dev mode. Internal error messages should be sanitized before responding to clients to prevent leaking stack details or API internals.
**Prevention:** Use Helmet with CSP disabled for Vite combos, and enforce sanitizing generic error messages.
