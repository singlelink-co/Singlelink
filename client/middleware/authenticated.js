import Cookies from "~/middleware/utils";

export default function (context) {
  const singlelink_token = Cookies.getCookieValue('singlelink_token', context) || context.store.getters["auth/getToken"];

  if (singlelink_token) {
    if (!context.store.user) {
      context.$axios
        .$post('/user',
          {
            token: singlelink_token
          })
        .then((response) => {
          //context.store.commit('user/set_user', response);
          context.store.commit('auth/login', singlelink_token);
          // verify token
        })
        .catch((error) => {
          console.log('Error getting self');
          console.log(error);
          //context.store.commit('auth/login', singlelink_token);
          context.store.commit('auth/login', null);
          location.replace('/');
          // verify token
        });
      // context.store.commit('user/set_user', response)
    } else {
      context.store.commit('auth/login', singlelink_token);
      // verify token
    }
  } else {
     context.redirect('/');
  }
}
