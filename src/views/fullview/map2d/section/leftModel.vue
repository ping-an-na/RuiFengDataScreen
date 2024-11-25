<template>
  <div class="eachcombox">
    <div v-loading="loading" class="contentbox">
      <div class="more-btn" @click="handleMore('3')">更多</div>
      <top-title-modle title="基本信息2" top="-10px"/>
      <div class="base-con">

        <div class="items" v-for="(item, index) in baseList" :key="index">
          <div class="con-name">{{ item.name }}</div>

          <el-tooltip v-if="(project[item.key] && project[item.key].length > 15)" class="item" effect="dark"
                      :content="project[item.key]" placement="top" popper-class="popperClassAA_1">
            <div class="con-value">{{ project[item.key] }}</div>
          </el-tooltip>
          <div v-else class="con-value">
            <div v-if="item.type === 'toLocaleString'" >{{ (project[item.key] || 0).toLocaleString() }}{{ item.key === 'sectionCapital' ? '万元' : '' }}{{ item.key === 'area' ? '亩' : '' }}</div>
            <div v-else>{{ project[item.key] }}</div>
          </div>


        </div>
      </div>

      <top-title-modle title="工程信息" top="-10px"/>

      <div class="termbox">
        <!--        <cestc-scroll :data="buildList">-->
        <vue-seamless-scroll :data="buildList" style="height: 500px;overflow: hidden;" v-if="buildList.length > 0"
                             :class-option="classOption">

          <div class="btmbox">
            <div class="eh" v-for="(item, index) in buildList" :key="index">
              <div class="eh-name">
                <div style="transform: skew( -10deg , 0deg );">{{ item.label }}</div>
              </div>
              <div v-if="item.items" class="item-box">
                <div class="items" v-for="(i2, index2) in item.items" :key="index2">
                  <div class="item-value">
                    <!--                    {{ i2.itemValue }}-->
                    <span style="color:#EEF3FF;margin-right: 10px;">{{ i2.itemValueBottom }}</span>
                    <!-- <span class="unit">亩</span> -->
                    <span style="color: #93A5BD;font-size: 14px;">{{ i2.itemValueTop }}</span>
                  </div>
                  <div class="item-name">
                    <div class="xiaosanjiao-left"></div>
                    <div class="xiaosanjiao-right"></div>

                    {{ i2.itemName }}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </vue-seamless-scroll>
        <div v-else style="display: flex;justify-content: center;align-items: center;flex-flow: column;">
          <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 300px;position: relative;top: 50px;"/>
          <div style="color: #FFF;position: relative;top: -50px;">暂无数据...</div>
        </div>

        <!--        </cestc-scroll>-->
      </div>

    </div>
    <common-dialog v-if="showRiskDialog" @closeDialog="closeRiskDialog" :formList="formList" :dataInofs="project || {}"
                   title="基本信息"
                   :initType="dialogType" heeeei="height:620px;" weeei="1000px"/>
  </div>
</template>

<script>
import commonDialog from '../component/dialog.vue'

function findChineseCharacters(str) {
  const regex = /[\u4e00-\u9fff、]+/g;
  // console.log(str, regex, 'regexregex')
  let a = str.match(regex);
  return a ? a.join('') : '';
}

function removeChar(str, charToRemove) {
  // 使用正则表达式全局匹配要删除的字符，并替换为空字符串
  return str.replace(new RegExp(charToRemove, 'g'), '');
}

