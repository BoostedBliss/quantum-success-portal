## 2024-05-24 - Rate Limiting & Helmet Missing
**Vulnerability:** Missing rate limiting on sensitive AI generation endpoints.
**Learning:** `server.ts` exposes a POST endpoint `/api/oracle/synthesize` that calls the Google GenAI API. There is no rate limiting in place. A malicious actor could repeatedly call this endpoint, leading to exhaustion of the `GEMINI_API_KEY` quota, causing a Denial of Service (DoS) for legitimate users and potentially incurring costs.
**Prevention:** Always implement rate limiting on endpoints that consume external API quotas or perform expensive operations.

## 2024-05-24 - Missing Security Headers
**Vulnerability:** The application was missing basic security HTTP headers.
**Learning:** In a mixed Vite/Express setup, standard `helmet()` blocks Vite's inline scripts and dev server WebSocket due to strict Content Security Policy.
**Prevention:** Always use `helmet({ contentSecurityPolicy: false })` when applying it alongside Vite development middleware, or configure the CSP to explicitly allow Vite's assets.
