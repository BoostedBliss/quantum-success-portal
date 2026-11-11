## 2024-05-24 - Rate Limiting & Helmet Missing
**Vulnerability:** Missing rate limiting on sensitive AI generation endpoints.
**Learning:** `server.ts` exposes a POST endpoint `/api/oracle/synthesize` that calls the Google GenAI API. There is no rate limiting in place. A malicious actor could repeatedly call this endpoint, leading to exhaustion of the `GEMINI_API_KEY` quota, causing a Denial of Service (DoS) for legitimate users and potentially incurring costs.
**Prevention:** Always implement rate limiting on endpoints that consume external API quotas or perform expensive operations.

## 2024-11-05 - Missing Security Headers
**Vulnerability:** Missing security headers (X-Frame-Options, X-Content-Type-Options, etc.) and information leakage in API error response.
**Learning:** Using Helmet is a standard way to add these, but when used with Vite, `contentSecurityPolicy: false` must be set to prevent breaking the development environment. Also, error messages from external APIs must be sanitized.
**Prevention:** Always use Helmet in Express apps, with appropriate configuration for the frontend tooling, and ensure error handlers return generic messages.
