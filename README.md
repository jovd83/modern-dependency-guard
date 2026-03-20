# Modern Dependency Guard

`modern-dependency-guard` is an Agent Skill for choosing current, well-supported dependencies without turning every request into a rewrite. It helps an agent validate packages, prefer native platform capabilities when appropriate, explain safer alternatives, and scan Node.js manifests for common outdated choices.

The repository is designed to be both:

- an installable skill for agent runtimes that support the Agent Skills format
- a maintainable GitHub repository with human-facing documentation, metadata, and basic validation artifacts

## What The Skill Is Responsible For

The skill itself is responsible for:

- dependency and tool selection guidance for agents
- a curated local reference catalog of common legacy or deprecated choices
- a lightweight Node.js scanner for `package.json` review
- consistent recommendation and fallback behavior

The skill is not responsible for:

- CVE scanning or SBOM generation
- organization-wide package policy enforcement
- automatic dependency upgrades across a codebase
- shared-memory infrastructure across multiple skills or agents

## Optional Integrations

This repository works best when the agent can access:

- official package registries such as npm and PyPI
- source hosting metadata such as GitHub repository status
- a separate shared-memory capability, if a team wants cross-agent promotion of durable findings

Those integrations are optional architectural boundaries, not embedded requirements of the skill.

## Out Of Scope For This Repository

The following are useful future directions, but they are intentionally not implemented here:

- multi-ecosystem CLI scanning beyond Node.js
- automated catalog synchronization from external feeds
- organization-specific approval workflows
- signed or centrally managed policy bundles

## Repository Layout

```text
.
|-- agents/
|   `-- openai.yaml
|-- references/
|   `-- stack-knowledge.md
|-- scripts/
|   `-- check-stack.js
|-- tests/
|   |-- check-stack.test.js
|   `-- fixtures/
|       |-- legacy-app/
|       |   `-- package.json
|       `-- modern-app/
|           `-- package.json
|-- CHANGELOG.md
|-- README.md
`-- SKILL.md
```

## Installation

Install the repository wherever your agent runtime expects local skills.

Typical locations include:

- `~/.agents/skills/`
- `~/.cursor/skills/`
- another local skills directory recognized by your tooling

If your skills runner supports GitHub-based installation, publish this repository first and then install it using that runner's repository syntax.

For consistency, keep the containing folder name aligned with the skill name:

```text
modern-dependency-guard/
```

## Usage

Explicit invocation example:

```text
Use $modern-dependency-guard to validate these dependencies for a new Node.js service: express, request, moment, and node-sass.
```

Node.js manifest scan:

```bash
node scripts/check-stack.js /path/to/project
node scripts/check-stack.js /path/to/project --format json
node scripts/check-stack.js /path/to/project --strict
```

## Decision Model

The skill distinguishes between several statuses instead of treating every older tool as forbidden:

- `Deprecated`: do not recommend for new work
- `Legacy-compatible`: acceptable in an existing system, but not the default choice for a new build
- `Native-first`: prefer the platform before adding a package
- `Preferred`: strong current default when an external tool is justified

That distinction is important. Enterprise users often need pragmatic modernization, not purity tests.

## Memory Model

The skill uses an explicit, scoped memory approach:

- Runtime memory: task-local working notes and evidence collected during the current request
- Project / skill memory: the curated local catalog in [references/stack-knowledge.md](references/stack-knowledge.md)
- Shared memory: optional external infrastructure, intentionally kept outside this repository

Promotion is deliberate. Runtime findings do not automatically become persistent catalog entries.

## Validation

Validate the skill metadata:

```bash
python C:/Users/jochi/.codex/skills/.system/skill-creator/scripts/quick_validate.py .
```

Run the scanner tests:

```bash
node --test tests/check-stack.test.js
```

## Contributing

Contributions should improve correctness, not just opinion. Good changes usually include at least one of:

- clearer evidence rules in `SKILL.md`
- a better-curated entry in [references/stack-knowledge.md](references/stack-knowledge.md)
- a new deterministic scanner rule in [scripts/check-stack.js](scripts/check-stack.js)
- a test case proving the change

When updating the reference catalog, prefer neutral language and primary evidence over trend-driven claims.
