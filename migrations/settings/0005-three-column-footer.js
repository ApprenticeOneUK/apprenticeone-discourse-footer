// Updating an existing component can migrate its values. A new installation
// cannot read another component's settings; transfer those through the UI.
export default function migrate(settings) {
  const sections = settings.get("sections");
  const community = Array.isArray(sections)
    ? sections.find(
        (section) => section.text?.trim().toLowerCase() === "community"
      )
    : undefined;
  const policy = Array.isArray(sections)
    ? sections.find((section) =>
        /^(policy|policies)$/i.test(section.text?.trim())
      )
    : undefined;

  for (const [key, section] of [
    ["community", community],
    ["policy", policy],
  ]) {
    if (!section) {
      continue;
    }
    if (!settings.has(`${key}_links`)) {
      settings.set(`${key}_links`, section.links || []);
    }
    if (!settings.has(`${key}_heading`)) {
      settings.set(`${key}_heading`, section.text);
    }
    if (!settings.has(`${key}_heading_translations`) && section.translations) {
      settings.set(`${key}_heading_translations`, section.translations);
    }
  }

  const smallLinks = settings.get("small_links");
  if (!settings.has("policy_links") && Array.isArray(smallLinks)) {
    settings.set(
      "policy_links",
      smallLinks.filter((link) => {
        const path = (link.url || "").replace(/^https?:\/\/[^/]+/i, "");
        return (
          !/^about$/i.test(link.text?.trim()) &&
          !/^\/about\/?(?:[?#].*)?$/.test(path)
        );
      })
    );
  }

  // Legacy values remain dormant to support rollback. The new schema and
  // template no longer expose or render the old branding/social/small links.
  return settings;
}
