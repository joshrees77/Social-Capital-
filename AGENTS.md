# AGENTS.md

## Workflow
- Follow a strict loop: **PLAN → IMPLEMENT → TEST → SUMMARIZE**.

## Small Diffs
- Keep diffs small and incremental.
- Avoid large refactors unless explicitly required.

## Tests
- Run tests when code changes could affect behavior or when adding new functionality.
- If tests are not run, document why in the final summary.

## Error Handling
- If errors occur, stop and report the exact error output.
- Do not proceed with additional changes until errors are addressed.

## Architecture Changes
- Any new architecture decision must be reflected in `SPEC.md`.
