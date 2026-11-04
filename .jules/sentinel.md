## 2024-05-24 - Rate Limiting & Helmet Missing
**Vulnerability:** Missing rate limiting on sensitive AI generation endpoints.
**Learning:** `server.ts` exposes a POST endpoint `/api/oracle/synthesize` that calls the Google GenAI API. There is no rate limiting in place. A malicious actor could repeatedly call this endpoint, leading to exhaustion of the `GEMINI_API_KEY` quota, causing a Denial of Service (DoS) for legitimate users and potentially incurring costs.
**Prevention:** Always implement rate limiting on endpoints that consume external API quotas or perform expensive operations.

## 2024-05-24 - Missing Security Headers in Express App
**Vulnerability:** The application was missing basic security headers (e.g., X-DNS-Prefetch-Control, X-Frame-Options, Strict-Transport-Security, X-Download-Options, X-Content-Type-Options, X-XSS-Protection), leaving it exposed to clickjacking, mime-sniffing, and other web vulnerabilities.
**Learning:** Adding `helmet` is a standard way to secure Express applications, but when running it alongside a Vite development server using middleware mode, Helmet's default Content Security Policy (CSP) restricts the inline scripts and specific asset loading strategies Vite uses.
**Prevention:** Use `helmet({ contentSecurityPolicy: false })` when integrating with Vite dev middleware to allow HMR and asset loading while retaining all other security headers.
