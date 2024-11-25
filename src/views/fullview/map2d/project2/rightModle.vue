<template>
  <div class="ri-con-ex">
    <div class="right-pro-model" style="   display: flex;
    flex-flow: column;
    height: 100%;">
      <div style="height: 25%;">
        <!--风险预警-->
        <risk :riskList="baseList" :riskParams="riskParams" :height="200" :limitMoveNum="2" top="-25px"/>
      </div>

      <div style="height: 42%;">
        <top-title-modle title="工程进度" top="5px" style="margin-bottom:20px"/>
        <div class="sg-day-con">
          <div class="sg-day-name">施工天数</div>
          <div class="sg-da">
            <span class="sg-da-num">{{ constructionDays }}</span>
            <span class="sg-da-num-ne">{{ '/' + totalConstructionDay }}</span>
          </div>
        </div>
        <div class="sg-time">
          <el-timeline type="dashed">
            <el-timeline-item v-for="(activity, index) in activities" :key="index"
                              :class=" !project[activity.key] ? 'sg-items-un': 'sg-items'">
              <div class="sg-time-con">
                <div class="sg-time-con-name">{{ activity.content }}</div>
                <div class="sg-time-con-time">{{ project[activity.key] || '-' }}</div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>

      <div style="height: 33%;" class="zj-proces-con">
        <div class="more-btn" @click="handleMore(1)">更多</div>
        <top-title-modle title="资金进度" top="-10px"/>
        <div v-if="Object.keys(financialProgress).length > 0" class="zj-process">
          <div class="zj-title">报账情况</div>
          <div class="pro-con">
            <div class="pro-con-left">
              <div class="cn-name">总金额：</div>
              <div class="cn-next">
                <span class="cn-number">{{ financialProgress.totalSubmitMoney }}</span>万元
              </div>
            </div>
            <div class="pro-con-right">
              <pie-chart :chart-data="pieOption1"/>
            </div>
          </div>
        </div>

        <div v-if="Object.keys(financialProgress).length > 0" class="middle-dis"></div>
        <div v-if="Object.keys(financialProgress).length > 0" class="zj-process zj-bf-process">
          <div class="zj-title">拨付情况</div>
          <div class="pro-con">
            <div class="pro-con-left">
              <div class="cn-name" style="">已报账金额：</div>
              <div class="cn-next">
                <span class="cn-number">{{ financialProgress.submitMoney }}</span>万元
              </div>
            </div>
            <div class="pro-con-right">
              <pie-chart :chart-data="pieOption2"/>
            </div>
          </div>
        </div>
        <div v-else style="display: flex;justify-content: center;align-items: center;flex-flow: column;">
          <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 300px;position: relative;top: -50px;"/>
          <div style="color: #FFF;position: relative;top: -150px;">暂无数据...</div>
        </div>

      </div>
    </div>
    <div class="risk-dia">
      <common-dialog v-if="showRiskDialog" @closeDialog="closeRiskDialog" :dataInofs="riskListByPage || {}"
                     @handleMore="handleMore"
                     :columnList="columnList" :initType="dialogType" title="资金进度列表" :hasOperate="false"/>
    </div>
  </div>
</template>

<script>
import risk from '../component/risk.vue'
import pieChart from '@/components/echarts/pieChart'
import pieChartTree from './pieChartTree.vue'
import {deepClone} from '@/utils'
import commonDialog from '../component/dialog.vue'
import moduleSrv from '@/api/nongtianApi'

import 'echarts-gl'

import {pieOptionOf3D, getPie3D} from '../newEchartsOptions.js'
// import PieChartTree1 from './pieChartTree.vue'

const columnList = [
  {
    label: '标段名称',
    prop: 'name',
    width: '150'
  },
  {
    label: '立项日期',
    prop: 'approvalDate',
    width: '150'
  },
  {
    label: '报账金额(万元)',
    prop: 'submitMoney',
    width: '150'
  },
  {
    label: '拨付金额(万元)',
    prop: 'appropriate',
    width: '150'
  }
]
// 风险预警假数据
// const baseList = [
//   {
//     time: '2023-10-19',
//     value: '介绍客户客户碍事的家伙上来看'
//   },
//   {
//     time: '2023-10-19',
//     value: 'zgxhjdbfbfh'
//   }
// ]

