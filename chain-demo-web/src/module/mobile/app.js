import Vue from 'vue'
import axios from 'axios'
// import vueg from 'vueg'
// import 'vueg/css/transition-min.css'
import YDUI from 'vue-ydui'; /* 相当于import YDUI from 'vue-ydui/ydui.rem.js' */
import 'vue-ydui/dist/ydui.rem.css'
/* 使用px：import 'vue-ydui/dist/ydui.px.css'; */
import 'vue-ydui/dist/ydui.flexible'

import App from './app.vue'
import store from './manage/store'
import router from './manage/router'
import Snake from '@/util/preloader'
import Utils from '@/api/Utils';

import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog'
import VuePhotoswipe from '@/components/vue-photoswipe'
import VideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
Vue.use(VideoPlayer)
Vue.use(YDUI);
Vue.use(Snake, router);
Vue.use(VuePhotoswipe);
import  { LoadingPlugin, ToastPlugin } from 'vux'
Vue.use(ToastPlugin);
Vue.use(LoadingPlugin)

Vue.prototype.$dialog = { confirm: Confirm, alert: Alert, toast: Toast, notify: Notify, loading: Loading }

const vm = new Vue({
  el: '#app',
  store,
  router,
  render: page => page(App)
})
axios.defaults.timeout = 10000

Vue.prototype.$http = axios;

import customFilter from '@/filter/customFilter'
// 注册全局过滤器
for (let k in customFilter) {
  Vue.filter(k, customFilter[k]);
}

// http请求拦截器
axios.interceptors.request.use(config => {
  return config
}, error => {
  vm.$dialog.alert({mes: '请求失败'});
  return Promise.reject(error)
});

// http响应拦截器
axios.interceptors.response.use(res => {
  if (res.data && !res.data.success) {
    vm.$dialog.alert({mes: res.data.message});
  }
  return res.data
}, error => {
  if (error.response && error.response.data) {
    vm.$dialog.alert({mes: error.response.data.message});
  } else {
    vm.$dialog.alert({mes: '请求失败'});
  }
  return Promise.reject(error);
});
if (Utils.isPcBrowser()) {
  window.location.href = 'index.html';
}
