<template>
  <div class="external-pgae-container">
    <iframe
      v-if="showFrame"
      :src="externalPath"
      class="frame"
      frameborder="0"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      externalPath: '',
      showFrame: false
    }
  },
  created() {
    const path = this.$route?.meta?.externalPath || ''
    this.showFrame = !!path
    if (path.includes('?')) {
      this.externalPath = `${path}&token=${localStorage.getItem('token')}`
    } else {
      this.externalPath = `${path}?token=${localStorage.getItem('token')}`
    }
  }
}
</script>

<style scoped lang="scss">
.external-pgae-container {
  height: 100%;
  width: 100%;
  .frame {
    height: 100%;
    width: 100%;
  }
}
</style>
