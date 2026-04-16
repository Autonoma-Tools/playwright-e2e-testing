# Playwright E2E Testing: The Complete Guide from Setup to CI/CD

Companion code for the Autonoma blog post 'Playwright E2E Testing: The Complete Guide from Setup to CI/CD'.

> Companion code for the Autonoma blog post: **[Playwright E2E Testing: The Complete Guide from Setup to CI/CD](https://getautonoma.com/blog/playwright-e2e-testing)**

## Requirements

Node.js 18+, npm, and a local instance of the app under test running on http://localhost:3000 (or set `DEPLOYMENT_URL` to point at a deployed preview). The GitHub Actions workflows assume a GitHub repository with either Vercel deployments (for `preview-test.yml`) or a static URL (for `playwright.yml`).

## Quickstart

```bash
git clone https://github.com/Autonoma-Tools/playwright-e2e-testing.git
cd playwright-e2e-testing
npm install
npx playwright install
# start your app on http://localhost:3000, then:
npx playwright test
```

Other useful commands while developing:

- `npx playwright test --ui` — interactive UI mode (recommended while authoring tests).
- `npx playwright test --debug` — step through a single test with Playwright Inspector.
- `npx playwright show-report` — open the HTML report from the most recent run.
- `DEPLOYMENT_URL=https://preview.example.com npx playwright test` — run against a deployed preview instead of localhost.

## Project structure

```
.
├── .github/
│   └── workflows/
│       ├── playwright.yml          # sharded CI run on push/PR
│       └── preview-test.yml        # run against Vercel preview URL
├── fixtures/
│   └── authenticatedUser.ts        # custom Playwright fixtures
├── pages/
│   └── LoginPage.ts                # Page Object Model example
├── scripts/
│   └── init.sh                     # bootstrap a fresh Playwright project
├── tests/
│   ├── api-mocking.spec.ts         # page.route() interception examples
│   ├── cart.spec.ts                # uses fixtures/authenticatedUser.ts
│   ├── homepage.spec.ts            # your first test
│   ├── login-pom.spec.ts           # same as login.spec.ts via the POM
│   ├── login.spec.ts               # form test (happy + error paths)
│   └── preview-url.spec.ts         # baseURL patterns for preview deploys
├── playwright.config.ts            # reporters, retries, projects, baseURL
├── package.json
├── LICENSE
└── README.md
```

- `tests/` — spec files Playwright picks up automatically (configured via `testDir`).
- `pages/` — Page Object Models that wrap selectors and flows for reuse.
- `fixtures/` — custom `test.extend` fixtures that encapsulate setup/teardown.
- `scripts/` — one-shot helpers (repo bootstrap, etc.).
- `.github/workflows/` — CI pipelines: sharded PR runs and preview-deploy runs.

## About

This repository is maintained by [Autonoma](https://getautonoma.com) as reference material for the linked blog post. Autonoma builds autonomous AI agents that plan, execute, and maintain end-to-end tests directly from your codebase.

If something here is wrong, out of date, or unclear, please [open an issue](https://github.com/Autonoma-Tools/playwright-e2e-testing/issues/new).

## License

Released under the [MIT License](./LICENSE) © 2026 Autonoma Labs.