export default {
  components: {
    pieChart,
    risk,
    pieChartTree,
    commonDialog
    // PieChartTree1
  },
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
      financialProgress: {},
      baseList: [],
      pieChartOptions: {},
      totalConstructionDay: 0,
      constructionDays: 0,
      project: {},
      pieOption1: {},
      pieOption2: {},
      statusNum: 1,
      activities: [
        {
          content: '项目立项',
          key: 'approvalDate'
        },
        {
          content: '项目开工',
          key: 'startDate'
        },
        {
          content: '完工确认',
          key: 'completeDate'
        },
        {
          content: '竣工验收',
          key: 'finishDate'
        }
      ],
      showRiskDialog: false,
      dialogType: '1',
      riskListByPage: {},
      columnList: columnList
    }
  },
  watch: {
    dataInfos: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          // console.log('riskParamsXiangmu', this.riskParams)
          // constructionDays 施工天数 // totalConstructionDay  预计施工天数
          //financialProgress 资金情况  //project 基础信息
          const {constructionDays = 0, totalConstructionDay = 0, financialProgress = {}, project = {}, status = 0} = val
          this.constructionDays = constructionDays
          this.totalConstructionDay = totalConstructionDay
          this.financialProgress = financialProgress || {}
          this.project = project
          //
          this.setOptions1(financialProgress)
          this.setOptions2(financialProgress)
          // this.statusNum = setStatus(status)

          let that = this
          setTimeout(() => {
            that.baseList = that.riskList || []
            // that.baseList.push(...that.riskList)
            // that.baseList.push(...that.riskList)
            // that.baseList.push(...that.riskList)
          }, 1000)
        }
      }
    },
    // riskList: {
    //   deep: true,
    //   immediate: true,
    //   handler(val) {
    //     console.log('valkshksahdkjsahdjkhd', val)
    //     if (val && val.length > 0) {
    //       this.baseList = val.slice(0, 2)
    //     }
    //   }
    // }
  },
  mounted() {
    this.pieChartOptions = pieOptionOf3D
    //
    this.$bus.$on('riskParams', msg => {
      //     debugger
      //     console.log('A发送来的消息ahsajkhajkdhjkhjkdhjkh')
      //     // A发送来的消息
      //     this.riskParams = msg
    })
  },
  methods: {
    handleMore(pageSize) {
      // 请求接口数据
      moduleSrv
          .queryProjectSectionFinancialProgressListPage({
            query: this.riskParams,
            pageNum: pageSize,
            pageSize: 8
          })
          .then(res => {
            const {code, data} = res
            if (code === '200') {
              // console.log('getRiskListBypage--res--', res)
              // const list = data.records.map(item => {
              //     //预警类型 1超时预警、2安全预警、3巡视预警、4其他预警
              //     item.earlyWarningTypeStr = this.handleWaring(item.earlyWarningType)
              //     item.content = item.earlyWarningContent
              //     return item
              // })
              this.riskListByPage = data
            }
          })

      this.showRiskDialog = true
    },
    closeRiskDialog() {
      this.showRiskDialog = false
    },
    setStatus(status) {
      //项目状态 立项、在建、停工、完工、竣工
      switch (status) {
        case '立项':
          this.statusNum = 1
          break
        case '在建':
          this.statusNum = 2
          break
        case '停工':
          this.statusNum = 9
          break
        case '完工':
          this.statusNum = 3
          break
        case '竣工':
          this.statusNum = 4
          break
      }
    },
    setOptions1(obj) {
      const optionsData = [
        {
          name: '未报账金额',
          value: obj?.noSubmitMoney || 0,
          itemStyle: {
            color: '#FBAD7E'
          }
        },
        {
          name: '已报账金额',
          value: obj?.submitMoney || 0,
          itemStyle: {
            color: '#85EDFE'
          }
        }
      ]

      const series = getPie3D(optionsData, 0.8)
      series.push({
        silent: true,
        name: 'pie2d',
        type: 'pie',
        startAngle: 2, //起始角度，支持范围[0, 360]。
        clockwise: false, //饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
        radius: ['40%', '60%'],
        center: ['40%', '40%'],
        data: optionsData,
        itemStyle: {
          opacity: 0
        },
        labelLine: {
          show: false
        },
        label: {
          show: false,
          position: 'center'
        }
      })

      this.pieOption1 = {
        legend: {
          show: true,
          orient: 'horizontal',
          data: ['未报账金额', '已报账金额'],
          itemGap: 10,
          itemHeight: 6,
          itemWidth: 12,
          left: '0',
          top: '65%',
          textStyle: {
            color: '#fff',
            fontSize: 12,
            rich: {
              name: {
                // width: 60,
                fontSize: 12,
                color: '#fff',
                fontFamily: 'Source Han Sans CN'
              }
            }
          }
        },
        animation: true,
        tooltip: {
          // trigger: 'none',
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderColor: 'rgba(0,0,0,0.1)',
          textStyle: {
            color: '#fff',
            fontSize: 12
          },
          formatter: params => {
            return `<span style="color: ${params.color};font-size: 20px;">●</span> ${params.seriesName}<br/><span style="display:inline-block;margin-left:10px;">${optionsData[params.seriesIndex].value}</span>万元`
          }
        },
        // backgroundColor: '#092B35',
        labelLine: {
          show: true,
          lineStyle: {
            color: '#7BC0CB'
          },
          normal: {
            show: true,
            length: 10,
            length2: 10
          }
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b} \n{c}\n{d}%',
          textStyle: {
            color: 'rgba(176, 216, 223, 1)',
            fontSize: 24
          }
        },
        xAxis3D: {
          min: -1,
          max: 1
        },
        yAxis3D: {
          min: -1,
          max: 1
        },
        zAxis3D: {
          min: -1,
          max: 1
        },
        grid3D: {
          show: false,
          boxHeight: 1.7,
          left: '45%',
          top: '-18',
          width: '60%',
          // environment: "rgba(255,255,255,0)",
          viewControl: {
            distance: 110, // 放大缩小比例
            alpha: 28,
            beta: 18,
            autoRotate: false, // 自动旋转
            // rotateSensitivity: 1,
            zoomSensitivity: 0,
            // panSensitivity: 1,
          }
        },
        series: series
      }


      // console.log(this.pieOption1, 'this.pieOption1')
    },
    setOptions2(obj) {
      // const options = deepClone(pieOptionOf3D)
      // options.legend.data =  ['未报账金额', '已报账金额']
      const optionsData = [
        {
          name: '未拨付金额',
          value: obj?.noAppropriate || 0,
          itemStyle: {
            color: '#FBAD7E'
          }
        },
        {
          name: '已拨付金额',
          value: obj?.appropriate || 0,
          itemStyle: {
            color: '#85EDFE'
          }
        }
      ]

      const series = getPie3D(optionsData, 0.8)

      series.push({
        silent: true,
        name: 'pie2d',
        type: 'pie',
        startAngle: 0, //起始角度，支持范围[0, 360]。
        clockwise: false, //饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
        radius: ['40%', '60%'],
        center: ['40%', '40%'],
        data: optionsData,
        itemStyle: {
          opacity: 0
        },
        labelLine: {
          show: false
        },
        label: {
          show: false,
          position: 'center'
        }
      })
      // console.log(pieOptionOf3D, 'series')
      // console.log(series, 'series')
      this.pieOption2 = {
        legend: {
          show: true,
          orient: 'horizontal',
          data: ['未拨付金额', '已拨付金额'],
          itemGap: 10,
          itemHeight: 6,
          itemWidth: 12,
          left: '0',
          top: '65%',
          textStyle: {
            color: '#fff',
            fontSize: 12,
            rich: {
              name: {
                // width: 60,
                fontSize: 12,
                color: '#fff',
                fontFamily: 'Source Han Sans CN'
              }
            }
          }
        },
        animation: true,
        tooltip: {
          // trigger: 'none',
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderColor: 'rgba(0,0,0,0.1)',
          textStyle: {
            color: '#fff',
            fontSize: 12
          },
          formatter: params => {
            return `<span style="color: ${params.color};font-size: 20px;">●</span> ${params.seriesName}<br/><span style="display:inline-block;margin-left:10px;">${optionsData[params.seriesIndex].value}</span>万元`
          }
        },
        // backgroundColor: '#092B35',
        labelLine: {
          show: true,
          lineStyle: {
            color: '#7BC0CB'
          },
          normal: {
            show: true,
            length: 10,
            length2: 10
          }
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b} \n{c}\n{d}%',
          textStyle: {
            color: 'rgba(176, 216, 223, 1)',
            fontSize: 24
          }
        },
        xAxis3D: {
          min: -1,
          max: 1
        },
        yAxis3D: {
          min: -1,
          max: 1
        },
        zAxis3D: {
          min: -1,
          max: 1
        },
        grid3D: {
          show: false,
          boxHeight: 1.7,
          left: '45%',
          top: '-18',
          width: '60%',
          // environment: "rgba(255,255,255,0)",
          viewControl: {
            distance: 110, // 放大缩小比例
            alpha: 28,
            beta: 18,
            autoRotate: false, // 自动旋转
            // rotateSensitivity: 1,
            zoomSensitivity: 0,
            // panSensitivity: 1,
          }
        },
        series: series
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-timeline-item__wrapper {
    padding-left: 18px;
  }
}

