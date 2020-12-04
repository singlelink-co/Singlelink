import {Context} from "@nuxt/types";
import {Cookies} from "~/middleware/cookies";

export default function (context: Context) {
  const singlelinkToken = Cookies.getCookieValue('singlelink_token') || context.store.getters["auth/getToken"];

  if (singlelinkToken) {
    if (!context.store.getters['auth/login']) {
      context.$axios
        .$post('/user',
          {
            token: singlelinkToken
          })
        .then((response) => {
          // context.store.commit('user/set_user', response);
          context.store.commit('auth/login', singlelinkToken);
          // verify token
        })
        .catch((error) => {
          console.log('Error getting self');
          console.log(error);
          // context.store.commit('auth/login', singlelink_token);
          context.store.commit('auth/login', null);
          location.replace('/');
          // verify token
        });
      // context.store.commit('user/set_user', response)
    } else {
      context.store.commit('auth/login', singlelinkToken);
      // verify token
    }
  } else {
    context.redirect('/');
  }
}
