## 2024-05-24 - Rate Limiting & Helmet Missing
**Vulnerability:** Missing rate limiting on sensitive AI generation endpoints.
**Learning:** `server.ts` exposes a POST endpoint `/api/oracle/synthesize` that calls the Google GenAI API. There is no rate limiting in place. A malicious actor could repeatedly call this endpoint, leading to exhaustion of the `GEMINI_API_KEY` quota, causing a Denial of Service (DoS) for legitimate users and potentially incurring costs.
**Prevention:** Always implement rate limiting on endpoints that consume external API quotas or perform expensive operations.

## 2024-10-24 - Missing Security Headers (Helmet)
**Vulnerability:** Missing security headers leaving the application vulnerable to basic web attacks (e.g. XSS, clickjacking).
**Learning:** `server.ts` was not using `helmet` to set secure HTTP response headers. When integrating `helmet` into a Vite dev server, we must disable `contentSecurityPolicy` (`{ contentSecurityPolicy: false }`) so it doesn't block inline scripts/styles needed for Vite's HMR to function correctly.
**Prevention:** Always use `helmet` for Express applications to ensure baseline security headers are present, keeping dev environment constraints in mind.
