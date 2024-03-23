import { tracked } from "@glimmer/tracking";
import Service, { service } from "@ember/service";
import {
  configNavForPlugin,
  PLUGIN_NAV_MODE_SIDEBAR,
  PLUGIN_NAV_MODE_TOP,
} from "discourse/lib/admin-plugin-config-nav";

export default class AdminPluginNavManager extends Service {
  @service currentUser;
  @tracked currentPlugin;

  get currentUserUsingAdminSidebar() {
    return this.currentUser?.use_admin_sidebar;
  }

  get currentConfigNav() {
    return configNavForPlugin(this.currentPlugin.id);
  }

  get isSidebarMode() {
    return this.currentConfigNav.mode === PLUGIN_NAV_MODE_SIDEBAR;
  }

  get isTopMode() {
    return this.currentConfigNav.mode === PLUGIN_NAV_MODE_TOP;
  }
}
