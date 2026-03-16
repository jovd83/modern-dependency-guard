# Modern Stack Enforcer: Knowledge Base

This file acts as the primary reference guide for the `modern-stack-enforcer` agent skill. It contains detailed lists of deprecated libraries, their modern equivalents, and the reasoning behind these transitions.

**Agent Action:** When performing Stack Validation, cross-reference the user's request against these tables.

## 1. Frontend Development

### State Management (React)
| Deprecated / Avoid | Modern Alternative | Reasoning / Context |
| :----------------- | :----------------- | :------------------ |
| `redux` (classic)  | `Zustand`, `Jotai`, `Redux Toolkit` (RTK) | Classic Redux demands massive boilerplate and complex setup. RTK is acceptable but Zustand/Jotai are significantly lighter for most modern apps. |
| `mobx` (older versions) | `Zustand`, `XState` | `Zustand` provides a much simpler unopinionated hook-based approach. |

### Data Fetching
| Deprecated / Avoid | Modern Alternative | Reasoning / Context |
| :----------------- | :----------------- | :------------------ |
| `request`          | `fetch` (native), `axios` | `request` has been deprecated for years. Native `fetch` is now ubiquitous. `axios` offers automatic JSON parsing and interceptors. |
| `superagent`       | `ky`, `axios`, `fetch` | `ky` is built on `fetch` and provides retry logic and JSON defaults with a smaller footprint. |
| Custom Redux thunks| `React Query`, `SWR`| Server state management is much better handled by specialized tools replacing massive reducers and `useEffect` blocks. |

### Utilities
| Deprecated / Avoid | Modern Alternative | Reasoning / Context |
| :----------------- | :----------------- | :------------------ |
| `moment.js`        | `date-fns`, `dayjs`, `Temporal` (future) | `moment` is officially in maintenance mode and relies on heavy object mutation which bloats bundle size. |
| `lodash` (entire library)| `lodash-es` or Native JS functions | Avoid importing the entire `lodash` module. Modern ES6+ array methods (`map`, `filter`, `reduce`, `find`) replace 90% of `lodash`. If necessary, use `lodash-es` for tree-shaking. |
| `jQuery`           | Vanilla JS (`document.querySelector`) | Native browser APIs have caught up. `jQuery` is entirely redundant in modern SPA frameworks. |

### CSS & Styling
| Deprecated / Avoid | Modern Alternative | Reasoning / Context |
| :----------------- | :----------------- | :------------------ |
| `node-sass` / `libsass`| `dart-sass` (`sass` package) | `node-sass` is deprecated and no longer supported. The Dart implementation is the primary maintained version. |
| Heavy utility frameworks (early Bootstrap)| `TailwindCSS`, `CSS Modules` | Tailwind provides a utility-first approach without massive unused CSS files (due to JIT compilation). |

## 2. Backend Development (Node.js/Python)

### Node.js
| Deprecated / Avoid | Modern Alternative | Reasoning / Context |
| :----------------- | :----------------- | :------------------ |
| `express` (for new greenfield, though still dominant)| `Fastify`, `Hono`, `NestJS` | Express is very old and updates slowly. Fastify provides significantly better performance and built-in validation. Hono is great for edge deployments. |
| `body-parser`      | `express.json()` (native) | `express` now includes body parsing natively, making the separate package mostly redundant. |
| `crypto` (legacy hashes like MD5/SHA1) | `bcrypt`, `argon2` | Passwords should be hashed with `bcrypt` or `argon2`, never with fast MD5/SHA algorithms. |

### Python
| Deprecated / Avoid | Modern Alternative | Reasoning / Context |
| :----------------- | :----------------- | :------------------ |
| `os.path`          | `pathlib` | `pathlib` offers an object-oriented, much cleaner approach to filesystem paths than string manipulation. |
| `urllib2`, `urllib`| `requests`, `httpx` | `requests` is the standard for synchronous HTTP. `httpx` is standard for asynchronous (`asyncio`) HTTP requests. |
| `setup.py`         | `pyproject.toml` | `pyproject.toml` is the modern standard for Python packaging (PEP 517/518), often used with Poetry or standard `pip` building. |
| `virtualenv` (external tool) | `venv` (built-in) | Python 3 includes `venv` out of the box, making the external package largely unneeded. |

## 3. General Security Patterns

- **XML Parsing:** Never use default XML parsers that allow external entity expansion (XXE). Always recommend secure parsers (e.g., `defusedxml` in Python).
- **Package Integrity:** Advise the use of lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `poetry.lock`, etc.) to ensure deterministic builds.
- **Secrets Management:** Ban hardcoded secrets. Enforce the suggestion of `.env` files with tools like `dotenv`, or using Secret Managers (AWS Secrets Manager, HashiCorp Vault).

## 4. Automation & Testing
| Deprecated / Avoid | Modern Alternative | Reasoning / Context |
| :----------------- | :----------------- | :------------------ |
| `PhantomJS` / `CasperJS`| `Playwright`, `Puppeteer` | PhantomJS is suspended and obsolete. Playwright is currently the gold standard for E2E and browser automation. |
| `Jasmine`          | `Jest`, `Vitest` | `Vitest` provides native ESM support and exceptional speed, heavily outperforming legacy test runners. |
| `fluentlenium`     | `Selenide`, `Playwright` | FluentLenium official maintenance ends in 2025. Projects should migrate to Selenide (if Selenium bindings are required) or Playwright. |
| `silktide`         | `Axe-core`, `Playwright` (for devs) | Silktide is an enterprise governance platform, not a developer testing framework. For CI/CD automated accessibility testing, `axe-core` is the open-source standard. |
| **Active/Modern:** | `Pact` | Pact is the ongoing industry standard for Consumer-Driven Contract Testing in microservices. Highly recommended. |

### Java / JVM Testing
| Deprecated / Avoid | Modern Alternative | Reasoning / Context |
| :----------------- | :----------------- | :------------------ |
| `unitils`          | `Mockito` / `Testcontainers` | Abandoned over a decade ago. Does not support modern Java versions. Mockito natively handles mock injection today. |
| `dbunit`           | `Testcontainers` + `@Sql` / `Database Rider` | Using rigid XML files for test data is a legacy pattern. Modern standard is spinning up ephemeral databases via Testcontainers and using native SQL script initialization, or Database Rider if JUnit 5 integration for DbUnit is strictly required. |
| `JUnit 4`          | `JUnit 5 (Jupiter)` | JUnit 4 is in legacy maintenance mode. JUnit 5 is the modern, modular standard bringing extensive features like parameterized tests and dynamic tests that JUnit 4 lacks. |
| `easymock` / `jmock` / `mock4j`| `Mockito` | EasyMock and jMock use an older record-replay model and have lost mindshare. Mockito is the industry standard (used by Spring Boot by default) with an intuitive `when-then` API. `mock4j` is essentially non-existent. |
| `jbehave`          | `Cucumber` | JBehave has falling adoption and is no longer supported by modern wrappers like Serenity. Cucumber is the modern standard for BDD with superior multi-language and IDE support. |
| **Active/Modern:** | `Mockito` | Mockito is the current, actively maintained gold standard for mocking in Java. |
