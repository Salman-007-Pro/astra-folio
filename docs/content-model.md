# Content and publishing

Start the CMS separately on port 3001. The public Astro site has no admin link. Create the first admin through Payload's first-user flow. All subsequent writes require an authenticated admin. Media accepts raster images and PDFs, capped at 10 MB; SVG/HTML uploads are excluded.

Collections: Projects, Experience, Skills, Blog Posts, Experiments, Media, Users. Globals: Site Settings, Profile, Resume Settings. Editorial collections and globals use versions and drafts. Public collection reads filter to published records. `/api/portfolio` returns only validated public fields, never auth records or tokens.

Publishing a collection/global can notify `BUILD_WEBHOOK_URL` with an HMAC-SHA256 signature of `timestamp + '.' + rawBody`. Configure a trusted receiver that checks the signature and timestamp (five-minute maximum age), deduplicates delivery, and starts the existing CI build. The repository provides the verifier as a pure function for an external receiver; no unsigned public deploy endpoint exists. A failed build leaves the previous deployment untouched.

Resume Settings points to a PDF media record with a version date, public filename and download toggle. Upload and publish a replacement to update the runtime CV endpoint. Configure CMS CORS to the actual public origin. Browser PDF viewers vary; a direct link and semantic summary are always available.

The optional bootstrap command refuses non-empty project/experience/blog collections. It creates case studies and experience from the owner-provided CV, leaves engineering articles as CMS drafts, and does not silently upload a CV. Upload the owner-approved PDF in Media and select it in Resume Settings.

## Preview policy

Use Payload versions/drafts in admin for editorial review. A private frontend build can be generated from a reviewed snapshot. An authenticated, time-limited visual frontend preview endpoint is not implemented; do not expose drafts via the public snapshot endpoint.
