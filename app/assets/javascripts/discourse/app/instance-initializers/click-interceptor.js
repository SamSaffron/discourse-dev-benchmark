import $ from "jquery";
import interceptClick from "discourse/lib/intercept-click";
import DiscourseURL from "discourse/lib/url";

export default {
  initialize(owner) {
    this.selector = owner.rootElement;
    $(this.selector).on("click.discourse", "a", interceptClick);
    window.addEventListener("hashchange", this.hashChanged);
  },

  hashChanged() {
    DiscourseURL.routeTo(document.location.hash);
  },

  teardown() {
    $(this.selector).off("click.discourse", "a", interceptClick);
    window.removeEventListener("hashchange", this.hashChanged);
  },
};
