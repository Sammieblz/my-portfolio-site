# Observability and operations

The portfolio exposes `GET /api/health` as a non-cacheable health check. A successful
response includes the service name, application version, deployment commit when Vercel
provides it, and a current timestamp.

## Production monitoring

- Configure an external uptime monitor to request `/api/health` every five minutes.
- Alert after two consecutive failures and again when the endpoint recovers.
- Keep Vercel function logs enabled for the contact, projects, and weather routes.
- Search logs by the error ID returned with an unexpected server error.
- Monitor contact-provider delivery separately in Formspree.
- Review scheduled CI results for Firefox, WebKit, maintained links, dependency updates,
  and production dependency audits.

The app intentionally has no visitor analytics or session replay. Add either only after
updating the privacy notice, Content Security Policy, consent behavior where required,
and the release checklist.

## Incident response

1. Confirm the health endpoint and affected public route from a separate network.
2. Check the current Vercel deployment and function logs.
3. Roll back to the previous successful deployment if the regression blocks portfolio
   access, résumé access, or contact delivery.
4. Preserve the failing deployment URL, commit, timestamps, and error IDs.
5. Reproduce locally, add a regression test, and redeploy through the normal CI gate.
