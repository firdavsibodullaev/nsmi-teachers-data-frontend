import Cookies from 'js-cookie';
import * as MUTATION from './mutation-types';

export default {
    [MUTATION.SUBMITTING](state, payload) {
        state.isSubmitting = payload;
    },
    [MUTATION.SET_TOKEN](state, { token, remember }) {
        state.accessToken = token;
        Cookies.set('access_token', token, { expires: remember ? 365 : null });
    },
};
