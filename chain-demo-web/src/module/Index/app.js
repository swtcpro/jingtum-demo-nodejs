import Vue from 'vue'
import axios from 'axios'

import App from './app.vue'
import store from './manage/store'
import router from './manage/router'
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui'
import Utils from '@/api/Utils';
Vue.use(ElementUI);
import VideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
Vue.use(VideoPlayer)

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
let loadingInstance = null;
// http请求拦截器
axios.interceptors.request.use(config => {
  loadingInstance = vm.$loading({text: 'Loading...', spinner: 'el-icon-loading'});
  return config
}, error => {
  vm.$alert('发送请求失败');
  loadingInstance.close();
  return Promise.reject(error)
})

// http响应拦截器
axios.interceptors.response.use(res => {
  loadingInstance.close();
  if (!res.data.success) {
    vm.$alert(`${res.data.message}`);
  }
  return res.data;
}, error => {
  loadingInstance.close();
  if (error.response && error.response.data) {
    vm.$alert(`${error.response.data.message}`);
  } else {
    vm.$alert('请求失败');
  }
  return Promise.reject(error.response.data)
});

if (!Utils.isPcBrowser()) {
  window.location.href = 'mobile.html';
}
