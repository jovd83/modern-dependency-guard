---
name: modern-dependency-guard
description: Review, validate, and modernize technology choices before suggesting code that depends on external packages, frameworks, SDKs, CLIs, or hosted services. Use when Codex must choose a stack, sanity-check a requested dependency, replace deprecated tooling, explain safer modern alternatives, or scan a Node.js package manifest for outdated choices.
metadata:
  author: jovd83
  version: 1.0.0
  dispatcher-output-artifacts: dependency_review, modernization_recommendations, manifest_findings
  dispatcher-risk: low
  dispatcher-writes-files: false
  dispatcher-input-artifacts: package_manifest, dependency_request, repository_context, technology_constraints
  dispatcher-capabilities: dependency-review, stack-modernization, manifest-analysis
  dispatcher-stack-tags: analysis, dependencies, architecture
  dispatcher-accepted-intents: review_dependencies, modernize_dependency_choices, scan_package_manifest
  dispatcher-category: analysis
---
# Modern Dependency Guard

Choose modern, maintainable, appropriately scoped technology with evidence.

This skill is for dependency and tooling decisions, not for broad architecture invention. Use it to prevent stale recommendations, tighten stack choices, and explain why a recommendation is safer or more current.

## Operating Principles

- Prefer the simplest solution that satisfies the requirement.
- Prefer platform-native capabilities before adding dependencies.
- Do not reject a tool only because it is older or widely deployed.
- Distinguish clearly between:
  - **Deprecated**: upstream says not to use it for new work.
  - **Legacy-compatible**: acceptable in an existing codebase, but not the default choice for new work.
  - **Native-first**: built-in platform support is usually sufficient.
  - **Preferred**: a strong modern default when an external dependency is justified.
- Use primary evidence whenever maintenance status could have changed:
  - official package registries
  - official documentation
  - the source repository
- Match recommendation strength to evidence strength. If the evidence is incomplete, say so.

## Workflow

### 1. Frame the decision

Identify the actual job to be done before naming tools:

- runtime and version constraints
- framework or language already in use
- whether the task is greenfield or legacy maintenance
- non-functional requirements such as bundle size, performance, security, or edge compatibility

Do not replace a user-requested tool unless one of these is true:

- it is deprecated, archived, or clearly abandoned
- the platform now provides the capability natively
- the user asked for a recommendation rather than a strict implementation
- the requested tool creates a meaningful security, maintenance, or compatibility risk

### 2. Check the local reference catalog first

Read [references/stack-knowledge.md](references/stack-knowledge.md) before doing fresh research.

Use the catalog to:

- catch common obsolete tools quickly
- see whether a package is merely legacy-compatible versus truly deprecated
- identify likely modern alternatives

Treat the catalog as curated guidance, not as proof. If the status could have changed recently, verify it.

### 3. Prefer native capabilities when they are sufficient

Before recommending a dependency, check whether the platform already covers the use case.

Common examples:

- Node.js native `fetch`
- Node.js `fs/promises`
- browser `URL`, `URLSearchParams`, `Intl`, and Web Crypto APIs
- modern CSS layout and variables
- Python `pathlib` and `venv`

If native support is enough, recommend it unless the user has a concrete reason to add a package.

### 4. Validate candidates with primary evidence

Use the official registry or source repository for validation. Do not rely on memory alone.

#### npm packages

Use:

```bash
npm view <package-name> --json name version deprecated time repository homepage
```

Look for:

- explicit `deprecated` field
- recent release activity in `time`
- repository metadata that points to an active source repository

#### PyPI packages

Use the official JSON API:

```bash
curl -sL "https://pypi.org/pypi/<package-name>/json"
```

Look for:

- latest released version
- release history recency
- project URLs pointing to active documentation or source

#### Source repository

If a repository is known, validate that it is not archived and still appears maintained.

Example:

```bash
gh repo view <owner>/<repo> --json isArchived,updatedAt,url
```

### 5. Apply decision rules

Reject for new work when any of these is true:

- explicit deprecation notice
- repository archived
- package is end-of-life or replaced by the platform
- severe compatibility mismatch with the target runtime or framework

Flag as caution rather than hard reject when any of these is true:

- no stable release in the last 24 months, but still widely used
- mature legacy library with acceptable maintenance for existing systems
- evidence is incomplete or ambiguous

When a package is acceptable only for legacy work, say so explicitly.

### 6. Respond with a clear recommendation contract

