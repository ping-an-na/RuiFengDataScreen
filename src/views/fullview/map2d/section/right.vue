<template>
  <div class="ri-con-ex-two">
    <div class="eachcombox-right">
      <div v-loading="loading" class="contentbox" style="display: flex;flex-flow: column;height: 100%;">

        <div style="height: 38%;overflow: hidden">
          <div class="ris-con">
            <risk :riskList="baseList" :riskParams="riskParams" top="-15px" :height="280" :limitMoveNum="3.1"/>
          </div>
        </div>


        <div style="height: 33%;">
          <top-title-modle title="参与单位" top="-10px"/>
          <div style="position: relative;top: -20px">
            <div class="active-tab-box" v-if="tabList.length > 0">
              <div class="active-tab-items" v-for="(item, index) in tabList" :key="index" @click="handleClickTab(item)">
                <div :class="activeTab === item.id ? 'click-items' : 'unclick-items'">{{ item.enterpriseType }}</div>
              </div>
            </div>
            <div class="active-con" v-if="tabList.length > 0">
              <div class="con-items">
                <div class="con-ite-name">单位名称</div>
                <div class="con-ite-value">{{ activeInfos.name }}</div>
              </div>
              <div class="con-items">
                <div class="con-ite-name">参与人员</div>
                <div class="con-ite-value">
                  {{ `${activeInfos.enterpriseUsers ? activeInfos.enterpriseUsers.length : 0}人` }}
                </div>
              </div>
            </div>
            <vue-seamless-scroll :data="activeInfos.enterpriseUsers"
                                 style="height: 300px;overflow: hidden;margin:0 5px;margin-top: 20px;"
                                 v-if="tabList.length > 0" :class-option="classOption">
              <div class="termbo-peo" :style="`width:${87 * (activeInfos.enterpriseUsers.length || 0)}px`">
                <div class="eh" v-for="(item, index) in activeInfos.enterpriseUsers" :key="index">
                  <div class="eh-name">{{ item.userName }}</div>
                  <div class="eh-career">{{ item.jobName }}</div>
                  <img class="eh-iamge" v-if="item.imgHeaddataMini"
                       :src="'data:image/gif;base64,'+item.imgHeaddataMini"/>
                  <img class="eh-iamge" v-else src="@/assets/agriculture/avatar.png"/>

                  <div class="avatarClass"></div>
                  <div class="avatarClassBottom"></div>
                </div>
              </div>
            </vue-seamless-scroll>
            <div v-else style="display: flex;justify-content: center;align-items: center;flex-flow: column;">
              <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 300px;position: relative;top: -20px;"/>
              <div style="color: #FFF;position: relative;top: -120px;">暂无数据...</div>
            </div>
          </div>
        </div>


        <div style="height: 25%;">
          <div class="zj-proces-con">

            <div class="more-btn" @click="handleMore(1)">异常考勤清单</div>

            <top-title-modle title="考勤统计" top="0px"/>

            <div class="kq-statistic" v-if="Object.keys(enterprisesUserChecks).length > 0">
              <div class="start-time">
                <div :style="value1?'width: 180px;':''" @click="monthrangeClick">
                  {{ value1 ? `${value1[0]}至${value1[1]}` : '起止时间' }}
                </div>
                <div style="width: 0px;height: 0px;overflow: hidden;">
                  <el-date-picker
                      @blur="monthrangeblur"

                      :picker-options="pickerOptions"
                      popper-class="DetePickerClass"
                      ref="monthrange"
                      :append-to-body="false"
                      v-model="value1"
                      type="monthrange"
                      range-separator="至"
                      start-placeholder="开始月份"
                      value-format="yyyy-MM"
                      end-placeholder="结束月份">
                  </el-date-picker>
                </div>
              </div>


              <div class="second-model">
                <div class="kq-tab-items" v-for="(item, index) in kqList" :key="index">
                  <div class="left-model"></div>
                  <div class="rig-model">
                    <div class="kq-name">{{ item.name }}</div>
                    <div class="kq-value">
                      <span>{{ enterprisesUserChecks[item.key] }}</span>
                      <span class="kq-unit">人</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="prcess-con">
                <bar-chart :chart-data="kqrangeEchartsObj"/>
              </div>
            </div>
            <div v-else style="display: flex;justify-content: center;align-items: center;flex-flow: column;">
              <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 300px;position: relative;top: 0px;"/>
              <div style="color: #FFF;position: relative;top: -100px;">暂无数据...</div>
            </div>

          </div>
        </div>


      </div>
      <div class="risk-dia">
        <common-dialog v-if="showRiskDialog" @closeDialog="closeRiskDialog" :dataInofs="riskListByPage || {}"
                       istopModel="60px" :columnList="columnList" :initType="dialogType" title="查看清单"
                       :hasOperate="false"
                       @handleMore="handleMore">
          <div slot="topModel" class="dialog-top-model">

            <div class="top-left">
              <div class="err-pe">{{ `考勤异常人员（${ycList.length}人）:` }}</div>
              <div v-for="(item, index) in ycList" :key="index" class="err-nums-con">

                <span class="err-nums-ti">{{ item.userName }}</span>
                <span class="err-nums">{{ `(${item.abnormalCount})` }}</span>
                <span v-if="index !== ycList.length - 1">、</span>
              </div>
            </div>

            <div class="top-right">
              <span>查询日期：{{ value1 ? `${value1[0]}月初 至 ${value1[1]}月底` : '全部' }}</span>
            </div>
          </div>
        </common-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {kqrangeEchartsOption} from '../newEchartsOptions'
