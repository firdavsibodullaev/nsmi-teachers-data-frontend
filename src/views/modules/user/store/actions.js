import * as MUTATION from './mutation-types';

export default {
    setToken({commit}, payload) {
        commit(MUTATION.SET_TOKEN, {token: payload.token, remember: payload.remember});
    },
    logout({commit}) {
        commit(MUTATION.REMOVE_TOKEN);
    },
    setUser({commit}, {user}) {
        commit(MUTATION.SET_USER, JSON.stringify(user));
    },
};
