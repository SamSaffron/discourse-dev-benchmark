import { click, visit } from "@ember/test-helpers";
import { test } from "qunit";
import {
  acceptance,
  exists,
  updateCurrentUser,
} from "discourse/tests/helpers/qunit-helpers";

acceptance("Topic - Admin Menu Anonymous Users", function () {
  test("Enter as a regular user", async function (assert) {
    await visit("/t/internationalization-localization/280");
    assert.ok(exists("#topic"), "The topic was rendered");
    assert.ok(
      !exists(".toggle-admin-menu"),
      "The admin menu button was not rendered"
    );
  });
});

acceptance("Topic - Admin Menu", function (needs) {
  needs.user();
  test("Enter as a user with group moderator permissions", async function (assert) {
    updateCurrentUser({ moderator: false, admin: false, trust_level: 1 });

    await visit("/t/topic-for-group-moderators/2480");
    assert.ok(exists("#topic"), "The topic was rendered");
    assert.ok(
      exists(".toggle-admin-menu"),
      "The admin menu button was rendered"
    );

    await click(".toggle-admin-menu");
    assert.ok(exists(".topic-admin-delete"), "The delete item was rendered");
  });

  test("Enter as a user with moderator and admin permissions", async function (assert) {
    updateCurrentUser({ moderator: true, admin: true, trust_level: 4 });

    await visit("/t/internationalization-localization/280");
    assert.ok(exists("#topic"), "The topic was rendered");
    assert.ok(
      exists(".toggle-admin-menu"),
      "The admin menu button was rendered"
    );
  });

  test("Toggle the menu as admin focuses the first item", async function (assert) {
    updateCurrentUser({ admin: true });

    await visit("/t/internationalization-localization/280");
    assert.ok(exists("#topic"), "The topic was rendered");
    await click(".toggle-admin-menu");

    assert.strictEqual(
      document.activeElement,
      document.querySelector(".topic-admin-multi-select > button")
    );
  });
});
