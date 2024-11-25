<!--
 * @Description:词云图
 * @Author: qiyongguo
 * @Date: 2022-03-24
-->
<template>
  <div v-loading="loading" :style="{ height: height, width: width }">
    <div
      :id="chartId"
      :class="className"
      :style="{ height: height, width: width }"
    />
  </div>
</template>
<script>
import echartsMixin from './echartsMixin'
import 'echarts-wordcloud'

export default {
  mixins: [echartsMixin]
}
</script>
