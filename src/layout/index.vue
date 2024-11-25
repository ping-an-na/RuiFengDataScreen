<template>
  <div class="page-wrap">
    <div class="full-app">
      <transition name="fade-transform" mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>
<style scoped lang="scss">
.page-wrap {
  position: relative;
  height: 100%;
  .full-app {
    height: 100%;
  }
}

</style>