const formList = [
  {
    label: '项目编号',
    type: 'input',
    key: 'projectCode',
    width: '50%'
  },
  {
    label: '项目名称',
    type: 'input',
    key: 'projectName',
    width: '50%'
  },
  {
    label: '立项年度',
    type: 'input',
    key: 'approvalDateYear',
    width: '50%'
  },
  {
    label: '项目类型',
    type: 'input',
    key: 'projectTypeName',
    width: '50%'
  },
  {
    label: '标段编号',
    type: 'input',
    key: 'sectionCode',
    width: '50%'
  },
  {
    label: '标段名称',
    type: 'input',
    key: 'sectionName',
    width: '50%'
  },
  {
    label: '建设单位',
    type: 'input',
    key: 'constructionUnit',
    width: '50%'
  },
  {
    label: '标段状态',
    type: 'input',
    key: 'progressStatusName',
    width: '50%'
  },
  {
    label: '标段金额(万元)',
    type: 'input',
    key: 'sectionCapital',
    width: '50%'
  },
  {
    label: '建设工期',
    type: 'input',
    key: 'constructionPeriod',
    width: '50%'
  },

  {
    label: '合同编号',
    type: 'input',
    key: 'contractNo',
    width: '50%'
  },
  {
    label: '合同名称',
    type: 'input',
    key: 'contractName',
    width: '50%'
  },
  {
    label: '建设面积(亩)',
    type: 'input',
    key: 'area',
    width: '50%'
  },
  {
    label: '基础建设面积(亩)',
    type: 'input',
    key: 'basicsArea',
    width: '50%'
  },
  {
    label: '改造提升面积(亩)',
    type: 'input',
    key: 'liftingArea',
    width: '50%'
  },
  {
    label: '高效节水灌溉面积(亩)',
    type: 'input',
    key: 'irrigatedArea',
    width: '50%'
  },
  {
    label: '主要建设内容',
    type: 'input',
    // type: 'textarea',
    key: 'sectionContent',
    width: '50%'
  },
  {
    label: '建设所在地区',
    type: 'input',
    key: 'sectionRegion',
    width: '50%'
  },
  {
    label: '建设详细地址',
    type: 'input',
    key: 'sectionAddress',
    width: '50%'
  },

  // {
  //   label: '立项年度内容',
  //   type: 'textarea',
  //   key: 'sectionContent',
  //   width: '100%'
  // },
  {
    label: '标段备注',
    type: 'input',
    key: 'remark',
    width: '50%'
  },
  {
    label: '标段二维码',
    type: 'qrCode',
    key: 'remark',
    width: '100%'
  }
]

