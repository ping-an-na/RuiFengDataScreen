export default {
  data() {
    return {
      page: {
        pageSize: 11,
        pageNum: 1,
        total: 0
      }
    }
  },
  methods: {
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },
    handleCurrentChange(current) {
      this.page.pageNum = current
      this.resultList()
    },
    handleSizeChange(size) {
      this.page.pageSize = size
      this.resultList()
    }
  }
}
