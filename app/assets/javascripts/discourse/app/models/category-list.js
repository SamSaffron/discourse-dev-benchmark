import ArrayProxy from "@ember/array/proxy";
import { ajax } from "discourse/lib/ajax";
import { number } from "discourse/lib/formatter";
import PreloadStore from "discourse/lib/preload-store";
import Category from "discourse/models/category";
import Site from "discourse/models/site";
import Topic from "discourse/models/topic";
import { bind } from "discourse-common/utils/decorators";
import I18n from "discourse-i18n";

export default class CategoryList extends ArrayProxy {
  static categoriesFrom(store, result, parentCategory = null) {
    // Find the period that is most relevant
    const statPeriod =
      ["week", "month"].find(
        (period) =>
          result.category_list.categories.filter(
            (c) => c[`topics_${period}`] > 0
          ).length >=
          result.category_list.categories.length * 0.66
      ) || "all";

    // Update global category list to make sure that `findById` works as
    // expected later
    result.category_list.categories.forEach((c) =>
      Site.current().updateCategory(c)
    );

    const categories = CategoryList.create({ store });
    result.category_list.categories.forEach((c) => {
      c = this._buildCategoryResult(c, statPeriod);
      if (
        !c.parent_category_id ||
        c.parent_category_id === parentCategory?.id
      ) {
        categories.pushObject(c);
      }
    });
    return categories;
  }

  static _buildCategoryResult(c, statPeriod) {
    if (c.parent_category_id) {
      c.parentCategory = Category.findById(c.parent_category_id);
    }

    if (c.subcategory_list) {
      c.subcategories = c.subcategory_list.map((subCategory) =>
        this._buildCategoryResult(subCategory, statPeriod)
      );
    } else if (c.subcategory_ids) {
      c.subcategories = c.subcategory_ids.map((subCategoryId) =>
        Category.findById(parseInt(subCategoryId, 10))
      );
    }

    if (c.subcategories) {
      // TODO: Not all subcategory_ids have been loaded
      c.subcategories = c.subcategories?.filter(Boolean);
    }

    if (c.topics) {
      c.topics = c.topics.map((t) => Topic.create(t));
    }

    const stat = c[`topics_${statPeriod}`];
    if ((statPeriod === "week" || statPeriod === "month") && stat > 0) {
      const unit = I18n.t(`categories.topic_stat_unit.${statPeriod}`);

      c.stat = I18n.t("categories.topic_stat", {
        count: stat, // only used to correctly pluralize the string
        number: `<span class="value">${number(stat)}</span>`,
        unit: `<span class="unit">${unit}</span>`,
      });

      c.statTitle = I18n.t(`categories.topic_stat_sentence_${statPeriod}`, {
        count: stat,
      });

      c.pickAll = false;
    } else {
      c.stat = `<span class="value">${number(c.topics_all_time)}</span>`;
      c.statTitle = I18n.t("categories.topic_sentence", {
        count: c.topics_all_time,
      });
      c.pickAll = true;
    }

    if (Site.current().mobileView) {
      c.statTotal = I18n.t("categories.topic_stat_all_time", {
        count: c.topics_all_time,
        number: `<span class="value">${number(c.topics_all_time)}</span>`,
      });
    }

    const record = Site.current().updateCategory(c);
    record.setupGroupsAndPermissions();
    return record;
  }

  static listForParent(store, category) {
    return ajax(
      `/categories.json?parent_category_id=${category.get("id")}`
    ).then((result) =>
      CategoryList.create({
        store,
        categories: this.categoriesFrom(store, result, category),
        parentCategory: category,
      })
    );
  }

  static list(store) {
    return PreloadStore.getAndRemove("categories_list", () =>
      ajax("/categories.json")
    ).then((result) =>
      CategoryList.create({
        store,
        categories: this.categoriesFrom(store, result),
        can_create_category: result.category_list.can_create_category,
        can_create_topic: result.category_list.can_create_topic,
      })
    );
  }

  init() {
    this.set("content", this.categories || []);
    super.init(...arguments);
    this.set("page", 1);
    this.set("fetchedLastPage", false);
  }

  @bind
  async loadMore() {
    if (this.isLoading || this.fetchedLastPage) {
      return;
    }

    this.set("isLoading", true);

    const data = { page: this.page + 1 };
    const result = await ajax("/categories.json", { data });

    this.set("page", data.page);
    if (result.category_list.categories.length === 0) {
      this.set("fetchedLastPage", true);
    }
    this.set("isLoading", false);

    const newCategoryList = CategoryList.categoriesFrom(this.store, result);
    newCategoryList.forEach((c) => this.categories.pushObject(c));
  }
}
