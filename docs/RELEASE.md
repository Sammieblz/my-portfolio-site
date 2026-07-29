# Production release checklist

## Before deployment

- [ ] Review the diff for accidental secrets and unrelated generated files.
- [ ] Confirm Node 24 is selected and run `npm ci`.
- [ ] Run `npm run verify`, `npm run test:e2e`, and `npm run audit`.
- [ ] Run `npm run links:check` and review any redirect destinations.
- [ ] Verify the stable résumé URL, profile image, social card, contact address, project
      links, canonical URLs, manifest, and sitemap.
- [ ] Confirm production environment variables use the names in `.env.example`.
- [ ] Confirm the Formspree endpoint is active by submitting a non-sensitive test message.
- [ ] Check the browser console at desktop and mobile widths.
- [ ] Check keyboard-only window, menu, tab, modal, terminal, and game interactions.
- [ ] Confirm the current content review date in `src/lib/profile.js`.

## After deployment

- [ ] Verify `/api/health` returns HTTP 200 with `status: "ok"` and the expected
      deployment commit.
- [ ] Verify `/`, `/about`, `/projects`, `/resume`, and `/contact` load directly and with
      browser back and forward navigation.
- [ ] Open all applications on desktop and mobile.
- [ ] Verify `/api/projects` and `/api/weather` return live or clearly labeled stale data.
- [ ] Verify the résumé opens and downloads.
- [ ] Submit one contact-form smoke test.
- [ ] Install the PWA, then verify a previously visited public route while offline.
- [ ] Check the CSP and security headers in the deployed response.
- [ ] Run Lighthouse against the production URL and retain the report with the release.
- [ ] Review Vercel function logs for server error IDs.
- [ ] Confirm the uptime monitor is polling `/api/health`.

## Rollback

Keep the previous successful Vercel deployment available until smoke testing completes.
If a blocking regression appears, promote that deployment immediately, then preserve the
failed deployment URL and matching commit for diagnosis.
