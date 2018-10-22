<template>
  <div class="container" id="jsBgParticles">
    <section class="page-header">
      <div class="section-content">
        <div class="logo">
          <router-link :to="'/home'">
            <img src="../../assets/images/logo.png" alt="logo" class="logo-img" title="首页">
            <div class="title">数据上链演示系统</div>
          </router-link>
        </div>
        <ul class="nav-menu">
          <router-link :to="'/home/wallet'"><li class="nav-menu-item">钱&nbsp;&nbsp;&nbsp;&nbsp;包</li></router-link>
          <router-link :to="'/home/text'"><li class="nav-menu-item">文本上链</li></router-link>
          <router-link :to="'/home/picture'"><li class="nav-menu-item">图片/PDF上链</li></router-link>
          <router-link :to="'/home/video'"><li class="nav-menu-item">音视频上链</li></router-link>
        </ul>
      </div>
    </section>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'app',
  computed: {
  },
  components: {
  }
}

</script>
<style lang="less">
@import "../../assets/style/pc_common.less";
@import "style/public";
.v-link-active {
}
</style>
