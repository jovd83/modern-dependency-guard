# Modern Stack Knowledge Catalog

Curated guidance for common dependency and tooling decisions used by `modern-dependency-guard`.

This file is skill-local memory, not a replacement for fresh validation. Use it to accelerate common decisions, then verify anything that could have changed recently.

## Status Legend

- `Deprecated`: upstream has deprecated, archived, or effectively retired the tool for new work.
- `Legacy-compatible`: still viable in existing systems, but not the default recommendation for a new project.
- `Native-first`: prefer built-in platform support unless a package adds clear value.
- `Preferred`: strong current default when an external dependency is justified.

## Frontend And Web

| Area | Package / Pattern | Status | Prefer | Why | Notes |
| :--- | :---------------- | :----- | :----- | :-- | :---- |
| HTTP | `request` | Deprecated | Native `fetch`, `axios`, `ky` | Upstream deprecated; modern runtimes now provide `fetch`. | Use `axios` or `ky` only when the project benefits from their ergonomics or middleware. |
| State management | `redux` with hand-written boilerplate reducers and thunks | Legacy-compatible | Redux Toolkit, Zustand, Jotai | Classic Redux works, but greenfield apps rarely need the boilerplate anymore. | Do not force a migration if Redux is already well-factored. |
| Utility library | `lodash` imported as the full package | Native-first | Native JavaScript, targeted imports, `lodash-es` | Modern JavaScript covers many historical lodash use cases. | The problem is overuse, not the existence of lodash itself. |
| Date handling | `moment` / `moment-timezone` | Legacy-compatible | `date-fns`, Luxon, Day.js, platform `Intl`, future `Temporal` | Moment is in maintenance mode and is large for modern bundles. | Acceptable for legacy systems that already depend on it. |
| DOM helpers | `jquery` in new SPA or modern browser code | Legacy-compatible | Native DOM APIs or framework idioms | Most historical jQuery value is now provided by browsers and frameworks. | Still common in legacy apps and CMS ecosystems. |
| React testing | `enzyme` | Deprecated | React Testing Library | Enzyme has not kept pace with modern React. | Avoid for new React 18+ work. |
| Browser automation | `phantomjs`, `phantomjs-prebuilt`, `casperjs` | Deprecated | Playwright, Puppeteer | PhantomJS is obsolete and no longer a credible default. | Prefer Playwright unless the use case is Chrome-only automation. |
| Angular E2E | `protractor` | Deprecated | Playwright, Cypress, WebdriverIO | Protractor reached end-of-life. | Use only for short-lived maintenance. |
| Test runner | `karma` as a new default | Legacy-compatible | Vitest, Jest, Web Test Runner | Karma still exists, but newer tooling is usually faster and simpler. | Keep it when framework constraints justify it. |
| Linting | `tslint` | Deprecated | ESLint with `typescript-eslint` | TSLint has been retired. | Migrate rather than extend. |
| Babel lint parser | `babel-eslint` | Deprecated | `@babel/eslint-parser` | Replaced by the official parser package. | Treat as a straightforward modernization. |
| Styling | `node-sass`, `libsass` | Deprecated | `sass` | Dart Sass is the maintained Sass implementation. | Prefer the `sass` npm package. |

## Backend And Services

| Area | Package / Pattern | Status | Prefer | Why | Notes |
| :--- | :---------------- | :----- | :----- | :-- | :---- |
| Node.js HTTP server | `express` for existing systems | Legacy-compatible | Keep when already in use; consider Fastify or Hono for new services with clear needs | Express is still viable, but not always the sharpest greenfield default. | Do not call Express deprecated. |
| Express middleware | `body-parser` in modern Express apps | Native-first | `express.json()` / `express.urlencoded()` | Most common body parsing now ships with Express itself. | Validate actual middleware needs before removing. |
| Password hashing | fast hashes such as raw `md5`, `sha1`, `sha256` for password storage | Deprecated | `argon2`, `bcrypt`, scrypt-based platform support | Fast hashes are unsuitable for password storage. | This is a security rule, not a stylistic preference. |
| Node.js HTTP client | heavy request libraries for simple JSON calls | Native-first | Native `fetch` | Modern Node.js includes `fetch`. | Add a library only for real ergonomic or platform reasons. |

## Python

| Area | Package / Pattern | Status | Prefer | Why | Notes |
| :--- | :---------------- | :----- | :----- | :-- | :---- |
| Paths | `os.path` for new code | Legacy-compatible | `pathlib` | `pathlib` is clearer and easier to compose. | `os.path` is still valid in old modules. |
| HTTP client | `urllib`, `urllib2` as the default recommendation | Legacy-compatible | `requests`, `httpx` | Higher-level clients are more ergonomic for most app code. | `httpx` is the better async-first choice. |
| Packaging | `setup.py` as the primary packaging interface | Legacy-compatible | `pyproject.toml` | Modern Python packaging centers on `pyproject.toml`. | Existing projects may still need `setup.py` shims. |
| Environments | external `virtualenv` as the first recommendation for Python 3 | Native-first | `venv` | Built-in environment management is often enough. | Use external tooling only when it solves a real workflow need. |

## Testing And Quality

| Area | Package / Pattern | Status | Prefer | Why | Notes |
| :--- | :---------------- | :----- | :----- | :-- | :---- |
| Java mocking | `powermock` | Deprecated | Mockito inline support | PowerMock has aged poorly with modern JDKs. | Prefer refactoring or built-in Mockito capabilities. |
| Java testing | `junit4` as a new project default | Legacy-compatible | JUnit 5 | JUnit 5 is the modern baseline. | Do not demand migration if JUnit 4 is stable and the project is constrained. |
| Contract testing | Pact | Preferred | Pact | Actively used modern default for consumer-driven contract testing. | Use when contract testing is actually part of the architecture. |

## Security And Operational Guidance

- Prefer lockfiles for reproducible dependency resolution.
- Treat hardcoded secrets as a defect; prefer environment configuration or a secrets manager.
- Prefer secure XML parsing libraries when untrusted XML is involved.
- When a package is widely adopted but quiet, describe the evidence neutrally instead of calling it abandoned.

## Catalog Maintenance Rules

- Add entries only when the guidance is likely to be reused.
- Prefer concise rows over narrative essays.
- Use neutral language and avoid hype.
- If a recommendation is ecosystem-dependent, reflect that in the notes instead of creating a false universal rule.
