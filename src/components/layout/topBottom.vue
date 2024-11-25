<!--
 * @description top-bottom 布局
 * @date 2021-12-10
 * @author lism
-->
<template>
  <fixed-page
    class="fixed-2-layout"
    :footer-height="76"
    no-footer-padding
    foot-positon="left"
  >
    <div class="content-container">
      <slot name="content" />
    </div>
    <template v-slot:footer>
      <slot name="footer" />
    </template>
  </fixed-page>
</template>
<script>
export default {
  name: 'Fixed2Layout',
  props: {},
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss">
.fixed-2-layout {
  height: 100%;
  width: 100%;
  .content-container {
    height: 100%;
    overflow-y: auto;
  }
  .fixed-page-footer {
    box-shadow: 0px -2px 7px 0px rgba(0, 0, 0, 0.06);
    display: flex;
  }
}
</style>
