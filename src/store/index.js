import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    auth: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setAuthState(state, auth) {
      state.auth = auth;
    }
  },
  actions: {},
  modules: {}
});
