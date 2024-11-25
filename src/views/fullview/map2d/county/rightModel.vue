<template>
  <div class="ri-con-ex">
    <div class="eachcombox">
      <div class="ara-con">
        <top-title-modle title="年度建设投资金额" top="-10px"/>
      </div>

      <div class="barechart">
        <line-chart ref="ndjstzje" :chart-data="yearBuildMoneySel"
                    v-if="projectYearTotalCapital.length > 0"></line-chart>
        <div v-else style="display: flex;justify-content: center;align-items: center;flex-flow: column;">
          <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 300px;position: relative;top: -50px"/>
          <div style="color: #FFF;position: relative;top: -150px;">暂无数据...</div>
        </div>
      </div>


      <!--      <top-title-modle title="平台活跃度" top="-10px"/>-->

      <div class="title">
        <!--          v-if="platformActivity.length > 0"-->
        <div class="pe-active-bg">
          近六个月
        </div>
        <span>平台活跃度</span>
      </div>
      <div class="barechart" style="position: relative;top: 45px;left: 10px">
        <line-chart ref="pthyd" :chart-data="ptActiveOption" v-if="platformActivity.length > 0"></line-chart>
        <div v-else style="display: flex;justify-content: center;align-items: center;flex-flow: column;">
          <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 300px;position: relative;top: -50px"/>
          <div style="color: #FFF;position: relative;top: -150px;">暂无数据...</div>
        </div>
      </div>


      <top-title-modle title="工序报审" top="75px" />
      <div class="n-bottom-guid" v-if="processApproval.length>0">
        <div class="zlsum">
          <div class="zlOne">总量</div>
          <div class="sumOne">{{ sum }}</div>
        </div>
        <pie-chart ref="gxbs" :chart-data="areaPieOption1"/>
      </div>
      <div v-else style="display: flex;justify-content: center;align-items: center;flex-flow: column;">
        <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 300px;position: relative;"/>
        <div style="color: #FFF;position: relative;top: -100px;">暂无数据...</div>
      </div>
    </div>
  </div>
</template>

<script>
import pieChart from '@/components/echarts/pieChart'
import LineChart from '@/components/echarts/lineChart.vue'

import {yearBuildMoneyOption, ptActive, barProjectOptionsSe2, setBarProjectOptionsSe2} from '../newEchartsOptions.js'
// import { yearBuildMoneyOption, ptActive, finishProject, jsdhoption } from './newEchartsOptions.js'

// import moduleSrv from '@/pages/pilot/api/allview'

