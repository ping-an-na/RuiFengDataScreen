<template>
  <div class="title" :style="top?'top:'+top:''">
    <span>{{ title }}</span>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: 'title'
    },
    top: {
      type: String,
      default: ''
    },
  }
}
</script>
<style scoped lang="scss">
.title {
  display: block !important;
  width: 100%;
  height: 41px;
  text-align: center;
  background: url('~@/assets/agriculture/titleBg.png') top center no-repeat;
  background-size: 100% 100%;
  font-family: Source Han Sans CN;
  font-weight: 800;
  font-size: 18px;
  color: #ffffff;
  line-height: 53px;
  margin-bottom: 28px;
  position: relative;
  z-index: 2;
  top: -29px;

  span {
    font-family: Source Han Sans CN;
    font-weight: 800;
    font-size: 18px;
    color: #ffffff;
  }
}
</style>
