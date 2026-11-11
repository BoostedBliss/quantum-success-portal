## 2024-05-24 - Rate Limiting & Helmet Missing
**Vulnerability:** Missing rate limiting on sensitive AI generation endpoints.
**Learning:** `server.ts` exposes a POST endpoint `/api/oracle/synthesize` that calls the Google GenAI API. There is no rate limiting in place. A malicious actor could repeatedly call this endpoint, leading to exhaustion of the `GEMINI_API_KEY` quota, causing a Denial of Service (DoS) for legitimate users and potentially incurring costs.
**Prevention:** Always implement rate limiting on endpoints that consume external API quotas or perform expensive operations.

## 2025-05-18 - Missing API Input Validation
**Vulnerability:** External API proxy endpoints lacked input length validation and type checking, and leaked internal stack/error messages.
**Learning:** External-facing proxies that call third-party APIs (like Gemini) must strictly validate user input size and structure to prevent payload stuffing and mitigate potential prompt injection risks. Express endpoints must also hide the `x-powered-by` header and sanitize error messages to prevent technology exposure.
**Prevention:** Implement validation early in the route handler. Use length checks, type assertions, and catch block sanitization by default on all external API proxy routes.