const baseList = [

  {
    name: '项目名称',
    key: 'projectName'
  },
  {
    name: '项目类型',
    key: 'projectTypeName'
  },
  {
    name: '标段编号',
    key: 'sectionCode'
  },
  {
    name: '标段名称',
    key: 'sectionName'
  },
  {
    name: '标段状态',
    //   name: '建设状态',
    key: 'status'
  },
  {
    name: '标段金额(万元)',
    //   name: '建设金额',
    key: 'sectionCapital',
    type:'toLocaleString',

  },
  {
    name: '建设工期',
    //   name: '建设周期',
    key: 'constructionPeriod'
  },
  {
    name: '建设面积(亩)',
    //   name: '建设规模',
    key: 'area',
    type:'toLocaleString',
  },
  {
    name: '施工地址',
    key: 'constructionAddress'
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
    commonDialog
  },
  props: {
    dataInfos: {
      type: Object,
      default: () => {
        projectConstruction: [] //项目建设情况
      }
    }
  },
  data() {
    return {
      classOption: {
        step: 0.4
      },
      serverData: {},
      loading: false,
      baseList: baseList,
      buildList: infos,
      project: {},
      riskListByPage: {},
      showRiskDialog: false,
      dialogType: '3',
      formList
    }
  },
  watch: {
    dataInfos: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          const {sectionVO = {}, projectSectionConstruction = [], projectClassificationTotalCapital} = val
          // console.log(sectionVO, projectSectionConstruction, 'sectionVO')
          this.buildList = projectSectionConstruction || []

          this.buildList.forEach(res => {
            // console.log('不知云的list', res)
            if (res.items) res.items.forEach(r => {
              const chineseCharacters = findChineseCharacters(r.itemValue || '');
              const newString = removeChar(r.itemValue || '', chineseCharacters);
              r.itemValueTop = chineseCharacters
              r.itemValueBottom = newString
            })
          })

          sectionVO.areaStr = sectionVO.area ? `${(sectionVO.area || 0).toLocaleString()}亩` : ''
          //项目类型 1、中央补助资金支持项目2、地方自筹自建项目3、其他部门实施项目
          switch (sectionVO.projectType) {
            case 1:
              sectionVO.projectTypeStr = '中央补助资金支持项目'
              break
            case 2:
              sectionVO.projectTypeStr = '地方自筹自建项目'
              break
            case 3:
              sectionVO.projectTypeStr = '其他部门实施项目'
              break
          }
          sectionVO.dataRange = sectionVO.startDate + '-' + sectionVO.endDate
          sectionVO.projectTotalCapitalStr = ((sectionVO.projectTotalCapital||0).toLocaleString()) + '万元'
          this.project = sectionVO
          this.project.constructionAddress = (this.project.constructionRegion || '') + this.project.constructionAddress
          this.project.approvalDateYear = this.project.approvalDate.slice(0, 4) || ''
        }
      }
    }
  },
  async created() {
  },
  mounted() {
  },
  destroyed() {
    // clearInterval(this.timeInterval)
  },
  methods: {
    handleMore(pageSize) {
      this.showRiskDialog = true
    },
    async getAnalysisData(val) {
      this.gridLineChart = rankBarChartOption
    },
    closeRiskDialog() {
      this.showRiskDialog = false
    }
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

  .base-con {
    margin: 0 3px;
    position: relative;
    top: -15px;

    .items {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 28px;
      background: rgba(4, 32, 79, 0.5);
      align-items: center;
      padding: 0 20px;
      margin-bottom: 12px;

      .con-name {
        font-family: Source Han Sans CN;
        font-weight: 500;
        font-size: 14px;
        color: #d8d8d8;
        padding-right: 10px;
      }

      .con-value {
        font-family: Source Han Sans CN;
        font-weight: 500;
        font-size: 14px;
        color: #ffffff;
        flex: 1;
        text-align: end;

        white-space: nowrap; /* 禁止文本换行 */
        overflow: hidden; /* 隐藏超出部分的内容 */
        text-overflow: ellipsis; /* 当文本溢出时显示省略号 */
      }
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

    .more-btn {
      position: absolute;
      right: 22px;
      top: 10px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      font-size: 14px;
      color: #eef3ff;
      line-height: 8px;
      cursor: pointer;
      z-index: 4;
    }

    .termbox {
      width: 100%;
      height: 500px;
      z-index: 1;
      // overflow: hidden;
      overflow-y: auto;
      //overflow: hidden;
      position: relative;
      top: -20px;

      .btmbox {
        .eh {
          padding: 0 28px;
          padding-top: 30px;
        }

        .eh-name {
          width: 100%;
          height: 32px;
          background: url('~@/assets/agriculture/zu_3215@2x2.png') top center no-repeat;
          background-size: 100% 100%;
          line-height: 32px;
          margin-bottom: 6px;
          color: #EEF3FF;
          // background: linear-gradient(0deg, #8fb9f7 0%, rgba(255, 255, 255, 0.87) 100%);
          // -webkit-background-clip: text;
          // -webkit-text-fill-color: transparent;
          font-size: 14px;
          padding-left: 25px;
          //transform: skew( -10deg , 0deg );
          font-weight: 900;

        }

        .item-box {
          display: flex;
          flex-wrap: wrap;
        }

        .items {
          width: 33%;

          .item-value {
            font-family: Source Han Sans CN;
            font-weight: 400;
            font-size: 18px;
            color: #eef3ff;
            width: 93px;
            height: 41px;
            background: linear-gradient(0deg, rgba(25, 198, 255, .5) 0%, rgba(10, 70, 214, .5) 25%, rgba(0, 0, 0, 0) 50%);

            //opacity: 0.5;
            text-align: center;
            line-height: 41px;
            margin-bottom: 2px;
            overflow: auto;
          }

          .unit {
            font-family: Source Han Sans CN;
            font-weight: 400;
            font-size: 12px;
            color: #93a5bd;
          }

          .item-name {
            font-family: Source Han Sans CN;
            font-weight: 400;
            font-size: 14px;
            color: #eef3ff;
            margin-bottom: 20px;
            margin-top: 5px;
            text-align: center;
            width: 93px;
            position: relative;
          }
        }
      }
    }
  }
}
.xiaosanjiao-left {
  top: 3px;
  //transform: translateY(-50%);
  position: absolute;
  left: -5px;
  background: rgba(0,0,0,0);
  height:0;
  width:0;
  overflow: hidden;
  font-size: 0;
  line-height: 0;
  border-color: transparent transparent transparent #FF9600;
  border-style:solid dashed dashed dashed;
  border-width:5px;
}

.xiaosanjiao-right {
  top: 3px;
  //transform: translateY(-50%);
  right: -5px;
  position: absolute;
  background: rgba(0,0,0,0);

  height:0;
  width:0;
  overflow: hidden;
  font-size: 0;
  line-height: 0;
  border-color: transparent #FF9600 transparent transparent;
  border-style:solid dashed dashed dashed;
  border-width:5px;
}
</style>
