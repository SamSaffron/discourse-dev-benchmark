import Component from "@ember/component";
import { htmlSafe } from "@ember/template";
import I18n from "discourse-i18n";

export default Component.extend({
  tagName: "span",
  i18nCount: null,

  didReceiveAttrs() {
    this._super(...arguments);

    let fullKey = this.key + (this.suffix || "");
    if (
      this.currentUser?.new_new_view_enabled &&
      fullKey === "topic_count_new"
    ) {
      fullKey = "topic_count_latest";
    }
    this.set("i18nCount", htmlSafe(I18n.t(fullKey, { count: this.count })));
  },
});
