<!--
 * @Description: 根据文本是否溢出控制是否显示tip
 * @Author: qiyongguo
 * @Date: 2022-02-25
-->
<template>
  <div
    class="text-over-tooltip-components"
    :class="{'text-over-tooltip-input-wrapper': inputDisable, 'add-padding-top': addPaddingTop}"
  >
    <c-tooltip
      :effect="effect"
      :disabled="isDisabledTooltip"
      :content="content"
      :placement="placement"
    >
      <div
        class="ellipsis"
        :class="{className: className, 'input-disable': inputDisable}"
        @mouseover="onMouseOver(refName)"
      >
        <span :ref="refName">{{ content }}</span>
      </div>
    </c-tooltip>
  </div>
</template>

<script>
export default {
  name: 'TextOverTooltip',
  props: {
    // 是否显示模仿 input 的 disable 样式
    inputDisable: {
      type: Boolean,
      default: false
    },
    // 增加padding
    addPaddingTop: {
      type: Boolean,
      default: false
    },
    // 显示的文字内容
    content: {
      type: String,
      default: ''
    },
    // 设置父元素的样式：比如宽度字体等，需可以自己在组件内部配置样式比如字体大小20：fs20
    className: {
      type: String,
      default: ''
    },
    // 子元素标识（如在同一页面中调用多次组件，此参数不可重复）
    refName: {
      type: String,
      default: ''
    },
    // 默认提供的主题 dark/light
    effect: {
      type: String,
      default: () => {
        return 'dark'
      }
    },
    // Tooltip 的出现位置top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end
    placement: {
      type: String,
      default: () => {
        return 'top'
      }
    }
  },
  data() {
    return {
      isDisabledTooltip: true // 是否需要禁止提示
    }
  },
  methods: {
    // 移入事件: 判断内容的宽度contentWidth是否大于父级的宽度
    onMouseOver(str) {
      if (!this.$refs[str]) return
      const parentWidth = this.$refs[str].parentNode.offsetWidth
      const contentWidth = this.$refs[str].offsetWidth
      // 判断是否禁用tooltip功能
      this.isDisabledTooltip = this.inputDisable ? contentWidth <= parentWidth - 16 : contentWidth <= parentWidth
    }
  }
}
</script>

<style lang="scss" scoped>
.text-over-tooltip-components{
  /* 文字超出宽度显示省略号 单行 */
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 20px;
  }
  .input-disable {
    display: inline-block;
    width: 100%;
    border: 1px solid #E4E7ED;
    background-color: #F8F8F8;
    color: #C0C4CC;
    height: 32px;
    line-height: 32px;
    padding: 0 8px;
    font-size: inherit;
    border-radius: 2px;
    cursor: not-allowed;
  }
}
.text-over-tooltip-input-wrapper {
  display: inline-block;
  box-sizing: border-box;
  width: 100%;
  font-size: 13px;
}
.add-padding-top {
  padding-top: 2px;
}
</style>
