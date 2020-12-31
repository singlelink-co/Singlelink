export const state = () => ({
  token: null
});

export const getters = {
  getToken(state) {
    if (process.client) {
      return state.token || window.$nuxt.$cookies.get("auth_token");
    } else {
      return state.token;
    }
  }
};

export const mutations = {
  login(context, token) {
    state.token = token;

    if (process.client) {
      const days = window.$nuxt.$cookies.get("remember_auth") ? 56 : 1;

      window.$nuxt.$cookies.set("auth_token", token, {
        maxAge: 60 * 60 * 24 * days
      });
    }
  },

  logout(context) {
    state.token = null;

    if (process.client) {
      window.$nuxt.$cookies.set("auth_token", '', {
        maxAge: 0
      });
    }
  },
};
