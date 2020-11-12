require('core-js/stable');
require('regenerator-runtime/runtime');

import Vue from 'vue';
import App from './vue/components/App';
import Axios from 'axios';
import VueAxios from 'vue-axios';
import TreeView from 'vue-json-tree-view';
import VueClipboard from 'vue-clipboard2';
import VTooltip from 'v-tooltip';
import VueToast from 'vue-toast-notification';

Vue.use(VueClipboard);
Vue.use(VueAxios, Axios);
Vue.use(TreeView);
Vue.use(VTooltip);
Vue.use(VueToast);

Vue.config.devtools = !!process.env.IS_DEVELOPMENT;
Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
}).$mount('#app');
