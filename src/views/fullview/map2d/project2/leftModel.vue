<template>
  <div class="eachcombox">
    <div v-loading="loading" class="contentbox">
      <div class="more-btn" @click="handleMore('3')">更多</div>
      <top-title-modle title="基本信息" top="-10px"/>
      <div class="base-con">
        <div class="items" v-for="(item, index) in baseList" :key="index">
          <div class="con-name">{{ item.name }}</div>

          <el-tooltip v-if="(project[item.key] && project[item.key].length > 15)" class="item" effect="dark"
                      :content="project[item.key]" placement="top" popper-class="popperClassAA_1">
            <div class="con-value">{{ project[item.key] }}</div>
          </el-tooltip>
          <div v-else class="con-value">{{ project[item.key] }}</div>

        </div>
      </div>

      <top-title-modle title="标段信息" top="-10px"/>

      <div class="bd-box" style="">
        <!--        <div class="zhezhaoshangup" v-if="bdList.length > 0"></div>-->
        <div class="zhezhaoshangdown" v-if="bdList.length > 2"></div>
        <!--        <cestc-scroll :data="bdList">-->
        <div class="bd-container" v-if="bdList.length > 0">
          <div class="bd-items" v-for="(item, index) in bdList" :key="index">
            <div class="bd-name">{{ item.sectionName }}</div>
            <div class="bd-btn" @click="handleEnter(item)">
              <img src="../../../../assets/agriculture/weibiaoti_1_title.png" class="va-image"/>
              进入
            </div>
          </div>
        </div>
        <div v-else style="display: flex;justify-content: center;align-items: center;flex-flow: column;">
          <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 300px;position: relative;top: -75px;"/>
          <div style="color: #FFF;position: relative;top: -175px;">暂无数据...</div>
        </div>

        <!--        </cestc-scroll>-->
      </div>

      <top-title-modle title="工程信息" top="-10px"/>

      <div class="termbox">
        <vue-seamless-scroll :data="buildList" style="height: 350px;overflow: hidden;" v-if="buildList.length > 0"
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
          <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 300px;position: relative;top: 50px"/>
          <div style="color: #FFF;position: relative;top: -50px;">暂无数据...</div>
        </div>

        <!--        </cestc-scroll>-->
      </div>

    </div>
    <common-dialog v-if="showRiskDialog" @closeDialog="closeRiskDialog" :dataInofs="project || {}"
                   :initType="dialogType"
                   title="基本信息"
                   :formList="formList" heeeei="height:680px;width:100%" weeei="1000px"/>
  </div>
</template>

<script>
import LineChart from "@/components/echarts/lineChart.vue";

const baseList = [
  {
    name: '项目名称',
    key: 'projectName'
  },
  {
    name: '项目编号',
    key: 'projectCode'
  },
  {
    name: '项目类型',
    key: 'projectTypeStr'
  },
  {
    name: '建设面积',
    key: 'areaStr',
    type: 'toLocaleString',
  },
  {
    name: '项目总资金',
    key: 'projectTotalCapitalStr',
    type: 'toLocaleString',
  },
  {
    name: '建设工期',
    key: 'constructionPeriod'
  },
  {
    name: '建设状态',
    key: 'status'
  },
  {
    name: '施工地址',
    key: 'constructionAddress'
  }
]

const formList = [
  {
    label: '立项年度',
    type: 'input',
    key: 'projectYear',
    width: '50%'
  },
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
    label: '项目类型',
    type: 'input',
    key: 'projectTypeName',
    width: '50%'
  },
  {
    label: '建设工期',
    type: 'input',
    key: 'constructionPeriod',
    width: '50%'
  },
  {
    label: '项目业主',
    type: 'input',
    key: 'projectProprietor',
    width: '50%'
  },
  {
    label: '建设目的',
    type: 'input',
    key: 'constructionPurposeName',
    width: '50%'
  },
  {
    label: '建设状态',
    type: 'input',
    key: 'progressStatusName',
    width: '50%'
  },
  {
    label: '地形面貌',
    type: 'input',
    key: 'terrainName',
    width: '50%'
  },
  {
    label: '耕地质量等级',
    type: 'input',
    key: 'projectGrade',
    width: '50%'
  },
  {
    label: '建设面积',
    type: 'input',
    key: 'area',
    width: '50%'
  },
  {
    label: '基础建设面积',
    type: 'input',
    key: 'basicsArea',
    width: '50%'
  },
  {
    label: '改造提升面积',
    type: 'input',
    key: 'liftingArea',
    width: '50%'
  },
  {
    label: '高校水灌溉面积(亩)',
    type: 'input',
    key: 'irrigatedArea',
    width: '50%'
  },
  {
    label: '建设所在地区',
    type: 'input',
    key: 'constructionRegion',
    width: '50%'
  },
  {
    label: '建设详细地址',
    type: 'input',
    key: 'constructionAddress',
    width: '50%'
  },
  {
    label: '建设总资金(万元)',
    type: 'input',
    key: 'projectTotalCapital',
    width: '50%'
  },
  {
    label: '中央资金渠道',
    type: 'input',
    key: 'channelName',
    width: '50%'
  },
  {
    label: '主要建设内容',
    type: 'textarea',
    key: 'content',
    width: '100%'
  },
  {
    label: '项目备注',
    type: 'textarea',
    key: 'remark',
    width: '100%'
  },
  // {
  //   label: '立项年度内容',
  //   type: 'textarea',
  //   key: 'sectionContent',
  //   width: '100%'
  // },
  {
    label: '二维码',
    type: 'qrCode',
    key: 'remark',
    width: '100%'
  }
]

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

