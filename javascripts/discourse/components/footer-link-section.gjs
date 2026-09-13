import Component from "@glimmer/component";
import getURL from "discourse/lib/get-url";
import I18nInstance from "discourse-i18n";

export default class FooterLinkSection extends Component {
  translationFor(translations) {
    return (translations || []).find(
      (translation) => translation.locale === I18nInstance.currentLocale()
    );
  }

  get heading() {
    return (
      this.translationFor(this.args.translations)?.text || this.args.heading
    );
  }

  get links() {
    return (this.args.links || []).map((link) => {
      const translation = this.translationFor(link.translations);
      return {
        ...link,
        text: translation?.text || link.text,
        title: translation?.title || link.title,
        url: link.url?.startsWith("/") ? getURL(link.url) : link.url,
        target: link.target || "_self",
      };
    });
  }

  <template>
    <nav
      class="a1-footer__section"
      data-footer-section={{@sectionKey}}
      aria-label={{this.heading}}
    >
      <h2 class="a1-footer__heading">{{this.heading}}</h2>
      <ul class="a1-footer__links">
        {{#each this.links as |link|}}
          <li class="footer-section-link-wrapper">
            <a
              class="footer-section-link"
              href={{link.url}}
              title={{link.title}}
              target={{link.target}}
              rel="noopener"
              referrerpolicy={{link.referrer_policy}}
            >
              {{link.text}}
            </a>
          </li>
        {{/each}}
      </ul>
    </nav>
  </template>
}