.right-pro-model {
  position: absolute;
  top: 0;
  width: 420px;
  height: calc(100% - 8px);
  z-index: 1;
  right: 20px;
  box-sizing: border-box;
  background: url('~@/assets/agriculture/jvxingkuang2x.png') top center no-repeat;
  background-size: 100% 100%;

  .sg-day-con {
    width: calc(100% - 20px);
    margin: 0 auto;
    height: 55px;
    background: rgba(13, 33, 67, 0.5);
    border: 1px solid #1afcff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 14px;

    .sg-day-name {
      font-family: Source Han Sans CN;
      font-weight: 500;
      font-size: 18px;
      color: #d3e2f5;
      line-height: 22px;

      background: linear-gradient(0deg, #1573ff 0%, #1afcff 100%);

      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .sg-da {
      .sg-da-num {
        font-family: DINPro;
        font-weight: bold;
        font-size: 30px;
        color: #d3e2f5;
        line-height: 22px;
        background: linear-gradient(0deg, #1573ff 0%, #1afcff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .sg-da-num-ne {
        font-family: DINPro;
        font-weight: 500;
        font-size: 16px;
        color: #5782b8;
      }
    }
  }

  .sg-time {
    margin: 0 10px;
    padding-top: 38px;
    height: 310px;
    overflow: hidden;
    //overflow-y: auto;

    .sg-items {
      ::v-deep {
        .el-timeline-item__node--normal {
          width: 14px;
          height: 14px;
          left: -3px;
          top: -2px;
          background: url('~@/assets/agriculture/process1.png') top center no-repeat;
          background-size: 100% 100%;
        }
      }

      .sg-time-con {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 371px;
        height: 49px;
        background: url('~@/assets/agriculture/zu_3215@2x_.png') top center no-repeat;
        background-size: 100% 100%;
        position: relative;
        top: -17px;

        .sg-time-con-name {
          font-family: Source Han Sans CN;
          font-weight: 500;
          font-size: 16px;
          color: #30cff7;
          line-height: 22px;
          margin-left: 51px;
        }

        .sg-time-con-time {
          font-family: Source Han Sans CN;
          font-weight: 400;
          font-size: 14px;
          color: #c0d1e7;
          margin-right: 10px;
        }
      }
    }

    .sg-items-un {
      ::v-deep {
        .el-timeline-item__node--normal {
          width: 14px;
          height: 14px;
          left: -3px;
          top: -2px;
          background: url('~@/assets/agriculture/zu_3176@_2x1.png') top center no-repeat;
          background-size: 100% 100%;
        }
      }

      .sg-time-con {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 371px;
        height: 49px;
        background: url('~@/assets/agriculture/zu_3215@2x1.png') top center no-repeat;
        background-size: 100% 100%;
        position: relative;
        top: -17px;

        .sg-time-con-name {
          font-family: Source Han Sans CN;
          font-weight: 500;
          font-size: 16px;
          color: #93a5bd;
          line-height: 22px;
          margin-left: 51px;
        }

        .sg-time-con-time {
          font-family: Source Han Sans CN;
          font-weight: 400;
          font-size: 14px;
          color: #93a5bd;
          margin-right: 10px;
        }
      }
    }

    ::v-deep {
      .el-timeline-item__tail {
        position: absolute;
        left: 4px;
        height: 100%;
        border-left: 1px dashed #93a5bd;
      }
    }
  }

  .middle-dis {
    width: calc(100% - 20px);
    // height: /1px;
    padding-top: 30px;
    margin: 0 10px;
    border-bottom: 1px solid rgba(98, 146, 206, 0.3);
  }

  .zj-bf-process {
    padding-top: 25px;
  }

  .zj-process {
    width: 100%;
    margin: 0 20px;

    margin-top: -10px;
    height: 100px;

    .zj-title {
      font-family: Source Han Sans CN;
      font-weight: bold;
      font-size: 14px;
      // color: #EEF3FF;
      // line-height: 9px;
      text-shadow: 0px 3px 7px rgba(0, 0, 0, 0.35);

      background: linear-gradient(0deg, #8fb9f7 0%, rgba(255, 255, 255, 0.87) 100%);

      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .pro-con {
      position: relative;
      width: 100%;
      height: 100px;

      .pro-con-left {
        width: calc(50% - 40px);
        position: absolute;
        top: 16px;
        left: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .cn-name {
          font-family: Source Han Sans CN;
          font-weight: 500;
          font-size: 14px;
          color: #c0e0fb;
        }

        .cn-next {
          font-family: Source Han Sans CN;
          font-weight: 500;
          font-size: 15px;
          color: #c0e0fb;

          .cn-number {
            font-family: DINPro;
            font-weight: 500;
            font-size: 23px;
            color: #ffffff;
            text-shadow: 0px 0px 8px #8cfaff;
          //  #8cfaff
            background-image: radial-gradient( rgba(9, 121, 159,1) 0%,rgba(140, 250, 255,0) 70%);
          }
        }
      }

      .pro-con-right {
        position: relative;
        top: -40px;
        left: -5px;
        width: 390px;
        height: 150px;
      }
    }
  }

  .zj-proces-con {
    //background: #081a30;
    position: relative;

    .more-btn {
      position: absolute;
      right: 22px;
      top: 13px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      font-size: 14px;
      color: #eef3ff;
      line-height: 8px;
      cursor: pointer;
      z-index: 4;
    }
  }
}
::v-deep{
  .el-timeline-item{
    padding-bottom: 10px;
  }
}
</style>
