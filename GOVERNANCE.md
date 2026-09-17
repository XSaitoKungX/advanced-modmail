# Governance

## Current model

Advanced Modmail currently uses a maintainer-led governance model.

Primary maintainer:

- `@XSaitoKungX`

The maintainer is responsible for repository administration, release decisions, security coordination, roadmap direction, and final architectural decisions.

## Decision making

Routine changes are decided through issues and pull-request review.

Material architectural changes should include:

- the problem being solved,
- alternatives considered,
- security/operations implications,
- migration/compatibility impact.

As the project grows, significant decisions may be recorded as ADRs under `docs/adr/`.

## Maintainers

Additional maintainers may be added based on sustained contribution quality, project understanding, security awareness, review participation, and reliability.

Repository permissions should follow least privilege.

## Releases

Releases follow Semantic Versioning once versioned releases begin.

Before `1.0.0`, APIs and configuration may change more frequently. Breaking changes must still be documented.

Release artifacts and tags should eventually be produced by CI rather than from developer workstations.

## Security

Security disclosure and remediation follow `SECURITY.md`. Security issues may be handled privately until coordinated disclosure is appropriate.

## Changes to governance

Governance changes require a dedicated issue and pull request so that process changes remain reviewable and auditable.
