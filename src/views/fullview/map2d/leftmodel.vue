<template>
  <div class="eachcombox">
    <div v-loading="loading" class="contentbox"
         style="display: flex;justify-content: center;align-items: center;flex-flow: column;overflow: hidden">
      <div style="width: 100%;height: 27%;padding: 0">
        <div class="title" style="position: relative;top: -8px;">
          <span>项目建设情况</span>
        </div>
        <div class="termbox">
          <div class="btmbox" v-if="buildList.length > 0">
            <div class="eh" v-for="(item, index) in buildList" :key="index">
              <div class="tx" v-if="buildListUUID">
                <div class="name" style="font-style:oblique">
                  <!--                  {{ item.itemValue }}-->
                  <template v-for="(i,x) in [item.itemValue]">
                    <animate-number ref="myNum" :from="0" :to="i"
                                    mode="manual" duration="1000"></animate-number>
                  </template>

                  <span style="font-size: 12px;">个</span>
                </div>
                <div class="num">{{ item.itemName }}</div>
              </div>
            </div>
          </div>
          <div v-else
               style="display: flex;justify-content: center;align-items: center;flex-flow: column;height: 100%;width: 100%;">
            <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 300px;position: relative;"/>
            <div style="color: #FFF;position: relative;top: -100px;">暂无数据...</div>
          </div>

        </div>
      </div>


      <div style="width: 100%;height: 41%;padding: 0">
        <div class="title">
          <span>项目分类统计</span>
        </div>

        <div class="barechart" v-if="projectClassification.length > 0">
          <line-chart ref="tjfl" :chart-data="gridLineChart"></line-chart>
        </div>
        <div class="peichart" v-if="projectClassification.length > 0">
          <div class="all-money">总金额</div>
          <pie-chart ref="tjflZje" :chart-data="areaPieOption"/>
        </div>

        <div v-else
             style="display: flex;justify-content: center;align-items: center;flex-flow: column;height: 100%;width: 100%;">
          <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 300px;position: relative;"/>
          <div style="color: #FFF;position: relative;top: -100px;">暂无数据...</div>
        </div>

      </div>


      <div style="width: 100%;height: 32%;padding: 0">
        <div class="ara-con">
          <div class="title">
            <span>农田建设分类面积</span>
          </div>
        </div>

        <div class="arealinChart" v-if="JSON.stringify(farmlandClassification) !== '{}'">
          <div class="lin-cha-un">
            <div class="unt">单位：万亩</div>
            <div class="unt-img"></div>
            <div v-for="(item, index) in lincharList" :key="index" class="lin-cha-sm">
              <div :class="`col-li-${index}`"></div>
              <div>{{ item.name }}</div>
            </div>
          </div>
          <line-chart ref="ntjsflmj" :chart-data="areaLineOption" style="margin-left: 20px;"></line-chart>
        </div>
        <div v-else
             style="display: flex;justify-content: center;align-items: center;flex-flow: column;height: 100%;width: 100%;">
          <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 300px;position: relative;"/>
          <div style="color: #FFF;position: relative;top: -100px;">暂无数据...</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import LineChart from '@/components/echarts/lineChart'
import pieChart from '@/components/echarts/pieChart'