import barChart from '@/components/echarts/barChart'
import risk from '../component/risk.vue'
import commonDialog from '../component/dialog.vue'
import moduleSrv from '@/api/nongtianApi'
import LineChart from "@/components/echarts/lineChart.vue";

const columnList = [
  {
    label: '考勤日期',
    prop: 'checkDate',
    width: '100'
  },
  {
    label: '考勤人员',
    prop: 'userName',
    width: '100'
  },
  {
    label: '角色',
    prop: 'jobName',
    width: '150'
  },
  {
    label: '上班打卡',
    prop: 'onWork',
    width: '100'
  },
  {
    label: '下班打卡',
    prop: 'offWork',
    width: '100'
  }
]

const baseList = [
  {
    earlyWarningTime: '2023-10-19',
    earlyWarningContent: '介绍客户客户碍事的家伙上来看'
  },
  {
    earlyWarningTime: '2023-10-19',
    earlyWarningContent: 'zgxhjdbfbfh'
  },
  {
    earlyWarningTime: '2023-10-19',
    earlyWarningContent: '介绍客户客户碍事的家伙上来看'
  },
  {
    earlyWarningTime: '2023-10-19',
    earlyWarningContent: 'zgxhjdbfbfh'
  },
  {
    earlyWarningTime: '2023-10-19',
    earlyWarningContent: 'zgxhjdbfbfh'
  },
  {
    earlyWarningTime: '2023-10-19',
    earlyWarningContent: 'zgxhjdbfbfh'
  }

]

const tabList = [
  {
    name: '建设单位',
    value: 1
  },
  {
    name: '施工单位',
    value: 2
  },
  {
    name: '监理单位',
    value: 3
  }
]

const personList = [
  {
    name: '徐帆',
    zw: '项目经理'
  },
  {
    name: '徐帆',
    zw: '项目经理'
  },
  {
    name: '徐帆',
    zw: '项目经理'
  },
  {
    name: '徐帆',
    zw: '项目经理'
  }
]

const kqList = [
  {
    name: '涉及打卡人员',
    key: 'checkUsers'
  },
  {
    name: '考勤正常人员',
    key: 'normalPersonnel'
  },
  {
    name: '考勤异常人员',
    key: 'abnormalPersonnel'
  }
]

const infos = [
  {
    name: '土地平整',
    list: [
      {
        name: '田块修筑',
        value: 21
      },
      {
        name: '田块修筑',
        value: 21
      },
      {
        name: '田块修筑',
        value: 21
      }
    ]
  },
  {
    name: '土地改良',
    list: [
      {
        name: '田块修筑',
        value: 21
      },
      {
        name: '田块修筑',
        value: 21
      },
      {
        name: '田块修筑',
        value: 21
      },
      {
        name: '田块修筑',
        value: 21
      },
      {
        name: '田块修筑',
        value: 21
      }
    ]
  },
  {
    name: '灌溉和排水',
    list: [
      {
        name: '田块修筑',
        value: 21
      },
      {
        name: '田块修筑',
        value: 21
      },
      {
        name: '田块修筑',
        value: 21
      },
      {
        name: '田块修筑',
        value: 21
      },
      {
        name: '田块修筑',
        value: 21
      },
      {
        name: '田块修筑',
        value: 21
      }
    ]
  }
]

