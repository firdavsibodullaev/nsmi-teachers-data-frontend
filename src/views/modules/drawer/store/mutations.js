import * as MUTATION from './mutation-types';

export default {
    [MUTATION.DRAWER_OPEN](state, {type, title, data = null}) {
        state.visible = true;
        state.type = type;
        state.title = title;
        state.data = data;
    },
    [MUTATION.DRAWER_CLOSE](state, payload) {
        if (payload === true) {
            state.type = null;
            state.title = null;
        }
        state.visible = false;
        state.data = null;
    }
}
