/**
 * @Description:
 * @Author: qiyongguo
 * @Date: 2022-01-04
 */
export default {
  methods: {
    getDictValue(dictId, key) {
      if (!key || !dictId) return '-'
      const obj = this.$store.getters.oneToNdicts.find(item => `${item.key}` === `${dictId}`) || {}
      return ((obj.childList || []).find(item => `${item.key}` === `${key}`) || {}).value || ''
    },
    getDictOpts(dictId) {
      const obj = this.$store.getters.oneToNdicts.find(item => `${item.key}` === `${dictId}`) || {}
      return obj.childList || []
    }
  }
}
