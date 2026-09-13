# Coordinated footer installation and rollback

This is a three-repository candidate, not a production deployment. Use exact
commits from the maintenance candidate, not a floating branch. Preview the full
Discourse theme in staging before production promotion.

1. Keep a private export of the existing Footer TC settings and theme attachment
   outside Git. Record the installed refs for both companions.
2. Update the existing Footer CSS and Latest Resources Footer components to their
   candidate versions. They retain old-footer compatibility for staged switching.
3. Install ApprenticeOne Footer into a preview theme. Copy the existing Community
   list (including Contact us) into `community_links`; copy the five policy links
   into `policy_links`, excluding About. Preserve existing URLs and translations.
   Installing a new component does not automatically access another component's
   settings. Migration 0005 only applies when updating the same component record
   and after upstream migrations 0001–0004 have already run.
4. On that preview theme, replace the upstream footer attachment with the fork;
   never attach both footer implementations. Keep both companion components
   attached. Confirm the Community → resources → Policy reading order.
5. Leave all resource filters and search settings as currently configured. The
   count still supports 1–6 with default 3; set `display_count` to 4 if wanted.
6. Check normal, guest, login-required and welcome-wizard views; light/dark, narrow
   widths, long titles, no results and failed requests. View all resources must
   remain available. Verify every configured URL before promotion.
7. After explicit production approval, record actual installed refs and new theme
   ID/attachment in maintenance inventory and production lock. Do not infer them
   from a successful GitHub check.

Rollback: reattach the previous upstream footer and detach the fork. The new
companions support the old outlet/layout. For complete rollback, restore their
previous exact refs and the saved settings. A rollback after same-record schema
migration should restore the export if Discourse did not retain dormant values;
legacy keys in migration input are deliberately not deleted.
