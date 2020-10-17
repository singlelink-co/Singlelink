import Cookies from "~/middleware/utils";

export const state = () => ({
  token: null
});

export const getters = {
  get_token(state) {
    return state.token || Cookies.getCookieValue('singlelink_token', this);
  },
  is_authenticated(state) {
    return state.token != null;
  },
};

export const mutations = {
  login(vuexContext, token) {
    Cookies.setCookie('singlelink_token', token, 7, this);
    state.token = token;
    vuexContext.token = token;
  },
  logout(vuexContext) {
    state.token = null;
    vuexContext.token = null;
    Cookies.setCookie('singlelink_token', '', 7, this);
  }
};

export const actions = {};