// import moduleSrv from '@/pages/pilot/api/allview'
// import scientificDecisionMixin from '@/pages/pilot/mixin/scientificDecisionMixin'
export default {
  name: 'Grid',
  components: {
    LineChart,
    barChart,
    risk,
    commonDialog
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
      pickerOptions: {
        shortcuts: [{
          text: '全部',
          onClick(picker) {
            picker.$emit('pick', null);
          }
        }]
      },
      value1: null,
      isMonthrange: false,
      classOption: {
        step: 0.4,
        direction: 2,
      },
      serverData: {},
      loading: false,
      kqrangeEchartsObj: {},
      baseList: [],
      buildList: infos,
      tabList,
      activeInfos: {
        enterpriseUsers: [],
      },
      activeTab: 1,
      personList,
      enterprisesUserChecks: {},
      kqList,

      showRiskDialog: false,
      dialogType: '1',
      riskListByPage: {},
      columnList: columnList,
      ycList: []
    }
  },
  watch: {
    dataInfos: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          const {sectionEnterprises = [], enterprisesUserChecks = {}} = val
          this.tabList = sectionEnterprises
          this.activeTab = sectionEnterprises[0].id
          this.activeInfos = sectionEnterprises[0]
          this.enterprisesUserChecks = enterprisesUserChecks
          const {normalPersonnel = 0, abnormalPersonnel = 0} = enterprisesUserChecks
          kqrangeEchartsOption.series[0].data = [normalPersonnel, abnormalPersonnel]
          this.kqrangeEchartsObj = kqrangeEchartsOption
          let that = this

          setTimeout(() => {
            // console.log('打印 baseList - riskList ')
            that.baseList = that.riskList || []
          }, 1000)
        }
      }
    },

  },
  async created() {

  },
  mounted() {
    // this.kqrangeEchartsObj = kqrangeEchartsOption
  },
  destroyed() {
    // clearInterval(this.timeInterval)
  },
  methods: {
    monthrangeblur() {
      this.isMonthrange = false
      this.getSectionInfos()
    },
    monthrangeClick() {
      this.isMonthrange = true
      this.$refs.monthrange.focus()
    },

    // 标段
    getSectionInfos() {
      let that = this
      const params = {

        projectSectionId: this.riskParams.projectSectionId, // '1762720216434880513'
        attendanceStartDate: this.value1 && this.value1[0] ? `${this.value1[0]}` : null,
        attendanceEndDate: this.value1 && this.value1[1] ? `${this.value1[1]}` : null,
      }
      moduleSrv.queryProjectSectionDashboardStatistic(params).then(res => {
        const {code, data} = res
        if (code === '200') {
          this.enterprisesUserChecks = data.enterprisesUserChecks

          const {normalPersonnel = 0, abnormalPersonnel = 0} = this.enterprisesUserChecks
          kqrangeEchartsOption.series[0].data = [normalPersonnel, abnormalPersonnel]
          this.kqrangeEchartsObj = kqrangeEchartsOption
        }
      })
    },


    handleMore(pageSize) {
      // console.log(pageSize, 'pageSize')
      this.queryProjectSectionAbnormalAttendanceStatistic()
      // 请求接口数据

      let a = {...this.riskParams, id: this.riskParams.projectSectionId}
      if (this.value1 && this.value1[0]) {
        a.startDate = `${this.value1[0]}`
        a.endDate = `${this.value1[1]}`
      }
      this.value1 && this.value1[1] ? `${this.value1[1]}` : null,

          moduleSrv.queryProjectSectionAbnormalAttendanceListPage({
            query: a,
            pageNum: pageSize,
            pageSize: 8,

          })
              .then(res => {
                const {code, data} = res
                if (code === '200') {
                  // console.log('getRiskListBypage--res--', res)
                  // const list = data.records.map(item => {
                  //   if (item.checkType === 1) {
                  //     item.sbTime = item.createAt
                  //   } else {
                  //     item.xbTime = item.createAt
                  //   }
                  // })
                  this.riskListByPage = data
                }
              })

      this.showRiskDialog = true
    },
    queryProjectSectionAbnormalAttendanceStatistic() {
      // console.log('考勤考勤考勤', this.riskParams)
      moduleSrv
          .queryProjectSectionAbnormalAttendanceStatistic({
            id: this.riskParams.projectSectionId,
            startDate: this.value1 && this.value1[0] ? `${this.value1[0]}` : null,
            endDate: this.value1 && this.value1[1] ? `${this.value1[1]}` : null,
          })
          .then(res => {
            const {code, data} = res
            if (code === '200') {
              // console.log('getRiskListBypage--res--', res)
              this.ycList = data
            }
          })
    },
    closeRiskDialog() {
      this.showRiskDialog = false
    },
    async getAnalysisData(val) {
      this.gridLineChart = rankBarChartOption
    },
    handleClickTab(item) {
      this.activeInfos = {
        enterpriseUsers: [],
      }
      this.activeTab = item.id
      setTimeout(() => {
        this.activeInfos = item
      })
    }
  }
}
</script>

