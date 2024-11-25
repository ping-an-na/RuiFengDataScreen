export default {
  filters: {
    filterEmpty(val) {
      return [undefined, null, ''].includes(val) ? '-' : val
    },
    changeNumToStr(num) {
      if (num === undefined || num === null) {
        return '-'
      } else {
        const useNum = Number(num)
        return useNum.toLocaleString()
      }
    }
  },
  data() {
    return {}
  },
  methods: {}
}
