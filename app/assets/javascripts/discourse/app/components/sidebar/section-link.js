import Component from "@glimmer/component";
import { service } from "@ember/service";
import deprecated from "discourse-common/lib/deprecated";

/**
 * Checks if a given string is a valid color hex code.
 *
 * @param {String|undefined} input Input string to check if it is a valid color hex code. Can be in the form of "FFFFFF" or "#FFFFFF" or "FFF" or "#FFF".
 * @returns {String|undefined} Returns the matching color hex code without the leading `#` if it is valid, otherwise returns undefined. Example: "FFFFFF" or "FFF".
 */
export function isHex(input) {
  const match = input?.match(/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);

  if (match) {
    return match[1];
  } else {
    return;
  }
}
export default class SectionLink extends Component {
  @service currentUser;

  constructor() {
    super(...arguments);
    this.args.didInsert?.();
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.args.willDestroy?.();
  }

  get shouldDisplay() {
    if (this.args.shouldDisplay === undefined) {
      return true;
    }

    return this.args.shouldDisplay;
  }

  get linkClass() {
    let classNames = ["sidebar-section-link", "sidebar-row"];

    if (this.args.linkClass) {
      classNames.push(this.args.linkClass);
    }

    if (this.args.class) {
      deprecated("SectionLink's @class arg has been renamed to @linkClass", {
        id: "discourse.section-link-class-arg",
        since: "3.2.0.beta4",
        dropFrom: "3.3.0.beta1",
      });
      classNames.push(this.args.class);
    }

    return classNames.join(" ");
  }

  get target() {
    return this.currentUser?.user_option?.external_links_in_new_tab &&
      this.isExternal
      ? "_blank"
      : "_self";
  }

  get isExternal() {
    return (
      this.args.href &&
      new URL(this.args.href, window.location.href).origin !==
        window.location.origin
    );
  }

  get models() {
    if (this.args.model) {
      return [this.args.model];
    }

    if (this.args.models) {
      return this.args.models;
    }

    return [];
  }

  get prefixColor() {
    const hexCode = isHex(this.args.prefixColor);

    if (hexCode) {
      return `#${hexCode}`;
    } else {
      return;
    }
  }
}
