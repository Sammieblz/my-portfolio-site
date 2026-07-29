# Samuel Ndubuisi | Developer Portfolio

An accessible, OS-inspired portfolio built with SvelteKit. Desktop visitors get a
keyboard-accessible window manager; mobile visitors get a touch-friendly application
launcher. The initial response still contains crawlable portfolio content before the
interactive shell mounts. Recruiters land on a focused profile, selected case studies,
and direct resume and contact actions before exploring the OS interface.

Live site: [sndubuisi.vercel.app](https://sndubuisi.vercel.app)

## Applications

- Terminal with quoted-argument parsing, bounded history, and a safe simulated filesystem
- File Manager backed by the same filesystem as the terminal
- Curated case studies with problem, role, solution, outcomes, evidence, and shareable URLs
- GitHub Projects loaded through a cached server endpoint with a curated offline fallback
- Résumé viewer with direct open and download options
- About, contact, current weather, world clock, and memory game applications
- Desktop window dragging, resizing, minimizing, maximizing, focus management, and taskbar
- Mobile launcher with persistent application state and a functional recent-apps switcher
- OS-style notification pop-ups with unread history on desktop and mobile
- Installable PWA shell with offline access to the main portfolio routes

The terminal is intentionally a portfolio simulation. It never executes host or server
commands.

## Technology

- Svelte 5 and SvelteKit 2
- Vite 7 and Tailwind CSS 3
- Vercel adapter and server routes
- Vitest with coverage thresholds
- Playwright on desktop and mobile Chromium, plus scheduled Firefox and WebKit coverage
- axe-core automated accessibility checks
- ESLint, Prettier, and `svelte-check`

Runtime fonts and icons are bundled locally. The app has no analytics or third-party
scripts.

## Local development

Requirements:

- Node.js 24
- npm 11 or newer

```bash
npm ci
# PowerShell: Copy-Item .env.example .env
# macOS/Linux: cp .env.example .env
npm run dev
```

The site is available at `http://localhost:5173`.

Environment variables are optional:

| Variable              | Visibility  | Purpose                                                   |
| --------------------- | ----------- | --------------------------------------------------------- |
| `OPENWEATHER_API_KEY` | Server only | Prefer OpenWeatherMap; Open-Meteo is the keyless fallback |
| `GITHUB_TOKEN`        | Server only | Increase the GitHub API rate limit                        |
| `FORMSPREE_ENDPOINT`  | Server only | Contact form delivery destination                         |

Do not prefix these variables with `PUBLIC_`. See [.env.example](.env.example).

## Public routes

- `/` recruiter-first portfolio home
- `/about` professional experience, education, and skills
- `/projects` curated case studies and live GitHub repositories
- `/projects?project=aitt` shareable case-study state
- `/resume` current résumé with a stable download URL
- `/contact` same-origin, validated contact workflow

## Quality gates

```bash
npm run check          # Svelte compiler and diagnostics
npm run lint           # Formatting and ESLint
npm run test:coverage  # Unit/API tests and enforced coverage
npm run test:e2e       # Desktop/mobile browser and accessibility tests
npm run build          # Production Vercel build
npm run budget         # Enforced client bundle size limits
npm run links:check    # Maintained project and profile links
npm run audit          # Production dependency vulnerability gate
```

`npm run verify` runs every local release gate except browser tests and the dependency
audit. CI runs both of those separately.

## Architecture

- `src/lib/appRegistry.js` is the canonical application metadata registry.
- `src/lib/filesystem.js` is the canonical simulated filesystem.
- `src/lib/windowManager.js` contains pure bounds and window-ID logic.
- `src/lib/profile.js` is the canonical portfolio content and asset configuration.
- `src/lib/notifications.js` owns pop-up timing, deduplication, unread state, and history.
- `src/lib/routeState.js` owns application deep links and browser-history state.
- `src/lib/systemStatus.js` reference-counts browser listeners and polling.
- `src/routes/api/contact`, `src/routes/api/projects`, and `src/routes/api/weather`
  validate, rate-limit, normalize, cache where appropriate, and time-limit upstream calls.
- `src/components/PortfolioIntro.svelte` is the semantic SSR and no-JavaScript experience.
- `src/service-worker.js` caches the app shell and public routes while excluding private
  API responses and résumé documents.

Security headers and the Content Security Policy are configured in `src/hooks.server.js`,
`svelte.config.js`, and `vercel.json`.

## Deployment

The repository targets Vercel with `@sveltejs/adapter-vercel`.

1. Import the repository into Vercel.
2. Configure any desired environment variables from `.env.example`.
3. Use `npm run build` as the build command.
4. After deployment, verify `/api/health` and follow
   [the release checklist](docs/RELEASE.md).

Every deployment should come from a commit that passed CI. See [PRIVACY.md](PRIVACY.md),
[SECURITY.md](SECURITY.md), [observability guidance](docs/OBSERVABILITY.md), and
[CONTRIBUTING.md](CONTRIBUTING.md) for operating guidance.

## License

[MIT](LICENSE) © 2026 Samuel Ndubuisi.
