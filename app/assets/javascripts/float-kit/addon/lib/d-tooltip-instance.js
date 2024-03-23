import { setOwner } from "@ember/application";
import { action } from "@ember/object";
import { guidFor } from "@ember/object/internals";
import { service } from "@ember/service";
import { TOOLTIP } from "float-kit/lib/constants";
import FloatKitInstance from "float-kit/lib/float-kit-instance";

export default class DTooltipInstance extends FloatKitInstance {
  @service tooltip;

  constructor(owner, trigger, options = {}) {
    super(...arguments);

    setOwner(this, owner);
    this.options = { ...TOOLTIP.options, ...options };
    this.id = trigger.id || guidFor(trigger);
    this.trigger = trigger;
    this.setupListeners();
  }

  @action
  onMouseMove(event) {
    if (this.trigger.contains(event.target) && this.expanded) {
      return;
    }

    this.onTrigger(event);
  }

  @action
  onClick(event) {
    if (this.expanded && this.untriggers.includes("click")) {
      this.onUntrigger(event);
      return;
    }

    this.onTrigger(event);
  }

  @action
  onMouseLeave(event) {
    if (this.untriggers.includes("hover")) {
      this.onUntrigger(event);
    }
  }

  @action
  async onTrigger() {
    this.options.beforeTrigger?.(this);
    await this.show();
  }

  @action
  async onUntrigger() {
    await this.close();
  }

  @action
  destroy() {
    this.close();
    this.tearDownListeners();
  }
}
