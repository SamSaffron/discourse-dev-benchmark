import { ajax } from "discourse/lib/ajax";
import DiscourseRoute from "discourse/routes/discourse";
import I18n from "discourse-i18n";

export default DiscourseRoute.extend({
  titleToken() {
    return I18n.t("login.title");
  },

  model(params) {
    return ajax(`/session/email-login/${params.token}.json`);
  },
});
