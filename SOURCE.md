# Upstream provenance

- Upstream: https://github.com/discourse/Discourse-easy-footer
- Fork: https://github.com/ApprenticeOneUK/apprenticeone-discourse-footer
- Base commit: `4f2f1d4a50965158a2015eff26a0501fe00ead9c`.
- That commit matches the production footer reference recorded by maintenance.
- The full untouched upstream Git history is retained. This is a fork, not a ZIP
  import. `LICENSE` retains the upstream MIT notice.

The custom branch changes the template, settings and styling boundary and adds a
settings migration. Upstream fixes should be reviewed and cherry-picked as needed;
no automatic compatibility branch creation or upstream merges are scheduled.
The resource search implementation and site palette CSS remain in their own
repositories. No production exports, contact addresses or user data are included.
