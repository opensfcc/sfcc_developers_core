require('core-js/stable');
require('regenerator-runtime/runtime');

import Vue from 'vue';
import App from './vue/components/App';
import Axios from 'axios';
import VueAxios from 'vue-axios';
import TreeView from 'vue-json-tree-view';

Vue.use(Axios);
Vue.use(VueAxios, Axios);
Vue.use(TreeView);

Vue.config.devtools = true;
Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
}).$mount('#app');
