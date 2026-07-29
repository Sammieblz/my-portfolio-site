# Contributing

## Setup

Use Node.js 24 and install the locked dependency graph:

```bash
npm ci
# PowerShell: Copy-Item .env.example .env
# macOS/Linux: cp .env.example .env
npm run dev
```

Do not commit `.env` files, provider tokens, generated build output, coverage, or browser
test artifacts.

## Changes

Keep portfolio facts in `src/lib/profile.js`, application metadata in
`src/lib/appRegistry.js`, and simulated files in `src/lib/filesystem.js`. Preserve
keyboard operation, focus visibility, reduced-motion support, and the semantic SSR
fallback.

Before opening a pull request, run:

```bash
npm run verify
npm run test:e2e
npm run audit
```

Add or update tests for behavior changes. A pull request should explain user-visible
impact, configuration changes, risk, and rollback.
