# Google Search Console for salmanasif.pro

DNS verification is already done. Do not add a `google-site-verification` meta tag.

## Submit the sitemap

1. Open [Google Search Console](https://search.google.com/search-console) and select the `salmanasif.pro` domain property.
2. Go to **Indexing → Sitemaps**.
3. Submit:

```
https://www.salmanasif.pro/sitemap.xml
```

4. Success means Google discovered the URL list. "Couldn't fetch" means the sitemap returned an error; it should stay HTTP 200 after this change.

## Request indexing

1. Open **URL Inspection**.
2. Inspect `https://www.salmanasif.pro/` and choose **Request indexing**.
3. Repeat for `/about`, `/cv`, and the main work/writing URLs. Daily quota is limited.

## What to expect

- First indexation often takes 1–14 days. Rankings take longer.
- Confirm with `site:salmanasif.pro`.
- WhatsApp / LinkedIn / iMessage previews use `og:image` (`/og.jpg`).
- Google Search's understanding of the person uses JSON-LD `Person.image` (`/portrait.jpg`).

The Indexing API does not apply to this portfolio. It is only for JobPosting and livestream content.
