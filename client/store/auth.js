export const state = () => ({
  token: null
});

export const getters = {
  getToken(state) {
    return state.token;
  }
};

export const mutations = {
  login(state, token) {
    const days = this.$cookies.get("remember_auth") ? 56 : 1;

    this.$cookies.set("auth_token", token, {
      path: "/",
      maxAge: 60 * 60 * 24 * days
    });

    state.token = token;
  },

  logout(state) {
    state.token = null;

    this.$cookies.set("auth_token", '', {
      path: "/",
      maxAge: 0
    });
  },

  setToken(state, token) {
    state.token = token;
  }
};
