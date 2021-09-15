import Vue from 'vue'
import Antd from 'ant-design-vue';
import VueTheMask from 'vue-the-mask';
import App from './App.vue'
import router from './router';
import store from './store';
import 'ant-design-vue/dist/antd.css';
import api from './api';

Vue.config.productionTip = false

Vue.use(Antd);
Vue.use(api);
Vue.use(VueTheMask);

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
