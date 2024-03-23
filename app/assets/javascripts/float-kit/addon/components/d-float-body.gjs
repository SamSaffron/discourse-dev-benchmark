import Component from "@glimmer/component";
import { concat } from "@ember/helper";
import { htmlSafe } from "@ember/template";
import { modifier } from "ember-modifier";
import concatClass from "discourse/helpers/concat-class";
import TrapTab from "discourse/modifiers/trap-tab";
import DFloatPortal from "float-kit/components/d-float-portal";
import { getScrollParent } from "float-kit/lib/get-scroll-parent";
import FloatKitApplyFloatingUi from "float-kit/modifiers/apply-floating-ui";
import FloatKitCloseOnClickOutside from "float-kit/modifiers/close-on-click-outside";
import FloatKitCloseOnEscape from "float-kit/modifiers/close-on-escape";

export default class DFloatBody extends Component {
  closeOnScroll = modifier(() => {
    const firstScrollParent = getScrollParent(this.trigger);

    const handler = () => {
      this.args.instance.close();
    };

    firstScrollParent.addEventListener("scroll", handler, { passive: true });

    return () => {
      firstScrollParent.removeEventListener("scroll", handler);
    };
  });

  get supportsCloseOnClickOutside() {
    return this.args.instance.expanded && this.options.closeOnClickOutside;
  }

  get supportsCloseOnEscape() {
    return this.args.instance.expanded && this.options.closeOnEscape;
  }

  get supportsCloseOnScroll() {
    return this.args.instance.expanded && this.options.closeOnScroll;
  }

  get trigger() {
    return this.args.instance.trigger;
  }

  get options() {
    return this.args.instance.options;
  }

  <template>
    <DFloatPortal
      @inline={{@inline}}
      @portalOutletElement={{@portalOutletElement}}
    >
      <div
        class={{concatClass
          @mainClass
          (if this.options.animated "-animated")
          (if @instance.expanded "-expanded")
          this.options.extraClassName
        }}
        data-identifier={{this.options.identifier}}
        data-content
        aria-labelledby={{@instance.id}}
        aria-expanded={{if @instance.expanded "true" "false"}}
        role={{@role}}
        {{FloatKitApplyFloatingUi this.trigger this.options @instance}}
        {{(if @trapTab (modifier TrapTab autofocus=false))}}
        {{(if
          this.supportsCloseOnClickOutside
          (modifier FloatKitCloseOnClickOutside this.trigger @instance.close)
        )}}
        {{(if
          this.supportsCloseOnEscape
          (modifier FloatKitCloseOnEscape @instance.close)
        )}}
        {{(if this.supportsCloseOnScroll (modifier this.closeOnScroll))}}
        style={{htmlSafe (concat "max-width: " this.options.maxWidth "px")}}
        ...attributes
      >
        <div class={{@innerClass}}>
          {{yield}}
        </div>
      </div>
    </DFloatPortal>
  </template>
}
