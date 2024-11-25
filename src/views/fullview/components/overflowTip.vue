<!--
 * @Description:
 * @Author: qiyongguo
 * @Date: 2022-01-21
-->
<template>
  <div class="text-tooltip">
    <c-tooltip class="item" effect="dark" :disabled="isShowTooltip" :content="content" placement="top">
      <p class="over-flow" :class="className" @mouseover="onMouseOver(refName)">
        <span v-if="!$slots.cusContent" :ref="refName">{{ content||'-' }}</span>
        <span v-else :ref="refName"><slot name="cusContent"></slot></span>
      </p>
    </c-tooltip>
  </div>
</template>

<script>
export default {
  name: 'TextTooltip',
  props: {
    // 显示的文字内容
    content: {
      type: String,
      default: () => {
        return ''
      }
    },
    // 外层框的样式，在传入的这个类名中设置文字显示的宽度
    className: {
      type: String,
      default: () => {
        return ''
      }
    },
    // 为页面文字标识（如在同一页面中调用多次组件，此参数不可重复）
    refName: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      isShowTooltip: true
    }
  },
  methods: {
    onMouseOver(str) {
      const parentWidth = this.$refs[str].parentNode.offsetWidth
      const contentWidth = this.$refs[str].offsetWidth + 3 // +3临时解决 恰好宽度正好情况
      // 判断是否开启tooltip功能
      if (contentWidth > parentWidth) {
        this.isShowTooltip = false
      } else {
        this.isShowTooltip = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.over-flow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 18px;
}
.wid190 {
    width: 100%;
}
p{
    margin: 0;
}
</style>
