<template>
  <div :class="`pic-btn ${eyeOpen ? 'pic-btn-eye-open' : 'pic-btn-eye-close'}`" @click="toggleEye">
  </div>
</template>

<script>
export default {
  name: 'ShzlFullviewEyeBtn',

  computed: {
    eyeOpen() {
      return this.$store.getters['grid/eyeOpen']
    }
  },

  methods: {
    toggleEye() {
      this.$store.dispatch('grid/setEye', !this.eyeOpen)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
