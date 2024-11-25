<template>
  <div class="empty-404-wrapper">
    404
  </div>
</template>

<script>
export default {
  name: 'Page404'
}
</script>

<style lang="scss" scoped>
.empty-404-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
.empty-404 {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
