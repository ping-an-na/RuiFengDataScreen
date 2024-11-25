<template>
  <div class="default-page">
    <img src="../../assets/imgs/zanwurenheneirong.png" alt="" width="800px">
    <div class="no-data-text">用户无相关权限或者平台未配置菜单</div>
  </div>
</template>

<script>
export default {
  name: 'Workbench',
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.default-page {
  padding-bottom: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .no-data-text {
    color: #666;
    margin-top: 20px;
  }
}
</style>