export default {
  name: 'Grid',
  components: {
    LineChart,
    commonDialog
  },
  props: {
    dataInfos: {
      type: Object,
      default: () => {
        return {
          projectSectionConstruction: [],
          projectSections: [],
        }
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
      buildList: [],
      bdList: [],
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
      // immediate: true,
      handler(val) {
        if (val) {
          // project 基本信息 // projectSections 标段信息  // projectSectionConstruction 工程信息
          const {projectSections, projectSectionConstruction, project = {}} = val
          this.bdList = projectSections || []

          this.buildList = projectSectionConstruction || []
          // console.log('不知云的list', this.buildList)

          this.buildList.forEach(res => {
            // console.log('不知云的list', res)
            if (res.items) res.items.forEach(r => {
              const chineseCharacters = findChineseCharacters(r.itemValue || '');
              const newString = removeChar(r.itemValue || '', chineseCharacters);
              r.itemValueTop = chineseCharacters
              r.itemValueBottom = newString
            })
          })

          // console.log(this.buildList, '处理处理')
          let _project = {}
          if (project) {
            _project = Object.assign(_project, project)
          }
          _project.areaStr = `${(_project?.area || 0).toLocaleString()}亩`
          //项目类型 1、中央补助资金支持项目2、地方自筹自建项目3、其他部门实施项目
          switch (_project.projectType) {
            case 1:
              _project.projectTypeStr = '中央补助资金支持项目'
              break
            case 2:
              _project.projectTypeStr = '地方自筹自建项目'
              break
            case 3:
              _project.projectTypeStr = '其他部门实施项目'
              break
          }

          _project.dataRange = (_project?.startDate || '') + '-' + (_project?.endDate || '')
          _project.projectTotalCapitalStr = ((_project?.projectTotalCapital || 0).toLocaleString()) + '万元'
          this.project = _project
          this.project.constructionAddress = (this.project.constructionRegion || '') + this.project.constructionAddress
        }
      }
    }
  },

  methods: {
    handleMore(pageSize) {
      // console.log('1111', this.project)
      this.showRiskDialog = true
    },
    closeRiskDialog() {
      this.showRiskDialog = false
    },
    handleEnter(item) {
      // queryProjectSectionDashboardStatistic
      // console.log(item)
      this.$emit('changeShowType', item)
    },
    timestampToYMD(timestamp) {
      const date = new Date(timestamp * 1000) // 将时间戳转换成毫秒
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${year}/${month}/${day}`
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
  background: linear-gradient(80deg, #020c2c 70%, rgba(2, 12, 44, 0) 100%);
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
    top: -20px;
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
      }

      .con-value {
        font-family: Source Han Sans CN;
        font-weight: 500;
        font-size: 14px;
        color: #ffffff;
        width: 300px;
        text-align: right;
        white-space: nowrap; /* 禁止文本换行 */
        overflow: hidden; /* 隐藏超出部分的内容 */
        text-overflow: ellipsis; /* 当文本溢出时显示省略号 */
      }
    }
  }

  .contentbox {
    overflow: hidden;

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
      top: 13px;
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
      height: 420px;
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


  .bd-container {
    margin-top: -20px;
    height: 150px;
    overflow: auto;


    .bd-items {
      display: flex;
      justify-content: space-between;
      background: rgba(4, 32, 79, 0.5);
      align-items: center;
      height: 56px;
      //margin-top: 22px;
      margin-top: 10px;
      margin-bottom: 5px;
      margin-left: 5px;
      padding: 0 8px;
      width: calc(100% - 10px);

      .bd-name {
        //width: 242px;
        flex: 1;
        font-family: Source Han Sans CN;
        font-weight: 500;
        font-size: 14px;
        color: #ffffff;
        word-wrap: break-word;
        line-height: 16px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;


      }

      .bd-btn {
        cursor: pointer;
        width: 72px;
        height: 27px;
        line-height: 26px;
        background: rgba(60, 156, 255, 0.2);
        border-radius: 6px;
        border: 1px solid #05fcff;
        font-family: Source Han Sans CN;
        font-weight: 500;
        font-size: 14px;
        color: #05fcff;

        .va-image {
          width: 17px;
          height: 16px;
          margin-left: 7px;
          position: relative;
          top: 3px;
        }
      }
    }
  }
}

.select-popper-wrapper {
}

::v-deep {
  .el-popover {
    background: #0622468f;
    color: #fff;
    font-size: 12px;
    border: 1px solid #0622468f;
  }

  .el-popover--plain {
    padding: 6px 10px;
  }

  .el-popper .popper__arrow {
    display: none;
  }
}

.bd-box {
  height: 150px;
  position: relative;
  top: -20px;
  margin-right: 5px;
}

.zhezhaoshangup {
  background: linear-gradient(180deg, #041231 0%, rgba(0, 0, 0, 0) 100%);
  height: 50px;
  pointer-events: none;
  z-index: 11;
  position: absolute;
  top: -2px;
  left: 0;
  width: 100%;
}

.zhezhaoshangdown {
  pointer-events: none;
  height: 40px;
  background: linear-gradient(0deg, rgba(3, 26, 63, 0.9) 0%, rgba(3, 26, 63, 0.1) 100%);
  //background: rgba(3, 26, 63,0.7);
  z-index: 11;
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
}

.bd-container::-webkit-scrollbar {
  width: 4px; /* 纵向滚动条*/
  height: 4px; /* 横向滚动条 */
  background-color: #30446f !important;
  cursor: pointer;
}

/*定义滚动条轨道 内阴影*/
.bd-container::-webkit-scrollbar-track {
  background-color: #091739 !important;
  cursor: pointer;
}

/*定义滑块 内阴影*/
.bd-container::-webkit-scrollbar-thumb {
  background-color: #296396 !important;
  border: 3px solid #296396 !important;
  border-radius: 4px;
  cursor: pointer;
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
