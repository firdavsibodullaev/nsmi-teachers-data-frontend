import * as MUTATION from './mutation-types';

export default {
    openDrawer({ commit }, payload) {
        commit(MUTATION.DRAWER_OPEN, payload);
    },
    clearFormFieldsOnClose({commit}, payload) {
        commit(MUTATION.DRAWER_CLOSE, payload);
    }
}
