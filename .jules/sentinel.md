## 2024-05-24 - Rate Limiting & Helmet Missing
**Vulnerability:** Missing rate limiting on sensitive AI generation endpoints.
**Learning:** `server.ts` exposes a POST endpoint `/api/oracle/synthesize` that calls the Google GenAI API. There is no rate limiting in place. A malicious actor could repeatedly call this endpoint, leading to exhaustion of the `GEMINI_API_KEY` quota, causing a Denial of Service (DoS) for legitimate users and potentially incurring costs.
**Prevention:** Always implement rate limiting on endpoints that consume external API quotas or perform expensive operations.
