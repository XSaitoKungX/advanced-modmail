# Backup and restore expectations

Relaya stores operator-owned data (guild configuration, modmail state,
transcripts metadata) in PostgreSQL. Operators self-hosting Relaya own
their backup story; this document defines the baseline expectations.

## What to back up

- The full `relaya` database (logical dump covers every table).
- `.env` secrets are configuration, not data - protect them separately
  and never mix them into database backups.

## Logical backups

Use `pg_dump` against the running instance:

```bash
pg_dump --format=custom --file=relaya-$(date +%F).dump "$DATABASE_URL"
```

Restore into a fresh database:

```bash
pg_restore --clean --if-exists --dbname="$DATABASE_URL" relaya-2026-09-18.dump
```

## Expectations

- Schedule dumps at a cadence matching acceptable data loss (daily is a
  reasonable default for a support bot).
- Keep at least one off-host copy; a dump on the same disk is not a backup.
- For larger or busier deployments, prefer WAL archiving / point-in-time
  recovery (managed Postgres offerings provide this out of the box).
- Verify restores periodically; an untested backup is not a backup.
- After a restore, run `pnpm db:migrate` if the dump predates the current
  schema version before starting the application.
- Transcript exports and message content are subject to the privacy rules
  in `SECURITY.md`; apply the same retention and access controls to dumps.
