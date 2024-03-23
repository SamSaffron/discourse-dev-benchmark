import Component from "@ember/component";
import { service } from "@ember/service";
import { ajax } from "discourse/lib/ajax";
import isElementInViewport from "discourse/lib/is-element-in-viewport";
import { userPath } from "discourse/lib/url";
import { bind } from "discourse-common/utils/decorators";

export default class WatchRead extends Component {
  @service currentUser;

  didInsertElement() {
    super.didInsertElement(...arguments);

    if (!this.currentUser || this.currentUser.read_faq) {
      return;
    }

    this._checkIfRead();
    window.addEventListener("resize", this._checkIfRead, false);
    window.addEventListener("scroll", this._checkIfRead, false);
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);

    window.removeEventListener("resize", this._checkIfRead);
    window.removeEventListener("scroll", this._checkIfRead);
  }

  @bind
  async _checkIfRead() {
    const lastParagraph = document.querySelector(
      "[itemprop='mainContentOfPage'] > *:last-child"
    );

    if (!isElementInViewport(lastParagraph)) {
      return;
    }

    await ajax(userPath("read-faq"), { type: "POST" });
    this.currentUser.set("read_faq", true);
  }
}
