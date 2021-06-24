import {Context} from "@nuxt/types";

/**
 * This middleware will redirect an unauthenticated page to an authenticated page, aka the dashboard.
 * This is used when the user should not see a page meant for unauthenticated users.
 *
 * @param context
 */
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
