## 2024-05-24 - Rate Limiting & Helmet Missing
**Vulnerability:** Missing rate limiting on sensitive AI generation endpoints.
**Learning:** `server.ts` exposes a POST endpoint `/api/oracle/synthesize` that calls the Google GenAI API. There is no rate limiting in place. A malicious actor could repeatedly call this endpoint, leading to exhaustion of the `GEMINI_API_KEY` quota, causing a Denial of Service (DoS) for legitimate users and potentially incurring costs.
**Prevention:** Always implement rate limiting on endpoints that consume external API quotas or perform expensive operations.

## 2024-05-24 - Security Headers with Vite
**Vulnerability:** Missing HTTP security headers (e.g. X-Content-Type-Options, Strict-Transport-Security, X-XSS-Protection) leading to potential cross-site scripting (XSS), clickjacking, and other code injection attacks.
**Learning:** Adding the `helmet` middleware is the standard way to apply security headers in an Express app. However, when using Helmet alongside Vite's development server, Vite relies on inline scripts or specific connections that are blocked by Helmet's default Content Security Policy (CSP).
**Prevention:** Always use `helmet` for security headers in Express. When configuring Helmet in a Vite environment, pass `{ contentSecurityPolicy: false }` to avoid breaking the development environment while still gaining the protection of the other security headers.
