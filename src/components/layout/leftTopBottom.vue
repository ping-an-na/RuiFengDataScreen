<!--
 * @description left - top - bottom 布局
 * @date 2021-12-06
 * @author lism
-->
<template>
  <div class="fixed-3-layout">
    <div v-if="sidebar" class="fixed-sidebar" :style="sidebarStyle">
      <slot name="sidebar" />
    </div>
    <div class="fixed-right" :style="rightStyle">
      <fixed-page>
        <template v-slot:header>
          <slot name="search" />
        </template>
        <slot name="content" />
        <template v-slot:footer>
          <slot name="footer" />
        </template>
      </fixed-page>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Fixed3Layout',
  props: {
    gutter: {
      type: Number,
      default: 8
    },
    sidebar: {
      type: Boolean,
      default: () => true
    },
    sideBarWidth: {
      type: String,
      default: '272px'
    },
    backgroundColor: {
      type: String,
      default: '#fff'
    }
  },
  data() {
    return {}
  },
  computed: {
    sidebarStyle() {
      return {
        width: this.sideBarWidth,
        backgroundColor: this.backgroundColor
      }
    },
    rightStyle() {
      // 有左边 sidebar 的时候
      const style = {}
      if (this.sidebar) {
        style.marginLeft = `${this.gutter}px`
      }
      return style
    }
  }
}
</script>

<style lang="scss">
.fixed-3-layout {
  height: 100%;
  width: 100%;
  display: flex;
  .fixed-sidebar {
    background: #fff;
    padding: 16px;
    min-height: 100%;
    height: auto;
  }
  .fixed-right {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
}
</style>
