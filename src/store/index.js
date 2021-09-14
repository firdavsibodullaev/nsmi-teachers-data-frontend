import Vue from 'vue';
import Vuex from 'vuex';
import auth from '../views/modules/auth';
import user from '../views/modules/user';
import drawer from '../views/modules/drawer';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        collapsed: false,
    },
    getters: {
        collapsed: (state) => state.collapsed,
    },
    mutations: {
        SET_COLLAPSED: (state, collapse) => {
            state.collapsed = collapse;
        },
    },
    modules: {
        auth,
        user,
        drawer,
    },
});
