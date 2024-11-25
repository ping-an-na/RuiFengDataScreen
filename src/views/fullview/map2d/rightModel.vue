<template>
  <div class="ri-con-ex">
    <div class="eachcombox"
         style="display: flex;justify-content: center;align-items: center;flex-flow: column;overflow: hidden">

      <div style="width: 100%;height: 32%;padding: 0">
        <div class="ara-con">
          <div class="title">
            <span>年度建设投资金额</span>
          </div>
        </div>
        <div class="barechart" v-if="projectYearTotalCapital.length > 0">
          <line-chart ref="ndjstzje" :chart-data="yearBuildMoneySel"></line-chart>
        </div>
        <div v-else
             style="display: flex;justify-content: center;align-items: center;flex-flow: column;height: 100%;width: 100%;">
          <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 300px;position: relative;"/>
          <div style="color: #FFF;position: relative;top: -100px;">暂无数据...</div>
        </div>
      </div>


      <div style="width: 100%;height: 32%;;padding: 0">
        <div class="title">
<!--          v-if="platformActivity.length > 0"-->
          <div class="pe-active-bg" >
            近六个月
          </div>
          <span>平台活跃度</span>
        </div>

        <div class="barechart" v-if="platformActivity.length > 0">
          <line-chart ref="pthyd" :chart-data="ptActiveOption"></line-chart>
        </div>

        <div v-else
             style="display: flex;justify-content: center;align-items: center;flex-flow: column;height: 100%;width: 100%;">
          <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 300px;position: relative;"/>
          <div style="color: #FFF;position: relative;top: -100px;">暂无数据...</div>
        </div>
      </div>

      <div style="width: 100%;height: 36%;;padding: 0">
        <div class="title">
          <span>项目竣工数</span>
        </div>


        <div class="finishChartBar">


          <vue-seamless-scroll :data="EchartsFinishProjectOption" style="height: 300px;overflow: hidden;"
                               v-if="projectCompletion.length > 0" :class-option="classOption">
            <!--            <div class="bar-container-fin" v-for="(item,index) in EchartsFinishProjectOption">-->
            <!--              <line-chart ref="xmjgs" :chart-data="item" ></line-chart>-->
            <!--            </div>-->
            <!--            <div class="bar-container-fin" >-->
            <!--              <line-chart ref="xmjgs" :chart-data="finishProjectOption" chartIdFu="lineChart"></line-chart>-->
            <!--            </div>-->
            <div v-for="item in projectCompletion"
                 style="display: flex;color: #FFF;width: 100%; height: 70px;align-items: center">
              <div class="bgKing">{{ item.itemName }}</div>
              <div style="width: 100%;flex: 1;margin-right: 10px;position: relative;top: 12px;">
                <el-progress :percentage="item.totalAll" color="#f7be72" :show-text="false"></el-progress>
                <div style="color:#64AFCB;position:absolute;right: 10px;top: 12px;">
                  {{ item.itemValue }}/{{ item.total }}
                </div>
              </div>
            </div>
          </vue-seamless-scroll>
          <div v-else
               style="display: flex;justify-content: center;align-items: center;flex-flow: column;height: 100%;width: 100%;">
            <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 300px;position: relative;"/>
            <div style="color: #FFF;position: relative;top: -100px;">暂无数据...</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import LineChart from '@/components/echarts/lineChart.vue'
import {yearBuildMoneyOption, ptActive, finishProject, jsdhoption} from './newEchartsOptions.js'
import _ from 'lodash'

const yLabelImage = require('@/assets/agriculture/diqvbeijing.png')

