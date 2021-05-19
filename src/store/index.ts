import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';

export interface State {
  user: Record<string, unknown>;
  token: string;
  baseURL: string;
}

export const key: InjectionKey<Store<State>> = Symbol();

export default createStore<State>({
  state: {
    user: {},
    token: '',
    baseURL: '',
  },

  mutations: {
    COMMIT_USER(state, payload: Record<string, unknown>) {
      state.user = payload;
    },

    COMMIT_TOKEN(state, payload: string) {
      state.token = payload;
    },

    COMMIT_BASEURL(state, payload: string) {
      state.baseURL = payload;
    },
  },

  getters: {
    user(state) {
      return state.user;
    },

    token(state) {
      return state.token;
    },

    baseURL(state) {
      return state.baseURL;
    },
  },
});
