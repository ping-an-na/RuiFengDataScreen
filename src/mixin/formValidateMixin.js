export default {
  methods: {
    // 表单校验
    checkForm(formName) {
      return new Promise((resolve, reject) => {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            resolve()
          } else {
            reject()
          }
        })
      })
    }
  }
}
