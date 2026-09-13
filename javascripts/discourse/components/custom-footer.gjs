import PluginOutlet from "discourse/components/plugin-outlet";
import FooterLinkSection from "./footer-link-section";

<template>
  {{#if @showFooter}}
    <footer class="wrap a1-footer">
      <div class="a1-footer__grid">
        <FooterLinkSection
          @sectionKey="community"
          @heading={{settings.community_heading}}
          @translations={{settings.community_heading_translations}}
          @links={{settings.community_links}}
        />
        <div class="a1-footer__section" data-footer-section="resources">
          <PluginOutlet @name="apprenticeone-footer-resources" />
        </div>
        <FooterLinkSection
          @sectionKey="policy"
          @heading={{settings.policy_heading}}
          @translations={{settings.policy_heading_translations}}
          @links={{settings.policy_links}}
        />
      </div>
    </footer>
  {{/if}}
</template>
