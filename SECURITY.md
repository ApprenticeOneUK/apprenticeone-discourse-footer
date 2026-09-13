# Security

Do not commit production data, credentials or site contact settings. Use synthetic
fixtures for tests. Treat configured text as plain text; Glimmer escapes link
labels. Navigation URLs are administrator-controlled settings. New-window links
include `rel="noopener"`. Keep dependencies locked and review upstream changes.

Report security concerns through the repository's private vulnerability reporting
channel where available; do not open a public issue containing sensitive details.
