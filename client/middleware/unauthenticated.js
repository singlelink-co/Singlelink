import Cookies from "~/middleware/utils";

export default function (context) {
  const singlelink_token = Cookies.getCookieValue('singlelink_token', context);
  if (singlelink_token || context.store.getters.get_token) {
    return context.redirect('/dashboard');
  }
}
