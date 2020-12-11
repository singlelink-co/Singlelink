import {Context} from "@nuxt/types";

export default function (context: Context) {
  if (context.store.getters["auth/getToken"]) {
    context.redirect('/dashboard');
  }
}
