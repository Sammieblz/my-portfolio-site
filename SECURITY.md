# Security policy

## Reporting

Please report suspected vulnerabilities privately to
[samuelndubuisi32@gmail.com](mailto:samuelndubuisi32@gmail.com). Include the affected URL,
reproduction steps, impact, and any suggested mitigation. Do not include secrets or
personal data that are unrelated to the report.

Please avoid opening a public issue until the report has been reviewed.

## Supported version

The production deployment and the current `main` branch are supported. Older deployments
and forks are not maintained.

## Security controls

The app uses a restrictive Content Security Policy, anti-framing and MIME-sniffing
headers, server-only upstream credentials, same-origin contact delivery, validated API
inputs, bounded rate limiting, request timeouts, non-cacheable private responses, and
automated production-dependency audits. The service worker excludes API and document
requests. The terminal and filesystem are simulations and cannot execute system commands.

Hosting-level request controls should remain enabled because application rate limits are
best-effort and local to each serverless instance.