When this skill materially changes the stack choice, structure the answer around:

1. **Recommendation**: what to use
2. **Why**: one or two concrete reasons
3. **Validation summary**: what evidence supports the recommendation
4. **Fallback or legacy path**: only if the user must stay on the older tool

Keep the recommendation short unless the user asked for a deeper comparison.

### 7. Use the local scanner when reviewing a Node.js project

If the task involves a Node.js repository with a `package.json`, you may run:

```bash
node scripts/check-stack.js <project-path>
```

Useful options:

```bash
node scripts/check-stack.js <project-path> --format json
node scripts/check-stack.js <project-path> --strict
node scripts/check-stack.js <project-path> --include optional,peer
```

Use the scanner as a fast signal, not as the final authority.

## Guardrails

- Do not force a rewrite from a stable legacy dependency unless the user asked for modernization or there is a meaningful risk.
- Do not describe a popular library as deprecated unless you verified it.
- Do not promote speculative or niche replacements without evidence of active maintenance.
- Do not confuse "not my preferred choice" with "unsafe" or "obsolete."
- Do not persist new catalog entries automatically just because a single task surfaced them.

## Memory Model

Use explicit memory boundaries.

### Runtime memory

Keep temporary reasoning, shortlist notes, and task-specific evidence in the current thread only.

### Project / skill memory

The curated file [references/stack-knowledge.md](references/stack-knowledge.md) is the skill-local memory for broadly reusable package guidance.

Only update it when all of the following are true:

- the guidance is likely to be reused
- the status is backed by primary evidence
- the note can be written concisely and neutrally

### Shared memory

If broader cross-agent reuse is needed, integrate with a separate shared-memory skill or platform capability. Do not embed cross-agent infrastructure into this skill.

### Promotion rules

- Runtime notes do not automatically become project memory.
- Project memory does not automatically become shared memory.
- Promote only stable, reusable, auditable information.

## Updating the Reference Catalog

When a genuinely reusable new finding emerges:

1. Verify it with primary evidence.
2. Add or update a concise row in [references/stack-knowledge.md](references/stack-knowledge.md).
3. Use neutral wording and include the reason for the recommendation.
4. Avoid churn for one-off ecosystem drama or unverified trends.

If the evidence is mixed, prefer adding a cautious note rather than a hard rule.

## Failure Modes and Fallbacks

- If maintenance status cannot be verified, say that verification is incomplete and avoid overconfident claims.
- If a user is locked into a deprecated dependency, help safely within that constraint and label the risk.
- If native support varies by runtime version, call out the version dependency.
- If modern alternatives are heavier than the user needs, recommend the smallest acceptable option.

## Gotchas

- **Native Version Drift**: Recommending a "native" replacement (e.g., Node.js `fetch` or Python `pathlib`) requires verifying the *target environment's* version. Platform-native features are often version-gated.
- **Transitive Maintenance Gap**: A "modern" top-level dependency may still rely on unmaintained or legacy transitive dependencies. Review the full dependency graph if the project has strict security or maintenance requirements.
- **False Positives on "Abandoned" Status**: Mature, feature-complete utility libraries (e.g., `mime`, `ms`, or small math utilities) may have no recent releases because they are stable, not because they are abandoned. Distinguish between "finished" and "dead."
- **Private Registry Blind Spots**: CLI tools like `npm view` or `gh repo view` may fail or return incomplete data if the target project uses a private registry or internal source control without configured credentials in the agent's environment.
- **"Modern" != "Efficient"**: Moving to a modern alternative (e.g., `date-fns` over `moment`) only improves performance if implemented correctly (e.g., using tree-shakeable imports). Blindly swapping packages without checking implementation can sometimes increase bundle size or decrease performance.
- **Lockfile Desync**: Running `npm view` or checking `package-json` alone doesn't account for what is actually installed in a `node_modules` folder or pinned in a lockfile. Always cross-reference with the project's lockfile when precise version auditing is required.


## Examples

### Example: native first in Node.js

User asks for `request` in a modern Node.js app.

Response shape:

- Recommend native `fetch`
- State that `request` is deprecated
- Mention that modern Node.js includes `fetch`
- Provide the implementation using `fetch`

### Example: legacy-compatible, not banned

User asks whether they should migrate an existing Express service.

Response shape:

- Do not call Express deprecated without verification
- Explain it is still viable for existing services
- Suggest Fastify or Hono only if the user is evaluating new work or specific performance or deployment goals
