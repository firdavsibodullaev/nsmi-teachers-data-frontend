import * as MUTATION from './mutation-types';

export default {
    submitting: ({ commit }, payload) => commit(MUTATION.SUBMITTING, payload),
    setToken({ commit }, payload) {
        commit(MUTATION.SET_TOKEN, { token: payload.token, remember: payload.remember });
    },
};
