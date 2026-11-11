## 2024-05-24 - Rate Limiting & Helmet Missing
**Vulnerability:** Missing rate limiting on sensitive AI generation endpoints.
**Learning:** `server.ts` exposes a POST endpoint `/api/oracle/synthesize` that calls the Google GenAI API. There is no rate limiting in place. A malicious actor could repeatedly call this endpoint, leading to exhaustion of the `GEMINI_API_KEY` quota, causing a Denial of Service (DoS) for legitimate users and potentially incurring costs.
**Prevention:** Always implement rate limiting on endpoints that consume external API quotas or perform expensive operations.

## 2024-05-24 - Missing Security Headers
**Vulnerability:** The application lacks basic security headers like X-Content-Type-Options, Strict-Transport-Security, and X-XSS-Protection.
**Learning:** `server.ts` handles API requests and serves the frontend but does not use `helmet` or any other middleware to set security headers, leaving it vulnerable to various attacks like MIME sniffing and XSS.
**Prevention:** Always use `helmet` in Express applications to set secure default HTTP headers. Ensure `contentSecurityPolicy` is disabled if it interferes with development tools like Vite.
