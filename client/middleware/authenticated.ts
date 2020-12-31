import {Context} from "@nuxt/types";

export default async function (context: Context) {
  const singlelinkToken = context.store.getters["auth/getToken"];

  if (singlelinkToken) {
    if (!context.store.getters['auth/login']) {
      try {
        await context.$axios
          .$post('/user',
            {
              token: singlelinkToken
            });

        context.store.commit('auth/login', singlelinkToken);
      } catch (err) {
        console.log('Error getting self');
        console.log(err);
        // context.store.commit('auth/login', singlelink_token);
        context.store.commit('auth/login', null);
        location.replace('/');
        // verify token
      }
    } else {
      context.store.commit('auth/login', singlelinkToken);
    }
  } else {
    context.redirect('/');
  }
}
