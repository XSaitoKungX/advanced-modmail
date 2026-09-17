# Contributing

Thanks for considering a contribution to Relaya.

The project is intentionally process-driven because modmail software handles permissions, private conversations, and moderation workflows.

## Before starting

1. Search existing issues and discussions.
2. Open an issue for non-trivial work unless one already exists.
3. Agree on scope before investing in large architectural changes.
4. Read `AGENTS.md`, `ARCHITECTURE.md`, `DESIGN.md`, and `SECURITY.md`.

## Branch naming

Use:

```text
<type>/<issue>-<short-description>
```

Examples:

```text
feat/42-transcript-export
fix/73-duplicate-thread
security/91-oauth-state-validation
docs/105-self-hosting-guide
```

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `security`.

## Commits

Use Conventional Commit style where practical:

```text
feat(modmail): add thread close workflow
fix(auth): reject expired OAuth state
```

Commits inside a branch may evolve during development because pull requests are squash merged. The pull request title should therefore be suitable as the final squash commit title.

Commits must carry a verified signature (branch protection requirement). Configure GPG or SSH commit signing before pushing; an SSH signing key can be registered under GitHub Settings → SSH and GPG keys with key type "Signing Key".

## Pull requests

A pull request should:

- link the related issue,
- explain why the change is needed,
- describe verification/testing,
- disclose breaking changes,
- avoid unrelated formatting/refactors,
- update documentation where required,
- contain no secrets or real private user data.

Draft PRs are encouraged for early feedback on substantial changes.

## Testing and quality

Before requesting review, run all available project checks introduced by the implementation scaffold (formatting, linting, type checking, tests, build).

Bug fixes should include a regression test whenever feasible.

## Security changes

Security-sensitive changes should be narrowly scoped and clearly identified. Do not include exploit details in public discussions before a fix is available.

## Dependency changes

Explain why a new runtime dependency is needed. Dependency-only pull requests should avoid unrelated code changes.

## Documentation language

Project documentation and technical comments are written in English so the open-source project remains accessible internationally.

## Review

Maintainers may request changes for architecture, security, maintainability, test coverage, scope, or documentation. A review is not complete while unresolved review conversations remain.

## License

By contributing, you agree that your contribution is licensed under the repository's Apache License 2.0.
