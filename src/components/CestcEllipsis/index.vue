<template>
  <c-tooltip :content="content" :effect="effect" :placement="placement" overlay-class-name="bgc_tooltip">
    <div ref="ellRef" class="ellipsis" :style="{ '-webkit-line-clamp': clamp }">
      {{ content }}
    </div>
  </c-tooltip>
</template>

<script lang="ts">

export default {
  name: 'CEllipsis',
  props: {
    clamp: {
      type: Number,
      default: 1
    },
    content: {
      type: String,
      default: ''
    },
    placement: {
      type: String,
      default: 'top'
    },
    effect: {
      type: String,
      default: 'dark'
    }
  },
  computed: {}
}
</script>

<style lang="scss" scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-break: break-all;
  white-space: normal;
}
</style>
