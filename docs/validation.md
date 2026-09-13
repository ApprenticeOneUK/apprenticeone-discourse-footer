# Validation

This is a requested structural redesign, not a regression caused by an upstream
upgrade. The old template has branding and bottom-row link/social regions and the
resource connector appends its section after native sections. The new contract
puts a dedicated resource slot between two configurable navigation sections.

Run the repository's pinned GitHub workflow for focused checks. CSS layout is
tested with a synthetic three-column fixture at 320, 375, 700, 701, 1024 and 1440
pixels in both colour schemes. Resource logic tests run the actual component class
with framework services stubbed; migration tests execute migration 0005. Neither
class harnesses nor HTML fixtures constitute a full Discourse integration test.

The CSS repository carries four reviewed synthetic images and hash provenance in
`docs/images/three-column-footer`. They are not production screenshots or approved
pixel baselines. Four resources are a fixture setting; runtime defaults remain 3.

Staging is not configured in maintenance inventory. Full Discourse rendering,
anonymous/member permission behaviour, component enable/disable switching, login
visibility and welcome-wizard checks remain integration gates. No supported core
version range or production deployment is claimed. See the maintenance report for
exact candidate refs, completed checks, CI evidence and the rollback route.

## Installation archive

`python scripts/package_component.py` builds a deterministic runtime-only ZIP and
SHA-256 sidecar in ignored `dist/`. Timestamps/permissions and text line endings
are normalised, and each ZIP entry is verified against its runtime source bytes.
Use the archive built from the exact candidate commit, not an arbitrary worktree.
