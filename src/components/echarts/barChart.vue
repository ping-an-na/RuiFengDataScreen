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
import echarts from './common'
import echartsMixin from './echartsMixin'
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart } from 'echarts/charts'
echarts.use([BarChart])

export default {
  mixins: [echartsMixin]
}
</script>
