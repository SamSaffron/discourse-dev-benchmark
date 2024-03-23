import Service, { service } from "@ember/service";
import { TrackedSet } from "@ember-compat/tracked-built-ins";
import { disableImplicitInjections } from "discourse/lib/implicit-injections";
import { isTesting } from "discourse-common/config/environment";

@disableImplicitInjections
export default class UserTips extends Service {
  @service site;
  @service currentUser;

  #availableTips = new Set();
  #renderedId;
  #shouldRenderSet = new TrackedSet();

  #updateRenderedId() {
    const tipsArray = [...this.#availableTips];
    if (tipsArray.find((tip) => tip.id === this.#renderedId)) {
      return;
    }

    const newId = tipsArray
      .sortBy("priority")
      .reverse()
      .find((tip) => {
        if (this.canSeeUserTip(tip.id)) {
          return tip.id;
        }
      })?.id;

    if (this.#renderedId !== newId) {
      this.#shouldRenderSet.delete(this.#renderedId);
      this.#shouldRenderSet.add(newId);
      this.#renderedId = newId;
    }
  }

  shouldRender(id) {
    return this.#shouldRenderSet.has(id);
  }

  addAvailableTip(tip) {
    this.#availableTips.add(tip);
    this.#updateRenderedId();
  }

  removeAvailableTip(tip) {
    this.#availableTips.delete(tip);
    this.#updateRenderedId();
  }

  canSeeUserTip(tipId) {
    if (!this.currentUser) {
      return false;
    }

    const userTips = this.site.user_tips;
    if (!userTips || this.currentUser.user_option?.skip_new_user_tips) {
      return false;
    }

    if (!userTips[tipId]) {
      if (!isTesting()) {
        // eslint-disable-next-line no-console
        console.warn("Cannot show user tip with id", tipId);
      }
      return false;
    }

    const seenUserTips = this.currentUser.user_option?.seen_popups || [];
    if (seenUserTips.includes(-1) || seenUserTips.includes(userTips[tipId])) {
      return false;
    }

    return true;
  }

  async hideUserTipForever(tipId) {
    if (!this.currentUser) {
      return;
    }

    const userTips = this.site.user_tips;
    if (!userTips || this.currentUser.user_option?.skip_new_user_tips) {
      return;
    }

    // Empty tipId means all user tips.
    if (!userTips[tipId]) {
      // eslint-disable-next-line no-console
      console.warn("Cannot hide user tip with id", tipId);
      return;
    }

    const tipObj = [...this.#availableTips].find((t) => t.id === tipId);
    this.removeAvailableTip(tipObj);

    // Update list of seen user tips.
    let seenUserTips = this.currentUser.user_option?.seen_popups || [];
    if (seenUserTips.includes(userTips[tipId])) {
      return;
    }
    seenUserTips.push(userTips[tipId]);

    // Save seen user tips on the server.
    if (!this.currentUser.user_option) {
      this.currentUser.set("user_option", {});
    }
    this.currentUser.set("user_option.seen_popups", seenUserTips);
    await this.currentUser.save(["seen_popups"]);
  }
}
