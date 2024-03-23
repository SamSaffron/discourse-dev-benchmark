import { registerDestructor } from "@ember/destroyable";
import Modifier from "ember-modifier";
import { bind } from "discourse-common/utils/decorators";

export default class FloatKitCloseOnClickOutside extends Modifier {
  constructor(owner, args) {
    super(owner, args);
    registerDestructor(this, (instance) => instance.cleanup());
  }

  modify(element, [trigger, closeFn]) {
    this.closeFn = closeFn;
    this.trigger = trigger;
    this.element = element;

    document.addEventListener("pointerdown", this.check, {
      passive: true,
    });
  }

  @bind
  check(event) {
    if (this.element.contains(event.target)) {
      return;
    }

    if (
      this.trigger instanceof HTMLElement &&
      this.trigger.contains(event.target)
    ) {
      return;
    }

    this.closeFn();
  }

  cleanup() {
    document.removeEventListener("pointerdown", this.check);
  }
}
