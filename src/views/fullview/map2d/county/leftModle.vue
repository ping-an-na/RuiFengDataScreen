<template>
  <div class="eachcombox">
    <div v-loading="loading" class="contentbox">
      <top-title-modle title="标段建设情况" top="-10px"/>
      <div class="termbox">
        <div class="btmbox" v-if="buildList.length > 0">
          <div class="eh" v-for="(item, index) in buildList" :key="index">
            <div class="tx" v-if="buildListUUID">
              <div class="name" style="font-style:oblique">
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
        <div v-else style="display: flex;justify-content: center;align-items: center;flex-flow: column;">
          <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 300px;position: relative;top: -50px;"/>
          <div style="color: #FFF;position: relative;top: -150px;">暂无数据...</div>
        </div>
      </div>

      <div class="risk-model">
        <risk :riskList="baseList" :riskParams="riskParams" top="-15px" :height="280" :limitMoveNum="3.1"/>
      </div>

      <top-title-modle title="材料归档" top="-50px"/>
      <div class="n-bottom-guid" v-if="materialArchiving.length > 0" >
        <div class="zlsum">
          <div class="zlOne">总量</div>
          <div class="sumOne">{{sum}}</div>
        </div>
        <pie-chart ref="clgd"  :chart-data="areaPieOption1"/>
      </div>
      <div v-else style="display: flex;justify-content: center;align-items: center;flex-flow: column;">
        <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 300px;position: relative;"/>
        <div style="color: #FFF;position: relative;top: -100px;">暂无数据...</div>
      </div>

    </div>
  </div>
</template>

<script>
import LineChart from '@/components/echarts/lineChart'
import pieChart from '@/components/echarts/pieChart'

import barChart from '@/components/echarts/barChart'

import {barProjectOptions, barProjectOptionsSe2, colorList, setBarProjectOptionsSe2} from '../newEchartsOptions.js'

import risk from '../component/risk.vue'

// import { useTeamgcEchartsOption } from './echartsOptions.js'
// import moduleSrv from '@/pages/pilot/api/allview'
// import scientificDecisionMixin from '@/pages/pilot/mixin/scientificDecisionMixin'
export default {
  name: 'Grid',
  components: {
    barChart,
    LineChart,
    pieChart,
    risk
  },
  // mixins: [scientificDecisionMixin],
  props: {
    dataInfos: {
      type: Object,
      default: () => {
      }
    },
    riskList: {
      type: [Array, Object],
      default: () => []
    },
    riskParams: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      sum:'',
      buildListUUID: true,
      materialArchiving: [],
      baseList: [],
      loading: false,
      areaPieOption1: {},
      buildList: [
        {
          name: '项目立项',
          value: 20
        },
        {
          name: '项目立项',
          value: 20
        },
        {
          name: '项目立项',
          value: 20
        },
        {
          name: '项目立项',
          value: 20
        }
      ]
    }
  },
  watch: {
    dataInfos: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          const {projectSectionConstruction = [], materialArchiving = []} = val
          this.materialArchiving = materialArchiving
          this.buildList = projectSectionConstruction
          this.setOptions(materialArchiving)
          // this.constructionDays = constructionDays
          // this.totalConstructionDay = totalConstructionDay
          // this.financialProgress = financialProgress
          // this.project = project
          // //
          // this.setOptions1(financialProgress)
          // this.setOptions2(financialProgress)
          // this.statusNum = setStatus(status)
          this.buildListUUID = false
          setTimeout(() => {
            this.buildListUUID = true
            setTimeout(() => {
              let myNum = this.$refs['myNum']
              if (myNum) myNum.forEach(res => {
                res.start()
              })
            })
          })

        }
      }
    },
    riskList: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val && val.length > 0) {
          this.baseList = val
        }
      }
    }
  },
  async created() {
  },
  mounted() {
    // this.areaPieOption1 = barProjectOptionsSe2
  },
  destroyed() {
    // clearInterval(this.timeInterval)
  },
  methods: {
    timeOut() {
      let myNum = this.$refs['myNum']
      if (myNum) myNum.forEach(res => {
        res.start()
      })

      let clgd = this.$refs['clgd']
      if (clgd) clgd.timeOut()

      // let tjflZje = this.$refs['tjflZje']
      // if(tjflZje) tjflZje.timeOut()
      //
      // let ntjsflmj = this.$refs['ntjsflmj']
      // if(ntjsflmj) ntjsflmj.timeOut()

    },

    setOptions(arr) {
      const data = arr.map(item => {
        return {
          name: item.itemName,
          value: item.itemValue
        }
      })


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
          name1:'条',
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
                name1:{
                  fontSize: 14,
                  fontWeight: 'lighter',
                  color:'#FFFFFF'
                },
                value: {
                  fontSize: 14,
                  fontWeight: 'lighter',
                  color:'#FFFFFF'
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
      this.sum = sum
      // console.log(sum, data, optionData,'sum, data, 2222222222222')
      const options = setBarProjectOptionsSe2(sum, data, optionData)
      return options
    }
    // async getAnalysisData(val) {
    //     // this.gridLineChart = rankBarChartOption
    // }
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
.eachcombox {
  position: absolute;
  left: 0;
  top: 68px;
  width: 440px;
  height: calc(100%);
  z-index: 1;
  // box-sizing: border-box;
  // background: url('~@/assets/agriculture/jvxingkuang2x.png') top center no-repeat;
  // background-size: 100% 100%;
  padding-top: 20px;
  //background: linear-gradient(80deg, #020c2c 70%, rgba(2, 12, 44, 0) 100%);
  background: linear-gradient(80deg, rgba(12, 32, 44, 0.7) 70%, rgba(2, 12, 44, 0) 100%);
  //opacity: 0.8;
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

    background: url('~@/assets/agriculture/jvxingkuang2x.png') top center no-repeat;
    background-size: 100% 100%;
    margin-left: 20px;

    .termbox {
      width: 100%;
      height: 194px;
      //max-
      //min-height: 90px;
      position: relative;
      z-index: 1;
      // padding-top: 24px;
      margin: 0 auto;
      padding: 0 6px;
      // margin-top: 10px;
      // .t {
      //   font-size: 20px;
      //   font-family: PangMenZhengDao;
      //   color: #FFFBF5;
      //   letter-spacing: 2px;
      //   background: linear-gradient(180deg, #FFFFFF 0%, #FFEED4 100%);
      //   -webkit-background-clip: text;
      //   -webkit-text-fill-color: transparent;
      //   position: absolute;
      //   width: 100%;
      //   z-index: 2;
      //   top: -10px;
      //   left: 0px;
      //   text-align: center;
      // }
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
          margin-bottom: 34px;
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
              //font-size: 12px;
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
      height: 200px;
    }

    .arealinChart {
      width: 100%;
      height: 200px;
      margin-top: -30px;
    }
  }

  .n-bottom-guid {
    width: 100%;
    height: 300px;
    margin-top: -60px;
    position: relative;
  }

  .risk-model {
    height: calc(100% - 590px);
    overflow: hidden;

  }
}

.zlsum{
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
  .zlOne{
    color: #acc5df;
    margin-bottom: 10px;
    font-size: 14px;
  }
  .sumOne{
    font-size: 28px;
    color: #edf6fc;
    text-shadow: #FFF 0px 0 20px;
    font-weight: 900;
  }
}
</style>
