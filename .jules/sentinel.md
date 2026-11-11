## 2024-05-24 - Rate Limiting & Helmet Missing
**Vulnerability:** Missing rate limiting on sensitive AI generation endpoints.
**Learning:** `server.ts` exposes a POST endpoint `/api/oracle/synthesize` that calls the Google GenAI API. There is no rate limiting in place. A malicious actor could repeatedly call this endpoint, leading to exhaustion of the `GEMINI_API_KEY` quota, causing a Denial of Service (DoS) for legitimate users and potentially incurring costs.
**Prevention:** Always implement rate limiting on endpoints that consume external API quotas or perform expensive operations.

## 2024-05-24 - Helmet CSP with Vite
**Vulnerability:** Missing standard security headers on HTTP responses.
**Learning:** Adding `helmet` for security headers is best practice, but its default Content Security Policy (CSP) breaks Vite's development environment (which relies on inline scripts and web sockets).
**Prevention:** When applying `helmet` to an Express server serving a Vite frontend, use `app.use(helmet({ contentSecurityPolicy: false }))` to prevent breaking the local development experience.
