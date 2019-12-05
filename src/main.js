document.getElementsByTagName("html")[0].style.fontSize = 100 * window.screen.width / 750 + 'px';
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {
  Request
} from './request'
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
import './assets/css/public.css';
import './assets/css/data_file.scss';
import VueClipboard from 'vue-clipboard2'
import Vant from 'vant';
import 'vant/lib/index.css';
// import VueTouch from 'vue-touch';       
// Vue.use(VueTouch, {name: 'v-touch'});        VueTouch.config.swipe = {             
//   threshold: 100 //手指左右滑动距离        
// };
// VueTouch.config.pan = { 
//   direction: 'horizo​​ntal' 
// };
Vue.use(Vant);
VueClipboard.config.autoSetContainer = true // add this line
Vue.use(VueClipboard)

const apiUrl = process.env.VUE_APP_API_URL;
Vue.config.productionTip = false;
Vue.prototype.$baseInfo = Object.assign({}, process.env);
console.log("current env:", Vue.prototype.$baseInfo);
Vue.use(Mint);

Vue.use(new Request, {
  apiUrl
});
Vue.use(new Request, {
  apiUrl: process.env.VUE_APP_Easyapply_URL,
  servceName: "$request2",
});
Vue.use(new Request, {
  apiUrl: process.env.VUE_APP_Wxapi_URL,
  servceName: "$requestWx",
});
Vue.use(new Request, {
  apiUrl: process.env.VUE_APP_Cashloan_URL,
  servceName: "$requestCl",
});
Vue.use(new Request, {
  apiUrl: process.env.VUE_APP_Cashloan2_URL,
  servceName: "$requestCl2",
});

const app = new Vue({
  router,
  store,
  render: h => h(App),
  beforeDestroy() {
    sessionStorage.clear()
  },
});


app.$mount('#app')