export default {
  name: 'People',
  components: {
    LineChart
  },
  // mixins: [scientificDecisionMixin],
  props: {
    dataInfos: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      yLabelImage,
      classOption: {
        step: 0.4
      },
      yearBuildMoneySel: {},
      ptActiveOption: {},
      finishProjectOption: {},
      projectYearTotalCapital: [], //1
      platformActivity: [], // 2
      projectCompletion: [], // 3
      echartsData: null,
      EchartsFinishProjectOption: [],
    }
  },
  mounted() {
  },
  watch: {
    dataInfos: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.echartsData = _.cloneDeep(finishProject)
          // console.log(_,'________')
          const {projectYearTotalCapital = [], platformActivity = [], projectCompletion = []} = val

          this.projectYearTotalCapital = projectYearTotalCapital // 1
          this.platformActivity = platformActivity // 2
          this.projectCompletion = projectCompletion.map(res => {
            return {
              ...res,
              totalAll: res.itemValue == "0" ? 0 : ((res.itemValue / res.total) * 100).toFixed(1) - 0
            }
            //
          }) // 3
          // console.log(this.projectCompletion, 'projectCompletion[]')

          // if(projectYearTotalCapital.length >0){
          //   setTimeout(()=>{
          //
          //   })
          // }


          // setTimeout(()=>{
          //   var myElement = document.getElementById('finbarId')
          //   if (myElement){
          //     if (projectCompletion.length <= 4) {
          //       myElement.style.height = '260px'
          //     } else if (projectCompletion.length <= 10) {
          //       myElement.style.height = '600px'
          //     } else if (projectCompletion.length <= 20) {
          //       myElement.style.height = '800px'
          //     } else {
          //       myElement.style.height = '1000px'
          //     }
          //   }
          // })


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
          platformActivity && platformActivity?.map(item => {
            xActivedata.push(item.itemName)
            acData.push(item.itemValue)
          })
          ptActive.xAxis.data = xActivedata
          ptActive.series[0].data = acData

          ptActive.series[1].data = acData.map((item, index) => {
            return {
              coords: [[index, 0], [index, item - 5]]
            };
          })

          this.ptActiveOption = ptActive

          // 项目竣工数
          let proSum = 0
          projectCompletion?.forEach(item => {
            proSum += Number(item.total)
          })
          const totalList = []
          const rankList = []
          const compleList = []
          const nameCompleList = []

          projectCompletion?.map(item => {
            rankList.push(1)
            compleList.push(item.itemValue)
            nameCompleList.push(item.itemName)
            totalList.push(proSum)
          })

          finishProject.yAxis[0].data = rankList
          finishProject.yAxis[0].axisLabel.formatter = function (value, index) {
            return '{' + value + '|' + nameCompleList[index] + '}'
          }
          finishProject.yAxis[1].axisLabel.formatter = function (value, index) {
            return projectCompletion[index].itemValue + '/ ' + projectCompletion[index].total
          }
          finishProject.yAxis[1].data = rankList
          finishProject.series[0].data = compleList
          finishProject.series[1].data = totalList
          this.finishProjectOption = finishProject

          // return

          // console.log(this.echartsData, 'this.echartsDatathis.echartsData')

          let EchartsFinishProjectOption = []

          projectCompletion?.map(item => {
            let finishProjectA = _.cloneDeep(this.echartsData)
            const totalList = [proSum]
            const rankList = [1]
            const compleList = [item.itemValue]
            const nameCompleList = [item.itemName]

            finishProjectA.yAxis[0].data = rankList
            finishProjectA.yAxis[0].axisLabel.formatter = function (value, index) {
              return '{' + value + '|' + nameCompleList[index] + '}'
            }
            finishProjectA.yAxis[1].axisLabel.formatter = function (value, index) {
              return projectCompletion[index].itemValue + '/ ' + projectCompletion[index].total
            }
            finishProjectA.yAxis[1].data = rankList
            finishProjectA.series[0].data = compleList
            finishProjectA.series[1].data = totalList
            EchartsFinishProjectOption.push(finishProjectA)
          })

          this.EchartsFinishProjectOption = EchartsFinishProjectOption


        }
      }
    }
  },
  async created() {
  },
  destroyed() {
  },
  methods: {
    timeOut() {
      let ndjstzje = this.$refs['ndjstzje']
      if (ndjstzje) ndjstzje.timeOut()
      //
      let pthyd = this.$refs['pthyd']
      if (pthyd) pthyd.timeOut()
      //
      let xmjgs = this.$refs['xmjgs']
      if (xmjgs) {
        xmjgs.forEach(res => {
          res.timeOut()
        })
      }

    },
  }

}
</script>

<style lang="scss" scoped>
.eachcombox {
  padding: 0;
  position: absolute;
  top: 0;
  width: 420px;
  height: calc(100% - 3px);
  z-index: 1;
  right: 20px;
  box-sizing: border-box;
  //background: url('~@/assets/agriculture/jvxingkuang2x.png') center no-repeat;
  background: url('~@/views/fullview/map2d/img/leftJvxingk.png') top center no-repeat;
  background-size: 100% 100%;

  .ara-con {
    overflow: hidden;
    padding: 0;
    position: relative;
    top: -8px;

    .title {
      //width: calc(100% + 100px);
      //margin-left: -50px;
    }
  }

  .title {
    //padding: 0;
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
    //line-height: 53px;
    //margin-bottom: 28px;
    margin-bottom: 16px;
    position: relative;
    z-index: 2;

    .pe-active-bg {
      background: url('~@/assets/agriculture/zu9_copy_3.png') top center no-repeat;
      background-size: 100% 100%;
      width: 89px;
      height: 31px;
      position: absolute;
      top: 45px;
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

  .barechart {
    width: 100%;
    height: calc(100% - 45px);

  }

  .finishChartBar {
    width: 100%;
    overflow-x: hidden;
    //height: calc(100% - 630px);
    height: 100%;
    margin-top: -10px;
    overflow-y: auto;

    .bar-container-fin {
      height: 60px;
      position: relative;
      left: -5px;
    }
  }
}

.bgKing {
  background: url('~@/assets/agriculture/diqvbeijing.png') center no-repeat;
  background-size: cover;
  background-size: 80% 80%;
  margin: 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  font-size: 16px;
}

::v-deep {
  .el-progress-bar__outer {
    background: #1d2236;
  }
}
</style>
