<template>
  <div class="preview__gallery_group" data-pswp-uid="1">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'imagePreview',
    props: {
    },
    data() {
      return {
      }
    },
    created() {
      let _self = this;
      _self.$nextTick(function () {
        _self.$initPhotoSwipeFromDOM('.preview__gallery_group');
      })
    }
  }
</script>
<style scoped>
</style>
