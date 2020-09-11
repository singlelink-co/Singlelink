import Cookies from "~/middleware/utils";

export default function (context) {
  const singlelink_token = Cookies.getCookieValue('singlelink_token') || context.store.getters.get_token;

  if (singlelink_token) {
    if (!context.store.user) {
      context.$axios
        .$post('/user/fetch',
          {
            token: singlelink_token
          })
        .then((response) => {
          console.log('ree');
          console.log(response);
          //context.store.commit('user/set_user', response);
          context.store.commit('auth/login', singlelink_token);
          // verify token
        })
        .catch((error) => {
          console.log('Error fetching self');
          console.log(error);
          //context.store.commit('auth/login', singlelink_token);
          context.store.commit('auth/login', null);
          return location.replace('/');
          // verify token
        });
      // context.store.commit('user/set_user', response)
    } else {
      context.store.commit('auth/login', singlelink_token);
      // verify token
    }
  } else {
    return context.redirect(200, '/');
  }
}
