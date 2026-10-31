# AI Skill Forge 2.0 — Data Safety and Migration Policy

## Non-negotiable rule

Existing MongoDB data must be preserved. Do not drop collections, delete documents, reset progress, reseed over existing records, or replace the legacy single-learner record.

## Known legacy data structures

The audit identified an `EngineerJourney` document keyed by the legacy `single-learner` value. It contains multiple generations of learning data, including:
- day-based learning records;
- lessons and custom courses/lessons;
- module tests and projects;
- AI roadmap topic progress, stage completion, quiz answers/scores, notes, and drafts.

Other identified collections include generated roadmap lessons and coding workspaces. A complete model/collection inventory is required before any migration.

## Required backup procedure

Before a schema or data migration:
1. Confirm the target MongoDB cluster and database name using the deployment's secret configuration (do not print credentials).
2. Take a timestamped database backup using an approved Atlas backup or `mongodump` process.
3. Record backup metadata, cluster/database identity, collection list, and document counts.
4. Verify the backup can be read or restored into an isolated non-production database.
5. Record restore steps and the responsible operator.
6. Do not run the migration if backup verification fails.

## Migration rules

- Prefer additive fields and new collections.
- Preserve existing `_id`, topic IDs, timestamps, and legacy fields.
- Do not change the unique `EngineerJourney.key` or the legacy key as part of routine feature work.
- Do not rewrite all generated lessons merely to normalize content.
- Any future multi-user migration requires a separate approved design and explicit data ownership mapping. It is out of scope for the current personal-only release.
- Migrations must support dry-run mode and produce before/after counts.
- A migration must be idempotent and have a documented rollback plan.
- Never log secrets, passwords, session tokens, or full private user content unnecessarily.

## Test requirements

- Verify legacy records load before and after the change.
- Verify existing topic progress, quiz scores, drafts, projects, and day records remain unchanged.
- Verify a new feature does not overwrite unrelated legacy fields.
- Test on a sanitized database copy first.
- Compare collection/document counts and selected checksums or stable field snapshots.

## Release gate

No production database write, migration, merge, or deployment is permitted until backup verification, migration tests, regression tests, and explicit owner approval are complete.
