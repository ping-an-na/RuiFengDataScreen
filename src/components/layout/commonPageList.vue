<!--
 * @Description:
 * @Author: qiyongguo
 * @Date: 2022-02-15
-->
<template>
  <div ref="commonList" class="common-page-list">
    <div v-if="$slots.tree" ref="tree" class="left-tree">
      <slot name="tree" />
    </div>
    <div class="right" :style="{width: contentWidth, overflow: 'hidden'}">
      <div
        v-show="$slots.search"
        id="searchSection"
        ref="searchRef"
        :class="['search-section', {'has-top-border': hasTopBorder}]"
        :style="{'margin-bottom': searchBottom + 'px','margin-left': searchLeft + 'px'}"
      >
        <slot name="search" />
      </div>
      <div id="listSection" ref="listSection" class="list-section" :style="contentStyle">
        <slot name="content" />
      </div>
      <div v-if="hasFooter" id="listFooter" ref="foot" class="foot-page" :style="footerStyle">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script>
import elementResizeDetectorMaker from 'element-resize-detector'
export default {
  name: 'CommonPageList',
  props: {
    hasFooter: {
      type: Boolean,
      default: true
    },
    hasTopBorder: {
      type: Boolean,
      default: true
    },
    searchBottom: {
      type: Number,
      default: 0
    },
    searchLeft: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      contentHeight: 'calc(100% - 92px)',
      contentWidth: '100%'
    }
  },
  computed: {
    hasTree() {
      try {
        return this.$slots.tree.length
      } catch (error) {
        return false
      }
    },
    contentStyle() {
      return {
        height: this.contentHeight,
        'margin-left': this.hasTree ? '20px' : ''
      }
    },
    footerStyle() {
      return {
        'margin-left': this.hasTree ? '20px' : ''
      }
    }
  },
  watch: {
    hasFooter() {
      this.$nextTick(() => {
        this.calcHeight()
      })
    }
  },
  async mounted() {
    await this.$nextTick()
    const erd = elementResizeDetectorMaker()
    // 监听搜索栏的高度调整content的高度
    erd.listenTo(document.getElementById('searchSection'), () => {
      this.calcHeight()
    })
    // 内容区需要确定的宽度，不然表格的固定不生效
    if (this.$slots.tree) {
      const _treeWidth = this.$refs.tree.offsetWidth
      if (_treeWidth) {
        this.contentWidth = `calc(100% - ${_treeWidth}px)`
      }
    }
    if (!this.$slots.search) {
      this.calcHeight()
    }
  },
  methods: {
    async calcHeight() {
      await this.$nextTick()
      const sheight = this.$refs.searchRef.offsetHeight// 搜索栏的高度
      let contentHeight = this.$refs.commonList.offsetHeight
      if (sheight) {
        contentHeight = contentHeight - sheight - this.searchBottom
      }
      if (this.$refs.foot) {
        contentHeight -= ((this.$refs.foot && this.$refs.foot.offsetHeight) || 0)
      }
      // 设置给一个最小高度
      this.contentHeight = contentHeight > 100 ? `${contentHeight}px` : '100px'
    }
  }
}
</script>

<style lang="scss" scoped>
.common-page-list {
  height: 100%;
  display: flex;
  .left-tree {
    width: 272px;
    padding: 23px 14px 14px 12px;
    overflow-y: auto;
    background: #F9FAFE;
    ::v-deep {
      .cestc-tree, .el-tree {
        background: transparent;
      }
    }
  }
  .right {
    flex: 1;
  }
  .search-section {
    background: #ffffff;
    &.has-top-border {
      border-top: 1px solid #36a4ff;
    }
  }
  .list-section {
    .result-content {
      display: flex;
      flex-direction: column;
      .result-list {
        flex: 1;
      }
    }
  }
  .foot-page {
    height: 64px;
    background: #ffffff;
    display: flex;
    align-items: center;
    padding-right: 20px;
  }
}
</style>