<style lang="scss" scoped>

//.el-popper .popper__arrow::after{
//  overflow: hidden;
//}
//  top: 810px !important;
//  left: 1130px !important;
//  background: #051331 !important;


.eachcombox-right {
  position: absolute;
  top: 0;
  width: 420px;
  height: 100%; //calc(100% - 8px);
  z-index: 1;
  right: 20px;
  // box-sizing: border-box;
  background: url('~@/assets/agriculture/jvxingkuang2x.png') top center no-repeat;
  background-size: 100% 100%;
  padding-top: 20px;

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

  .base-con {
    margin: 0 3px;

    .items {
      width: calc(100% - 40px);
      margin: 0 auto;
      height: 60px;
      background: url('~@/assets/agriculture/4@2x.png') top center no-repeat;
      background-size: 100% 100%;
      margin-bottom: 20px;
      padding: 9px 7px 12px 39px;
    }

    .item-fi {
      display: flex;
      justify-content: space-between;
      width: 100%;
      // height: 28px;
      // background: rgba(4, 32, 79, 0.5);
      // align-items: center;
      // padding: 0 20px;
      margin-bottom: 2px;

      .con-name {
        font-family: Adobe Heiti Std;
        font-weight: normal;
        font-size: 12px;
        color: #1ff2ff;
      }

      .con-value {
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 10px;
        color: #c0c4cc;
      }
    }

    .item-se {
      font-family: Source Han Sans CN;
      font-weight: 400;
      font-size: 12px;
      color: #e8feff;
      margin-left: 4px;
      margin-top: 12px;
      display: inline-block;
      white-space: nowrap;

      display: inline-block;
      white-space: nowrap;
      width: 80%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .active-tab-box {
    display: flex;
    align-items: center;
    width: calc(100% - 8px);
    margin: 0 auto;
    height: 32px;
    background: rgba(4, 32, 79, 0.5);
    margin-bottom: 12px;
    padding: 0 11px;

    .active-tab-items {
      // font-family: Source Han Sans CN;
      // font-weight: 500;
      // font-size: 12px;
      // color: #d8d8d8;
      cursor: pointer;
      margin-right: 40px;
    }

    .click-items {
      font-family: Source Han Sans CN;
      font-weight: 500;
      font-size: 14px;
      color: #00fff6;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        right: 1px;
        bottom: -10px;
        width: 55px;
        height: 4px;
        border-radius: 2px;
        background: #00fff6;
      }
    }

    .unclick-items {
      font-family: Source Han Sans CN;
      font-weight: 500;
      font-size: 12px;
      color: #d8d8d8;
    }
  }

  .active-con {
    .con-items {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: calc(100% - 8px);
      margin: 0 auto;
      height: 32px;
      background: rgba(4, 32, 79, 0.5);
      margin-bottom: 12px;
      padding: 0 8px;

      .con-ite-name {
        font-family: Source Han Sans CN;
        font-weight: 500;
        font-size: 14px;
        color: #d8d8d8;
      }

      .con-ite-value {
        font-family: Source Han Sans CN;
        font-weight: 500;
        font-size: 14px;
        color: #ffffff;
      }
    }
  }

  .termbo-peo {
    display: flex;
    //padding: 0 16px;
    //justify-content: space-between;
    //margin: 0 5px;

    .eh {
      width: 87px;
      height: 122px;
      margin: 0 2px;
      overflow: hidden;
      // background: url('~@/assets/agriculture/zu_3204@_2x1.png') top center no-repeat;
      // background-size: 100% 100%;
      position: relative;

      .eh-iamge {
        width: 82px;
        height: 119px;
        position: absolute;
        bottom: 0;
        left: 2px;
        z-index: 90;
      }

      .eh-name {
        font-family: Microsoft YaHei;
        font-weight: bold;
        font-size: 8px;
        color: #ffffff;
        position: absolute;
        bottom: 30px;
        width: 87px;
        text-align: center;
        z-index: 99;
      }

      .eh-career {
        font-family: Microsoft YaHei;
        font-weight: bold;
        font-size: 12px;
        color: #ffffff;
        position: absolute;
        bottom: 5px;
        width: 87px;
        text-align: center;
        z-index: 99;

      }
    }
  }

  .kq-statistic {
    // position: relative;
    .start-time {
      width: 100%;
      height: 40px;
      position: relative;
      margin-top: -15px;
      display: flex;

      > div {
        background: url('~@/assets/agriculture/zu9_copy_3.png') top center no-repeat;
        background-size: 100% 100%;
        width: 89px;
        height: 31px;
        line-height: 31px;
        text-align: center;
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 12px;
        color: #ffffff;
        position: absolute;
        right: 0;
      }
    }

    .second-model {
      display: flex;
      margin-top: -5px;
      margin-bottom: 20px;

      .kq-tab-items {
        display: flex;
        align-items: center;
        height: 64px;

        .left-model {
          width: 64px;
          height: 64px;
          background: url('~@/assets/agriculture/zu_3204@2x_.png') top center no-repeat;
          background-size: 100% 100%;
        }

        .rig-model {
          line-height: 28px;

          .kq-name {
            font-family: Microsoft YaHei;
            font-weight: 400;
            font-size: 12px;
            color: #d8d8d8;
          }

          .kq-value {
            font-family: DINPro;
            font-weight: 500;
            font-size: 24px;
            color: #ffffff;
            width: 73px;
            display: flex;
            justify-content: space-between;

            .kq-unit {
              font-family: Microsoft YaHei;
              font-weight: 400;
              font-size: 12px;
              color: #d8d8d8;
            }
          }
        }
      }
    }
  }

  .zj-proces-con {
    position: relative;

    .more-btn {
      position: absolute;
      right: 12px;
      top: 23px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      font-size: 14px;
      color: #eef3ff;
      line-height: 8px;
      cursor: pointer;
      z-index: 4;
    }
  }

  .contentbox {
    width: 100%;
    height: 100%;
  }

  .ris-con {
    height: calc(100%);
    overflow: hidden;
  }
}

.dialog-top-model {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #afc5e6;
  //margin: 20px 0;
  margin-bottom: 20px;
}


.top-left {
  display: flex;

  .err-pe {
    margin-right: 10px;
  }

  .err-nums-con {
    display: flex;
    //padding: 0 10px;

    .err-nums-ti {
      color: #1ff2ff;
      margin-right: 10px;
    }

    .err-nums {
      color: red;
      margin-right: 10px;

    }
  }
}

.avatarClass {
  width: 100%;
  height: 100%;
  position: relative;
  background: url("~@/assets/agriculture/avatarTop.png") center no-repeat;
  background-size: 100% 100%;
  z-index: 92;

}

.avatarClassBottom {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 100;
  background: url("~@/assets/agriculture/zu_3204@_2x1.png") center no-repeat;
  background-size: 100% 100%;
  top: -100%;
}

::v-deep {
  //.el-table--border {
  //  border-bottom: #1adafb 0.5px solid !important;
  //}

  .el-popper {
    top: 735px !important;
    left: -360px !important;
    background: #051331 !important;

    .popper__arrow::after {
      border-bottom-color: #051331 !important;
    }
  }

  .el-month-table td.in-range div, .el-month-table td.in-range div:hover {
    background-color: #5e9bff;
  }

  .el-picker-panel, .el-picker-panel__sidebar {
    background-color: #051331 !important;
  }

  .el-picker-panel__shortcut {
    background-color: #051331;
    color: #0b57d0;
  }

  .el-picker-panel__icon-btn {
    color: #FFF;
  }

  .el-picker-panel__body {
    color: #FFF;
  }

  .el-month-table td .cell {
    color: #FFFFFF;
  }
}
</style>


