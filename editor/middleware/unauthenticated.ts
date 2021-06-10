import {Context} from "@nuxt/types";

export default async function (context: Context) {
  if (context.store.getters["auth/getToken"]) {
    context.redirect('/dashboard');
  }

  const token = context.app.$cookies.get('auth_token');
  await context.store.commit("auth/setToken", token);

  if (token) {
    context.redirect('/dashboard');
  }
}
