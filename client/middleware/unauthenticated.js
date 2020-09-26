import Cookies from "~/middleware/utils";

export default function ({store, redirect}) {
  const singlelink_token = Cookies.getCookieValue('singlelink_token');
  if (singlelink_token || store.getters.get_token) {
    return redirect(200, '/dashboard');
  }
}
