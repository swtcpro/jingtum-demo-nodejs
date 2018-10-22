<template>
  <figure class="ps__preview_figure">
    <a :href="src" :data-size="size" class="figure_cell_a">
      <img :class="imgClassName" @load="handleLoadSuccess($event)" :src="src">
    </a>
  </figure>
</template>
<script>
  export default {
    name: 'imageCell',
    props: {
      src: {
        type: String,
        default: ''
      },
      imgClassName: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        size: '500x500'
      }
    },
    created() {
    },
    methods: {
      handleLoadSuccess(e) {
        let _self = this;
        let size = e.currentTarget.naturalWidth + 'x' + e.currentTarget.naturalHeight;
        _self.size = size;
      }
    }

  }
</script>
<style scoped>
  .ps__preview_figure .figure_cell_a{
    width: 100%;
    height: 100%;
  }
</style>
