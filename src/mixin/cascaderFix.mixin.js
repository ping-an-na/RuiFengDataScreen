export default {
  methods: {
    visibleChange(_val) {
      this.$nextTick(() => {
        // 解决多次渲染界面卡死问题
        const $el = document.querySelectorAll('.c-cascader-panel .c-cascader-node[aria-owns]')
        Array.from($el).map((item) => item.removeAttribute('aria-owns'))
      })
    },
    // 单击节点进行单选
    elCascaderOnlick() {
      const that = this
      setTimeout(function() {
        document.querySelectorAll('.c-cascader-node__label').forEach((el) => {
          el.onclick = function() {
            this.previousElementSibling?.click()
            that.$refs.elcascaderRef.dropDownVisible = false
          }
        })
      }, 100)
    }
  }
}
