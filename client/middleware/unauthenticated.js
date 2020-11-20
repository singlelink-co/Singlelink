import Cookies from "~/middleware/utils";

export default function (context) {
  const singlelink_token = Cookies.getCookieValue('singlelink_token', context);

  if (singlelink_token || context.store.getters["auth/getToken"]) {
    context.redirect('/dashboard');
  }
}
