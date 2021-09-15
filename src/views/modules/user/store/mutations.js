import Cookies from 'js-cookie';
import * as MUTATION from './mutation-types';

export default {
  [MUTATION.SET_TOKEN](state, { token, remember }) {
    state.accessToken = token;
    Cookies.set('access_token', token, { expires: remember ? 365 : null });
  },
  [MUTATION.REMOVE_TOKEN](state) {
    state.accessToken = false;
    Cookies.remove('access_token');
    Cookies.remove('user');
  },
  [MUTATION.SET_USER](state, payload) {
    state.user = payload;
    Cookies.set('user', payload);
  },
};
