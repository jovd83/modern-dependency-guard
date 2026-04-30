# Changelog

All notable changes to this repository are documented here.

## [1.1.1] - 2026-04-30

### Changed
- Trim `SKILL.md` frontmatter to fit the 1000-character dispatcher limit (description trim, migrate non-dispatcher fields to body).

## [1.0.0] - 2026-03-19

### Changed
- Renamed the skill and repository identity from `modern-stack-enforcer` to `modern-dependency-guard`.
- Rewrote `SKILL.md` around a tighter decision contract with clearer scope, evidence rules, response expectations, guardrails, and memory boundaries.
- Reframed the skill from "always replace old things" to "make evidence-based modernization decisions."
- Rebuilt the reference catalog with a status model that distinguishes deprecated tools from legacy-compatible ones.
- Replaced the minimal helper script with a reusable CLI that supports text and JSON output, strict mode, path targeting, and scoped dependency scanning.
- Reworked the README to separate skill responsibilities, optional integrations, and intentionally out-of-scope future ideas.

### Added
- `agents/openai.yaml` metadata for UI-friendly skill discovery.
- Node.js tests and fixtures for the dependency scanner.
- A clearer validation story for maintainers.

### Fixed
- Removed non-standard YAML frontmatter fields from `SKILL.md`.
- Eliminated unsafe "self-updating memory" wording that lacked evidence and quality gates.
- Tightened repository packaging so the skill is easier to install, audit, and maintain.