import barChart from '@/components/echarts/barChart'
import {rankBarChartOption, barProjectOptions, colorList, setAreaOption} from './newEchartsOptions.js'
// import { useTeamgcEchartsOption } from './echartsOptions.js'
// import moduleSrv from '@/pages/pilot/chartDataapi/allview'
// import scientificDecisionMixin from '@/pages/pilot/mixin/scientificDecisionMixin'
export default {
  name: 'Grid',
  components: {
    barChart,
    LineChart,
    pieChart
  },
  // mixins: [scientificDecisionMixin],
  props: {
    dataInfos: {
      type: Object,
      default: () => {
        return {}

        // {
        //   projectConstruction: []//项目建设情况
        // }
        // 看板数据
      }
    }
  },
  data() {
    return {
      projectClassification: [],
      farmlandClassification: {},
      buildListUUID: true,
      sums: 0,
      serverData: {},
      loading: false,
      teamgcOption: {},
      gridLineChart: {},
      areaPieOption: {},
      areaLineOption: {},
      buildList: [],
      lincharList: [
        {name: '基础建设', color: ''},
        {name: '高效节水', color: ''},
        {name: '改造提升', color: ''}
      ]
    }
  },
  watch: {
    dataInfos: {
      deep: true,
      immediate: true,
      handler(val) {
        // console.log(val, 'dataInfos')
        if (val) {
          const {
            projectConstruction = [],
            projectClassification = [],
            projectClassificationTotalCapital,
            farmlandClassification = {},
          } = val
          this.projectClassification = projectClassification // 项目分类统计
          this.farmlandClassification = farmlandClassification
          // console.log(projectConstruction, 'projectConstruction')
          this.buildList = projectConstruction

          //项目分类统计
          this.getAnalysisData(projectClassification, projectClassificationTotalCapital)
          this.bieAnalysis(projectClassification, projectClassificationTotalCapital)

          //农田建设分类
          this.getFarmland(farmlandClassification || {})

          // const { basicsArea = 0, irrigatedArea = 0, liftingArea = 0 } = farmlandClassification
          // const sums = basicsArea + irrigatedArea + liftingArea

          this.buildListUUID = false
          setTimeout(() => {
            this.buildListUUID = true
            setTimeout(() => {
              let myNum = this.$refs['myNum']
              if (myNum) myNum.forEach(res => {
                res.start()
              })
            })
          },)

        }
      }
    }
  },
  async created() {
  },
  mounted() {
    const list = [
      {
        deptName: 'sddf',
        fullGridManNum: '12222ad',
        partGridManNum: 12,
        gridLengthNum: 23
      },
      {
        deptName: 'sddf',
        fullGridManNum: '12222ad',
        partGridManNum: 12,
        gridLengthNum: 23
      }
    ]
    // this.drawechartsFn(list)
    // this.areaPieOption = barProjectOptions
    // this.getAnalysisData([], 0)

    // this.areaLineOption = areaOption
  },
  destroyed() {
    // clearInterval(this.timeInterval)
  },
  methods: {
    formatter: function (num) {
      return num.toFixed(2)
    },
    timeOut() {

      let myNum = this.$refs['myNum']
      if (myNum) myNum.forEach(res => {
        res.start()
      })

      let tjfl = this.$refs['tjfl']
      if (tjfl) tjfl.timeOut()

      let tjflZje = this.$refs['tjflZje']
      if (tjflZje) tjflZje.timeOut()

      let ntjsflmj = this.$refs['ntjsflmj']
      if (ntjsflmj) ntjsflmj.timeOut()

    },
    getFarmland(obj) {
      const {basicsArea = 0, irrigatedArea = 0, liftingArea = 0} = obj
      // console.log(basicsArea, irrigatedArea, liftingArea, ',,,')
      const sums = basicsArea + irrigatedArea + liftingArea

      var dataList = [
        {name: '基础建设', value: basicsArea, max: sums, color: '#fba980'},
        {name: '高效节水', value: irrigatedArea, max: sums, color: '#66a6ff'},
        {name: '改造提升', value: liftingArea, max: sums, color: '#aeffae'}
      ]

      const options = setAreaOption(dataList, sums)
      this.sums = sums
      // console.log(options, 'options-charts')
      this.areaLineOption = options
    },
    async getAnalysisData(arr, total) {
      // console.log(arr,'arrarr')
      if (arr.length > 0) {
        const yData = []
        const xData = []
        const percentData = []
        const totalList = []
        let sum = 0
        arr.forEach(item => {
          sum += Number(item.classificationNum)
        })
        arr.map(item => {
          percentData.push(((item / sum) * 100).toFixed(2))
          xData.push(item.classificationName)
          yData.push(item.classificationNum)
          totalList.push(sum)
        })

        rankBarChartOption.yAxis[0].data = xData
        rankBarChartOption.yAxis[1].data = yData
        rankBarChartOption.series[1].data = yData
        rankBarChartOption.series[0].data = totalList
        rankBarChartOption.xAxis.max = sum
        rankBarChartOption.series[2].data = yData.map((item, index) => {
          return {
            coords: [
              [0, index],
              [item, index]
            ]
          };
        })

      } else {
        rankBarChartOption.yAxis[0].data = []
        rankBarChartOption.yAxis[1].data = []

        rankBarChartOption.series[0].data = []
        rankBarChartOption.series[1].data = []
        rankBarChartOption.series[2].data = []
      }
      this.gridLineChart = rankBarChartOption
      // this.areaPieOption = barProjectOptions
    },
    bieAnalysis(arr, total) {

      arr.forEach(res => {
        res.classificationMoney = res.classificationMoney ? res.classificationMoney.toFixed(2) - 0 : 0
      })
      total = total ? total.toFixed(2) - 0 : 0


      // console.log(arr, total, 'arr, total')
      const optionData = []
      const data = []
      arr.forEach(item => {
        data.push({
          value: item.classificationMoney,
          name: item.classificationName
        })
        optionData.push({
          value: item.classificationMoney,
          name: item.classificationName,
          labelLine: {
            normal: {
              length: 15
            }
          },
          label: {
            normal: {
              formatter: params => {
                return '{value|' + params.value + '万元}'
              },
              // padding: [0, -100, 25, -100],
              rich: {
                value: {
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#fff'
                }
              }
            }
          }
        })

        // 配置一个空值
        optionData.push({
          value: total / 100, // 控制每个环形之间的间隙
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

      if ((total - 0) > 10000) {
        barProjectOptions.title.text = (total / 10000).toFixed(2)
        barProjectOptions.title.subtext = '亿元'
      } else {
        barProjectOptions.title.text = (total).toFixed(2)
        barProjectOptions.title.subtext = '万元'
      }

      // barProjectOptions.title.text = total
      barProjectOptions.series[0].data = optionData
      barProjectOptions.series[1].data = optionData
      barProjectOptions.legend.data = data.map((dItem, dIndex) => {
        return {
          ...dItem,
          textStyle: {
            rich: {
              iconName: {
                width: 16,
                height: 16,
                borderRadius: 2,
                backgroundColor: colorList[dIndex]
              },
              percent: {
                color: colorList[dIndex]
              }
            }
          }
        }
      })
      this.areaPieOption = barProjectOptions
      // console.log(barProjectOptions, 'barProjectOptionsbarProjectOptions')
    }

    // async getOvGridServicePowerFn(val) {
    //     this.loading = true
    //     const params = {
    //         deptId: val.id,
    //         countDate: this.curDate
    //     }
    //     try {
    //         const res = await moduleSrv.getOvGridServicePower(params)
    //         this.loading = false
    //         this.serverData = res.data || {}
    //     } catch (e) {
    //         this.loading = false
    //         console.log(e)
    //     }
    // },
    // async getOvTeamCompositionFn(val) {
    //     const params = {
    //         parentDeptId: val.id,
    //         countDate: this.curDate
    //     }
    //     try {
    //         const res = await moduleSrv.getOvTeamComposition(params)
    //         const useteamData = res.data || []
    //         this.tensecondsshow8(useteamData)
    //     } catch (e) {
    //         console.log(e)
    //     }
    // },

    // drawechartsFn(useArr = []) {
    //     useTeamgcEchartsOption.xAxis.data = []
    //     useTeamgcEchartsOption.series[0].data = []
    //     useTeamgcEchartsOption.series[1].data = []
    //     useTeamgcEchartsOption.series[2].data = []
    //     useArr.forEach(val => {
    //         useTeamgcEchartsOption.xAxis.data.push(val.deptName)
    //         useTeamgcEchartsOption.series[0].data.push(val.fullGridManNum)
    //         useTeamgcEchartsOption.series[1].data.push(val.partGridManNum)
    //         useTeamgcEchartsOption.series[2].data.push(val.gridLengthNum)
    //     })
    //     this.teamgcOption = useTeamgcEchartsOption
    // },
  }
}
</script>

<style lang="scss" scoped>
div {
  padding: 0;
}

.eachcombox {
  position: absolute;
  left: 0;
  top: 68px;
  width: 440px;
  height: calc(100%);
  z-index: 1;
  padding-top: 20px;
  background: linear-gradient(80deg, rgba(12, 32, 44, .7) 70%, rgba(2, 12, 44, 0) 100%);
  //opacity: 0.8;

  .ara-con {
    overflow: hidden;
    //.title {
    //  width: calc(100% + 100px);
    //  margin-left: -50px;
    //}
  }


  .title {
    //width: 100%;
    //height: 41px;
    //text-align: center;
    background: url('~@/assets/agriculture/titleBg.png') top center no-repeat;
    //background-size: 100% 100%;
    //font-family: Source Han Sans CN;
    //font-weight: 800;
    //font-size: 18px;
    //color: #ffffff;
    //line-height: 53px;
    //margin-bottom: 28px;
    //position: relative;
    //z-index: 2;

    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 41px;
    text-align: center;
    background-size: 100% 100%;
    font-family: Source Han Sans CN;
    font-weight: 800;
    font-size: 18px;
    color: #ffffff;
    margin-bottom: 16px;
    position: relative;
    z-index: 2;


    span {
      // font-size: 18px;
      // font-family: PangMenZhengDao;
      // color: #fffbf5;
      // letter-spacing: 2px;
      // background: linear-gradient(180deg, #ffffff 0%, #ffeed4 100%);
      // -webkit-background-clip: text;
      // -webkit-text-fill-color: transparent;

      font-family: Source Han Sans CN;
      font-weight: 800;
      font-size: 18px;
      color: #ffffff;
      padding-top: 5px;
    }
  }

  .contentbox {

    width: calc(100% - 20px);
    height: calc(100% - 59px);
    // background: rgba(20, 29, 51, 0.2);
    margin: 0 auto;
    margin-top: -18px;
    // padding-top: 30px;
    padding-bottom: 10px;
    position: relative;
    z-index: 1;

    background: url('~@/views/fullview/map2d/img/leftJvxingk.png') top center no-repeat;
    background-size: 100% 100%;
    margin-left: 20px;

    .termbox {
      width: 100%;
      height: 100%;
      //max-height: calc(100% - 728px);
      overflow-y: auto;
      position: relative;
      z-index: 1;
      // padding-top: 24px;
      margin: 0 auto;
      padding: 0 6px;

      .btmbox {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        margin-left: -5px;

        .eh {
          width: calc(33% - 5px);
          height: 70px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: url('~@/assets/agriculture/zaijianxiangmu@2x.png') top center no-repeat;
          background-size: 100% 100%;
          margin-bottom: 29px;
          margin-left: 5px;
          // margin-left: 34px;
          // .tp {
          //   width: 54px;
          //   height: 54px;
          //   img {
          //     width: 54px;
          //     height: 54px;
          //   }
          // }
          .tx {
            height: 70px;
            line-height: 30px;

            .name {
              font-family: Microsoft YaHei;
              font-weight: 700;
              font-size: 33px;
              color: #fff;
              background: linear-gradient(0deg, #72FDEB, #72FDEB, #FFF, #FFF);
              //ackground: linear-gradient(0deg, rgba(114,253,235,0.78),rgba(0,0,0,0) );
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              text-shadow: 0px 4px 7px rgba(176, 254, 244, 0.7);
              margin-bottom: 3px;

              //> span {
              //  font-size: 12px;
              //}
            }

            .num {
              font-family: Source Han Sans CN;
              font-weight: bold;
              font-size: 14px;
              color: #fefefe;
              line-height: 14px;
            }
          }
        }
      }
    }

    .barechart {
      width: 100%;
      height: 130px;
    }

    .peichart {
      width: 100%;
      height: 222px;
      position: relative;
      //border: 1px red solid;

      .all-money {
        position: absolute;
        left: 31%;
        top: 35%;
        font-family: Source Han Sans CN;
        font-weight: 500;
        font-size: 12px;
        color: #c0e0fb;
      }
    }

    .arealinChart {
      width: 100%;
      height: 290px;
      margin-top: -30px;
      position: relative;
      padding: 20px 0;

      .lin-cha-un {
        position: absolute;
        right: 30px;
        top: 60px;

        .unt {
          font-family: Microsoft YaHei;
          font-weight: 400;
          font-size: 12px;
          color: #ffffff;
          margin-bottom: 13px;
        }

        .unt-img {
          width: 36px;
          height: 33px;
          background: url('~@/assets/agriculture/dikuaiNumberCopy3@2x.png') top center no-repeat;
          background-size: 100% 100%;
          margin-bottom: 38px;
        }
      }

      .lin-cha-sm {
        display: flex;
        color: #fff;
        font-size: 12px;

        .col-li-0 {
          width: 17px;
          height: 6px;
          background: #fba980;
          border-radius: 3px;
          margin-right: 10px;
          margin-bottom: 30px;
        }

        .col-li-1 {
          width: 17px;
          height: 6px;
          background: #66a6ff;
          border-radius: 3px;
          margin-right: 10px;
          margin-bottom: 30px;
        }

        .col-li-2 {
          width: 17px;
          height: 6px;
          border-radius: 3px;
          background: #aeffae;
          margin-right: 10px;
          margin-bottom: 30px;
        }
      }
    }

    // .termgoucheng {
    //   width: 500px;
    //   margin: 0 auto;
    //   margin-top: 15px;
    //   .tl {
    //     width: 100%;
    //     height: 31px;
    //     background: url('~@/assets/fullscreen/duiwugoucheng@2x.png') top left no-repeat;
    //     background-size: auto 100%;
    //     padding-left: 5px;
    //     font-size: 20px;
    //     font-family: PangMenZhengDao;
    //     color: #FFFFFF;
    //     letter-spacing: 2px;
    //     display: flex;
    //     justify-content: flex-start;
    //     align-items: flex-start;
    //   }
    //   .bl {
    //     width: 100%;
    //     height: 230px;
    //     position: relative;
    //     margin-top: 10px;
    //     .bgline1 {
    //       position: absolute;
    //       width: 100%;
    //       top: 20px;
    //       left: 0px;
    //       img {
    //         width: 100%;
    //       }
    //     }
    //     .bgline2 {
    //       position: absolute;
    //       width: 100%;
    //       top: 195px;
    //       left: 0px;
    //       display: none;
    //       img {
    //         width: 100%;
    //       }
    //     }

    //   }
    // }
  }
}
</style>
