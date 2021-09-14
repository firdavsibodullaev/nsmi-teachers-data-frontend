import state from './store/state';
import getters from './store/getters';
import mutations from './store/mutations';
import actions from './store/actions';

const namespaced = true;

export default {
    namespaced,
    state,
    getters,
    mutations,
    actions
}
