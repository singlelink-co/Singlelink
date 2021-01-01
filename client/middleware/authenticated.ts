import {Context} from "@nuxt/types";

export default async function (context: Context) {
  let singlelinkToken = context.store.getters["auth/getToken"];

  if (!singlelinkToken) {
    const token = context.app.$cookies.get('auth_token');
    await context.store.commit("auth/setToken", token);

    singlelinkToken = token;
  }

  if (!singlelinkToken) {
    context.redirect('/');
  }
}
