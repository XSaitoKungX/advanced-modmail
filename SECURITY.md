# Security Policy

## Supported versions

Relaya is currently pre-release software. Until the first stable release, security fixes are applied to the active development line only.

A formal supported-version table will be introduced when stable releases exist.

## Reporting a vulnerability

Do not report exploitable vulnerabilities in a public GitHub issue.

While the repository is private, contact the maintainer directly through a private channel. When the repository becomes public, GitHub Private Vulnerability Reporting should be enabled when available and become the preferred reporting method.

Include, where possible:

- affected version/commit,
- impact,
- reproduction steps,
- proof of concept that avoids unnecessary real-user data,
- suggested mitigation if known.

Do not perform destructive testing against infrastructure you do not own or have permission to test.

## Security expectations

### Secrets

- Secrets must never be committed to Git.
- `.env` files containing real values are ignored.
- Example environment files must contain placeholders only.
- A leaked credential is rotated immediately; deleting the file is not sufficient.

### Discord credentials and permissions

- Bot tokens and OAuth secrets are high-value credentials.
- Request only intents and permissions required by enabled features.
- Privileged intents must be documented.
- Authorization checks must happen server-side/application-side, not only in UI visibility logic.

### Input validation

All external input must be validated before reaching domain operations, including:

- interaction options,
- modal input,
- message-derived commands/content,
- webhook/HTTP payloads,
- environment variables,
- guild configuration,
- imported/exported data.

### Data privacy

Modmail messages can contain personal or sensitive information.

Implementation must support explicit policies for:

- message persistence,
- transcript access,
- transcript retention,
- deletion/anonymization,
- audit logging,
- exported data.

Logs should avoid storing full conversation content by default.

### Multi-tenant isolation

A guild must never access another guild's modmail threads, settings, transcripts, or audit data. Tenant isolation is a security boundary and requires automated tests.

### Web/dashboard security

When a dashboard is introduced, minimum requirements include:

- secure Discord OAuth2 implementation,
- state/CSRF protection,
- secure cookie settings,
- server-side guild membership/permission checks,
- rate limiting on sensitive operations,
- secure headers,
- audit logging for privileged configuration changes.

### Dependencies

Dependencies are monitored with Dependabot. Security updates should be reviewed promptly, especially for Discord, HTTP, authentication, database, serialization, and cryptography-related packages.

## Disclosure process

The maintainer will attempt to validate reports, determine affected versions, prepare a fix, and coordinate disclosure proportional to the impact. No guaranteed response SLA is promised during the pre-release phase.
