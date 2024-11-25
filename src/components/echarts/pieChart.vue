<template>
  <div v-loading="loading" cestc-loading-background="rgba(0, 212, 255, 0.35)"
       cestc-loading-text="图表加载中" :style="{ height: height, width: width }">
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
import { PieChart } from 'echarts/charts'
echarts.use([PieChart])

export default {
  mixins: [echartsMixin]
}
</script>
