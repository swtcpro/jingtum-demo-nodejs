import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

/**
 * require.ensure() 引入的多个模块
 * 打包列如 ：
 * 1.home.js
 */

const Home = r => require.ensure([], () => r(require('../views/home')))
const Wallet = r => require.ensure([], () => r(require('../views/wallet')))
const VideoChain = r => require.ensure([], () => r(require('../views/videoChain')))
const TextChain = r => require.ensure([], () => r(require('../views/textChain')))
const PictureChain = r => require.ensure([], () => r(require('../views/pictureChain')))

const baseUrl = '' // 多页面路径配置

const routes = [
  {
    name: 'root',
    path: baseUrl + '/',
    redirect: baseUrl + '/home'
  },
  {
    name: 'home',
    path: baseUrl + '/home',
    component: Home
  },
  {
    name: 'wallet',
    path: baseUrl + '/home/wallet',
    component: Wallet
  },
  {
    name: 'videoChain',
    path: baseUrl + '/home/video',
    component: VideoChain
  },
  {
    name: 'textChain',
    path: baseUrl + '/home/text',
    component: TextChain
  },
  {
    name: 'pictureChain',
    path: baseUrl + '/home/picture',
    component: PictureChain
  }
]

const router = new VueRouter({
  hashbang: true, // 将路径格式化为#!开头
  history: true, // use history=false when testing
  // mode: 'history',
  base: __dirname,
  linkActiveClass: 'v-link-active',
  routes // （缩写）相当于 routes: routes
})

export default router
