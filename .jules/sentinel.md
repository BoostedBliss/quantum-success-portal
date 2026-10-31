## 2024-05-24 - Rate Limiting & Helmet Missing
**Vulnerability:** Missing rate limiting on sensitive AI generation endpoints.
**Learning:** `server.ts` exposes a POST endpoint `/api/oracle/synthesize` that calls the Google GenAI API. There is no rate limiting in place. A malicious actor could repeatedly call this endpoint, leading to exhaustion of the `GEMINI_API_KEY` quota, causing a Denial of Service (DoS) for legitimate users and potentially incurring costs.
**Prevention:** Always implement rate limiting on endpoints that consume external API quotas or perform expensive operations.

## 2024-05-18 - [Fix Information Leakage in Error Response]
**Vulnerability:** The server error response was returning the raw message from the error object (`err?.message`).
**Learning:** Third-party libraries, like API SDKs or database clients, can include sensitive information such as API keys, service URLs, internal file paths, or infrastructure details in their error messages. Passing these messages directly to the client exposes this sensitive data.
**Prevention:** Always return a generic error message (e.g., "An internal server error occurred") or a specific but safe message to the client when a 500 error occurs. Log the full error message server-side for debugging purposes.
