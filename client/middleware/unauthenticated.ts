import {Context} from "@nuxt/types";
import {Cookies} from "~/middleware/cookies";

export default function (context: Context) {
  const singlelinkToken = Cookies.getCookieValue('singlelink_token');

  if (singlelinkToken || context.store.getters["auth/getToken"]) {
    context.redirect('/dashboard');
  }
}
