<template>
  <div class="container">
    <section class="page-header">
      <div class="logo">
        <router-link :to="'/home'">
          <img src="../../assets/images/logo.png" alt="logo" class="logo-img" title="首页">
        </router-link>
      </div>
      <div class="title">数据上链演示系统</div>
    </section>
    <transition name="fade" mode="out-in">
      <router-view keep-alive></router-view>
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
@import "../../assets/style/likr.less";
@import "style/public";
.v-link-active {
  color: #f66 !important;
}
html,body{
  background-color: #f9f9f9;
}
</style>
