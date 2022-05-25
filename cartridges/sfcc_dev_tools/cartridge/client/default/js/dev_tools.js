require('core-js/stable');
require('regenerator-runtime/runtime');

import Vue from 'vue';
import App from './vue/components/App';
import Axios from 'axios';
import VueAxios from 'vue-axios';
import VTooltip from 'v-tooltip';
import TreeView from 'vue-json-tree-view';

Vue.use(VTooltip);
Vue.use(TreeView);
Vue.use(VueAxios, Axios);

Vue.config.devtools = !!process.env.IS_DEVELOPMENT;
Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
}).$mount('#sfcc_dev_tools');
