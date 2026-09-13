# ApprenticeOne Footer

An MIT-licensed fork of Discourse Easy Responsive Footer. It renders Community,
Latest resources and Policy in that document order. Community and Policy contain
editable ordered link lists. Branding, description, small links and social links
are absent from the new template and setting schema.

## Companion components

- ApprenticeOne Footer CSS 1.1.0 owns the grid, spacing and active-scheme colours.
- ApprenticeOne Latest Resources Footer 1.1.0 fills `apprenticeone-footer-resources`.

Both companions remain independently deployable private repositories. Their code
is not copied into this public fork. Attach only one footer implementation to a
theme. The existing `custom-footer` root and `below-footer`/login visibility
integration are preserved for the welcome wizard and normal Discourse visibility.

## Settings

`community_heading`, `community_heading_translations`, `community_links`,
`policy_heading`, `policy_heading_translations`, `policy_links` and
`show_footer_on_login_required_page` are the only settings. Lists support the
upstream link text, URL, target, optional title, referrer policy and translations.
They have no artificial three-link limit. New links default to the same tab.

Fresh installs include Browse discussions, Start a discussion and five Policy
links. Copy the existing Contact us destination into Community settings; site
contact configuration is intentionally not stored in Git. Updating an existing
component can migrate the complete Community list, including Contact us.

Resource count belongs to the companion's existing `display_count` setting. Its
default remains three; set four in the admin UI if desired.

## Development

Use Node 24 and `npx pnpm@10.28.0 install --frozen-lockfile`. Run the focused
checks in `.github/workflows/repository-checks.yml`; `node --test tests/*.test.mjs`
checks migration, localisation and the slot contract. Full Discourse integration
and staging validation are separate requirements, not implied by these checks.

See [migration and rollback](docs/migration.md), [validation](docs/validation.md)
and [upstream provenance](SOURCE.md). No production deployment is automated.
