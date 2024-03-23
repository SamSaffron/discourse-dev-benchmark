import Component from "@glimmer/component";
import { service } from "@ember/service";
import { eq, not, or } from "truth-helpers";
import DAG from "discourse/lib/dag";
import getURL from "discourse-common/lib/get-url";
import Dropdown from "./dropdown";
import PanelPortal from "./panel-portal";
import UserDropdown from "./user-dropdown";

let headerIcons;
resetHeaderIcons();

function resetHeaderIcons() {
  headerIcons = new DAG({ defaultPosition: { before: "search" } });
  headerIcons.add("search");
  headerIcons.add("hamburger", undefined, { after: "search" });
  headerIcons.add("user-menu", undefined, { after: "hamburger" });
}

export function headerIconsDAG() {
  return headerIcons;
}

export function clearExtraHeaderIcons() {
  resetHeaderIcons();
}

export default class Icons extends Component {
  @service site;
  @service currentUser;
  @service header;
  @service search;

  <template>
    <ul class="icons d-header-icons">
      {{#each (headerIcons.resolve) as |entry|}}
        {{#if (eq entry.key "search")}}
          <Dropdown
            @title="search.title"
            @icon="search"
            @iconId={{@searchButtonId}}
            @onClick={{@toggleSearchMenu}}
            @active={{this.search.visible}}
            @href={{getURL "/search"}}
            @className="search-dropdown"
            @targetSelector=".search-menu-panel"
          />
        {{else if (eq entry.key "hamburger")}}
          {{#if (or (not @sidebarEnabled) this.site.mobileView)}}
            <Dropdown
              @title="hamburger_menu"
              @icon="bars"
              @iconId="toggle-hamburger-menu"
              @active={{this.header.hamburgerVisible}}
              @onClick={{@toggleHamburger}}
              @className="hamburger-dropdown"
            />
          {{/if}}
        {{else if (eq entry.key "user-menu")}}
          {{#if this.currentUser}}
            <UserDropdown
              @active={{this.header.userVisible}}
              @toggleUserMenu={{@toggleUserMenu}}
            />
          {{/if}}
        {{else if entry.value}}
          <entry.value
            @panelPortal={{component PanelPortal panelElement=@panelElement}}
          />
        {{/if}}
      {{/each}}
    </ul>
  </template>
}