export default {
  name: 'People',
  components: {
    pieChart,
    LineChart
  },
  props: {
    dataInfos: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      projectYearTotalCapital: [],// 1
      platformActivity: [], // 2
      processApproval: [], // 3
      areaPieOption1: {},
      yearBuildMoneySel: {},
      ptActiveOption: {},
      finishProjectOption: {}
    }
  },
  watch: {
    dataInfos: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          const {projectYearTotalCapital = [], platformActivity = [], processApproval = []} = val
          this.projectYearTotalCapital = projectYearTotalCapital
          this.platformActivity = platformActivity
          this.processApproval = processApproval
          const xdata = []
          const yearData = []
          projectYearTotalCapital?.map(item => {
            xdata.push(item.itemName)
            yearData.push({
              value: item.itemValue,
              itemStyle: {
                normal: {
                  color: '#fff' // 第二条线的颜色 #fff
                }
              }
            })
          })
          yearBuildMoneyOption.xAxis.data = xdata
          yearBuildMoneyOption.series[0].data = yearData
          this.yearBuildMoneySel = yearBuildMoneyOption

          const xActivedata = []
          const acData = []
          platformActivity &&
          platformActivity?.map(item => {
            xActivedata.push(item.itemName)
            acData.push(item.itemValue)
          })
          ptActive.xAxis.data = xActivedata
          ptActive.series[0].data = acData
          this.ptActiveOption = ptActive

          this.setOptions(processApproval)
        }
      }
    }
  },
  async created() {
  },
  mounted() {
    // this.yearBuildMoneySel = yearBuildMoneyOption
    // this.ptActiveOption = ptActive
    // this.finishProjectOption = finishProject
    // this.areaPieOption1 = barProjectOptionsSe2
  },
  destroyed() {
    // cearInterval(this.timeInterval)
  },
  methods: {
    timeOut() {

      let ndjstzje = this.$refs['ndjstzje']
      if (ndjstzje) ndjstzje.timeOut()

      let pthyd = this.$refs['pthyd']
      if (pthyd) pthyd.timeOut()
      //
      let gxbs = this.$refs['gxbs']
      if (gxbs) gxbs.timeOut()

    },
    setOptions(arr) {
      const data = arr.map(item => {
        return {
          name: item.itemName,
          value: item.itemValue
        }
      })
      // console.log(data, 'data??')
      const options = this.setOpt(data)
      this.areaPieOption1 = options
    },
    setOpt(data) {
      let sum = 0
      const optionData = []
      data.forEach(item => {
        sum += Number(item.value)
      })
      data.forEach(item => {
        optionData.push({
          value: item.value,
          name: item.name,
          name1: '条',
          labelLine: {
            normal: {
              length: 15
            }
          },
          label: {
            normal: {
              formatter: params => {
                return `{value|${params.value}}{name1|条}`
              },
              rich: {
                name1: {
                  fontSize: 14,
                  fontWeight: 'lighter',
                  color: '#FFFFFF'
                },
                value: {
                  fontSize: 14,
                  fontWeight: 'lighter',
                  color: '#FFFFFF'
                }
              }
            }
          }
        })
        // 配置一个空值
        optionData.push({
          value: sum / 100, // 控制每个环形之间的间隙
          name: '',
          itemStyle: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            color: 'rgba(0, 0, 0, 0)',
            borderColor: 'rgba(0, 0, 0, 0)',
            borderWidth: 0
          }
        })
      })
      // console.log(sum, data, optionData, 'sum, data, 111111111111')
      this.sum = sum
      const options = setBarProjectOptionsSe2(sum, data, optionData)
      return options
    }
  }
}
</script>

<style lang="scss" scoped>
.eachcombox {
  position: absolute;
  top: 0;
  width: 420px;
  height: calc(100%);
  z-index: 1;
  right: 20px;
  box-sizing: border-box;
  background: url('~@/assets/agriculture/jvxingkuang2x.png') top center no-repeat;
  background-size: 100% 100%;

  .ara-con {
    overflow: hidden;

    .title {
      width: calc(100% + 100px);
      margin-left: -50px;
    }
  }

  .title {
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

    span {
      font-family: Source Han Sans CN;
      font-weight: 800;
      font-size: 18px;
      color: #ffffff;
    }
  }

  .barechart {
    width: 100%;
    height: 200px;
  }

  .finishChartBar {
    width: 100%;
    height: 300px;
    margin-top: -10px;
  }

  .n-bottom-guid {
    width: 100%;
    height: 300px;
    margin-top: 95px;
    position: relative;
  }
}


.title {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 41px;
  text-align: center;
  background: url('~@/assets/agriculture/titleBg.png') center no-repeat;
  background-size: 100% 100%;
  font-family: Source Han Sans CN;
  font-weight: 800;
  font-size: 18px;
  color: #ffffff;
  margin-bottom: 16px;
  position: relative;
  z-index: 2;

  .pe-active-bg {
    background: url('~@/assets/agriculture/zu9_copy_3.png') top center no-repeat;
    background-size: 100% 100%;
    width: 89px;
    height: 31px;
    position: absolute;
    top: 65px;
    right: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    padding: 0;
  }

  span {
    font-family: Source Han Sans CN;
    font-weight: 800;
    font-size: 18px;
    color: #ffffff;
    padding-top: 5px;
  }
}

.zlsum {
  position: absolute;
  z-index: 10;
  width: 100px;
  top: 37%;
  left: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  transform: translateX(-50%);

  .zlOne {
    color: #acc5df;
    margin-bottom: 10px;
    font-size: 14px;
  }

  .sumOne {
    font-size: 28px;
    color: #edf6fc;
    text-shadow: #FFF 0px 0 20px;
    font-weight: 900;
  }
}

</style>
