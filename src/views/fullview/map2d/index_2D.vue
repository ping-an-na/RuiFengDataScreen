<!--
 * @Description: 二维地图
-->
<template>
  <div id="fullview2d" v-loading="mapLayerLoading" cestc-loading-background="rgba(0, 212, 255, 0.35)"
       cestc-loading-text="图层处理中" class="full-view" :class="{ 'pack-up': !infoUnfold }">
    <!--地图-->
    <div id="mapbg" ref="mapRef"/>
    <!--    <div class="wrap">-->
    <!--      <div class="ScaleBox" ref="ScaleBox" :style="{ width: widthA + 'px', height: heightA + 'px' }">-->
    <!-- 遮罩层-->
    <div :class="showType === 5?'maskClassWu':'maskClass'"></div>

    <div>
      <!-- 标段看板没有 -->
      <mapTool @commond="_mapTool" :infoUnfold="infoUnfold" :showType="showType" v-if="showType !== 5"
               class="map-tool-model"/>
      <!--顶部Title 下的看板  -->
      <top-model :currentDistrictName="currentDistrictName" :showType="showType" :cachePath="cachePath" @back="_back"/>
      <!--看板物-->
      <section class="normal-section">
        <!-- 省、市看板 -->
        <template v-if="(showType === 1 || showType === 2) && infoUnfoldTime">
          <!-- left -->
          <left-model ref="leftModel" :dataInfos="allModelInfos" class="left-model"/>
          <!-- middle Top -->
          <div class="mid-top-con">
            <div class="middle-top" v-if="middleTopArrListUUID">
              <div v-for="(item, index) in middleTopArrList" :key="index">
                <img class="top-image" :src="item.image" alt/>
                <div class="top-items">
                  <div class="items-name">{{ item.name || "-" }}</div>
                  <div class="items-value">
                    <template v-for="(i,x) in item.valueStr">
                      <animate-number ref="myNum" :from="0" :to="i" :formatter="formatter"
                                      mode="manual" duration="1000"></animate-number>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- middle bottom -->
          <div class="mid-mi-con mid-bot-81" :class="!infoUnfold?'mid-mi-con-infoUnfold':'mid-mi-con-infoUnfold-up'">
            <div class="middle-bottom mid-mi-con-bg-hei"
                 :class="!infoUnfold?'mid-mi-con-infoUnfold':'mid-mi-con-infoUnfold-up'">
              <div class="bo-top-con">
                <top-title-modle title="资金进度"/>
              </div>
              <div class="bo-line-chart" v-if="financialProgress.length > 0">
                <div class="bo-li-unit">单位： 万元</div>
                <line-chart ref="lineChartSheng" :chart-data="moneyLineChart"></line-chart>
              </div>
              <div v-else
                   style="display: flex;justify-content: center;align-items: center;flex-flow: column;height: 100%;width: 100%;">
                <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 300px;position: relative;top: -40px"/>
                <div style="color: #FFF;position: relative;top: -140px;">暂无数据...</div>
              </div>
            </div>
          </div>

          <!-- right -->
          <right-model ref="rightModel" :dataInfos="allModelInfos" class="right-model"/>
        </template>
        <!-- 县  -->
        <template v-if="showType === 3 && infoUnfoldTime ">

          <county-left-modle
              ref="countyLeftModle"
              :dataInfos="allModelInfos"
              :riskList="riskList"
              :riskParams="riskParams"
              class="left-model"/>

          <!-- middle Top -->
          <div class="middle-top" v-if="middleTopArrListUUID">
            <div v-for="(item, index) in middleTopArrList" :key="index">
              <img class="top-image" :src="item.image"/>
              <div class="top-items">
                <div class="items-name">
                  {{ item.nameQu || "-" }}
                </div>

                <div class="items-value">
                  <template v-for="(i,x) in item.valueStr">
                    <animate-number ref="myNum" :from="0" :to="i" :formatter="formatter"
                                    mode="manual" duration="1000"></animate-number>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- middle bottom -->
          <div class="mid-mi-con mid-bot-81" :class="!infoUnfold?'mid-mi-con-infoUnfold':'mid-mi-con-infoUnfold-up'">

            <div class="middle-bottom mid-mi-con-bg-hei"
                 :class="!infoUnfold?'mid-mi-con-infoUnfold':'mid-mi-con-infoUnfold-up'">

              <div class="bo-top-con">
                <!---->
                <div class="more-btn" @click="handleMore(1)">更多</div>
                <top-title-modle title="资金进度"/>
              </div>

              <div class="bo-line-chart">
                <div class="bo-li-unit">单位： 万元</div>
                <line-chart ref="lineChartQv" :chart-data="moneyLineChart"></line-chart>
              </div>

              <!--              <div v-else style="display: flex;justify-content: center;align-items: center;flex-flow: column;">-->
              <!--                <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 300px;position: relative;"/>-->
              <!--                <div style="color: #FFF;position: relative;top: -100px;">暂无数据...</div>-->
              <!--              </div>-->

            </div>

          </div>

          <county-right-model ref="countyRightModel" :dataInfos="allModelInfos" class="right-model"/>
        </template>


        <!-- 省、市、区的 区域说明  -->
        <districtTip ref="districtTip" :class="infoUnfoldTime?'district-tip':'district-project-tip-dongdong'"
                     v-if="[1, 2, 3].includes(showType)"
                     @districtTipShowFlagEvent="districtTipShowFlagEvent"
                     :districtTipShowFlag="districtTipShowFlag"/>
        <!-- 项目看板  -->
        <template v-if="showType === 4 || showType === 5">
          <!--left-->
          <project-left-model v-show="showType === 4  && infoUnfoldTime" :dataInfos="allModelInfos"
                              @changeShowType="changeShowType"
                              class="left-model"/>
          <!--center-->
          <div v-show="showType === 4  && infoUnfoldTime" class="mid-mi-con"
               :class="!infoUnfold?'mid-mi-con-infoUnfold':'mid-mi-con-infoUnfold-up'">
            <projectmiddle-modle :dataInfos="allModelInfos" class="middle-bottom mid-mi-con-bg-hei"
                                 :class="!infoUnfold?'mid-mi-con-infoUnfold':'mid-mi-con-infoUnfold-up'"/>
          </div>
          <!--right-->
          <project-right-modle v-show="showType === 4  && infoUnfoldTime" :dataInfos="allModelInfos"
                               :riskList="riskList"
                               :riskParams="riskParams" class="right-model"/>

          <!-- 项目看板区域说明 -->
          <districtProjectTip @districtTipShowFlagEvent="districtTipShowFlagEvent"
                              :districtTipShowFlag="districtTipShowFlag" v-show="showType === 4 "
                              :class="infoUnfoldTime?'district-project-tip':'district-project-tip-dongdong'"
                              :infoUnfold="infoUnfold"
                              @upDataMap="upDataMap"/>
        </template>

        <!-- 标段看板 区域说明  -->
        <div v-if="showType === 5">
          <!-- left -->
          <section-left-model :dataInfos="allModelInfosXiangmu"/>
          <se-middle-model :dataInfos="allModelInfosXiangmu"/>
          <se-right-model :dataInfos="allModelInfosXiangmu" :riskList="riskListXiangmu"
                          :riskParams="riskParamsXiangmu" class="right-model-two"/>
        </div>

        <!--搜索框-->
        <quick-search ref="quickSearchRef" v-if="showType !== 4 && showType !== 5" :dataInfos="boardInfos"
                      @updateProject="_updateProject" :class="infoUnfoldTime?'quick-search':'quick-search-dongdong'"
                      :riskParams="riskParams"
                      :infoUnfold="infoUnfold" @inputClick="inputClick"/>
      </section>
      <!-- <list-dialog v-if="showMiddleDialog" @closeDialog="closeRiskDialog" /> -->
      <div class="risk-dia">
        <common-dialog v-if="showRiskDialog" @closeDialog="closeRiskDialog" :dataInofs="riskListByPage || {}"
                       @handleMore="handleMore"
                       :columnList="columnList" :initType="dialogType" title="资金进度列表" :hasOperate="false"/>
      </div>
    </div>
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script>
// window._AMapSecurityConfig = {
//   securityJsCode: '5a392e6611046a5d4c8a256643637973'
// }


import simplify from '@turf/simplify';
import dissolve from '@turf/dissolve';
import {featureCollection, polygon} from '@turf/helpers';


import mapTool from './map-tool.vue'
import leftModel from './leftmodel'
import rightModel from './rightModel'
import topModel from './topModel'
import {moneyProcess} from './newEchartsOptions.js'
import LineChart from '@/components/echarts/lineChart'
import listDialog from '../map2d/component/listDialog.vue'
// 标段展示
import sectionLeftModel from './section/leftModel.vue'
import seMiddleModel from './section/middleModel.vue'
import seRightModel from './section/right.vue'

// 县
import countyLeftModle from './county/leftModle.vue'
import countyRightModel from './county/rightModel.vue'

//项目2
import projectLeftModel from './project2/leftModel.vue'
import projectmiddleModle from './project2/middleModle.vue'
import projectRightModle from './project2/rightModle.vue'

import commonDialog from './component/dialog.vue'

import quickSearch from './component/quikSearch'

import QRCode from 'qrcodejs2-fix';


// API
import moduleSrv from '@/api/nongtianApi'

// 坐标格式化
const WKT = require('terraformer-wkt-parser')
// 公共方法
import {ProjectStatus, PointConstructionMap, LineConstructionMap, shenglue} from './map-constant'
// 区域说明
import districtTip from './district-tip.vue'
// 区域说明-项目
import districtProjectTip from './district-project-tip.vue'
import {debounce} from '@/utils'

// 地图配置
const MAPCONFIG = window.GLOBAL_CONFIG.erwei

// 默认
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

export default {
  components: {
    leftModel,
    rightModel,
    LineChart,
    topModel,
    listDialog,
    commonDialog,

    sectionLeftModel,
    seMiddleModel,
    seRightModel,

    countyLeftModle,
    countyRightModel,

    projectLeftModel,
    projectmiddleModle,
    projectRightModle,

    // middleDialog,
    quickSearch,
    mapTool,
    districtTip,
    districtProjectTip
  },
  mixins: [],
  props: ['scaleA'],
  watch: {
    // 计算 屏幕
    scaleA(newV, oldV) {
      // console.log(newV, oldV, 'newV,oldVnewV,oldV')
      let mapContent = document.getElementById("mapbg");

      let widthOff = 100 * newV
      let heightOff = 100 * newV

      mapContent.style.transform = `scale(${1 / newV})`
      mapContent.style.width = widthOff + "%"
      mapContent.style.height = heightOff + "%"

    },
  },
  data() {
    return {
      mouseLnglat: '',// 地图鼠标的 移动 位置
      queryProjectAllListDataObj: {
        itemId: '',
        params: {},
      },
      districtTipShowFlag: false, // 展示项目看板
      isShowTypeFive: false,  // 是否是 项目 标记 详情
      createInfoWindowTwo: null,   // 第二个 弹窗
      createInfoWindowOne: null,  // 第一个 弹窗
      createInfoWindowTwores: null,  // 弹窗 总体


      financialProgress: [],// 资金 数组

      setIntervalId: null,
      showType: 1, // 1-省 2-市 3-县 4-项目 5-标段
      showTypeLoading: null,
      infoUnfoldTime: true, // 全屏 or 非全屏
      infoUnfoldTimeId: '',// 全屏 or 非全屏 的 定时 id
      currentDistrictName: '', // 当前看板的省、市、区、项目、标段名称
      cityclickInfo: '', //当前区的区编号
      cachePath: [], // 缓存的路径
      districtLayerGroup: null, // 行政区域图层
      projectMarkerLayers: [], // 项目图层集合
      projectMarkerLayersJvhe: null, // 项目聚合
      infoWindow: null, // 自定义弹窗实例
      infoUnfold: true, // 地图外的其他信息是否展开， 默认展开

      projectLayers: [], // 项目图版图层集合
      pointConstructionLayers: [], // 点状工程图层集合
      lineConstructionLayers: [], // 线状工程图层集合
      areaConstructionLayers: [], // 面状工程图层集合

      warnInterval: null,
      mapLayerLoading: false,
      boardInfos: {}, // 顶部数据
      allModelInfosXiangmu: {
        // 看板数据
        areaProjectStatistics: {}, // 区域统计
        financialProgress: [], //资金进度
        platformActivity: [], // 平台活跃度
        projectSectionConstruction: {} // 标段建设情况
      },
      allModelInfos: {
        // 看板数据
        areaProjectStatistics: {}, // 区域统计
        financialProgress: [], //资金进度
        platformActivity: [], // 平台活跃度
        projectSectionConstruction: {} // 标段建设情况
      },
      moneyLineChart: {},
      riskList: [],
      riskListXiangmu: [],

      showRiskDialog: false,
      childInfoList: [], // 子级映射表
      nowModelId: '', //当前看板 id
      middleTopArrListUUID: true,
      // 首页 上边信息展示
      middleTopArrList: [
        {
          name: '项目数量(个)',
          nameQu: "项目数量(个)",
          key: 'projectTotal',
          value: 0,
          image: require('@/assets/agriculture/zu3154_2x.png'),
          valueList: [],
        },

        {
          name: '标段数量(个)',
          nameQu: "标段数量(个)",

          key: 'sectionTotal',
          value: 0,
          image: require('@/assets/agriculture/zu3155_2x.png'),
          valueList: [],
        },
        {
          name: '总规划建设(万亩)',
          nameQu: "总规划建设(亩)",
          key: 'planningConstruction',
          value: 0,
          image: require('@/assets/agriculture/zu3_1.png'),
          valueList: [],
        },
        {
          name: '已完成建设(万亩)',
          nameQu: "已完成建设(亩)",
          key: 'constructionCompleted',
          value: 0,
          image: require('@/assets/agriculture/zu4_2.png'),
          valueList: [],
        },
        {
          name: '建设中(万亩)',
          nameQu: "建设中(亩)",
          key: 'underConstruction',
          value: 0,
          image: require('@/assets/agriculture/zu5_3.png'),
          valueList: [],
        }
      ],
      riskParams: {},
      riskParamsXiangmu: {},
      dialogType: '1',
      riskListByPage: {},
      columnList: columnList,
      temporaryProjectList: [],
      AMap: null,
      cityPolygons: [], // 城市多边形
      textArr: [], // 城市名字
      widthA: 1920,
      heightA: 1080,
      // scaleA: 1,
      oneIdBack: '',
      ifSuoQv: false,
      setNumber: 0,
      // 线覆盖物
      lineEngineering: {
        psaqg: [],//排水暗渠(管)
        cqmqg: [],//衬砌明渠(沟)
        sjgqxj: [],//疏浚沟渠新建
        yhdl: [],//硬化道路
        jgd: [],//机耕道
        scdl: [],//生产道路
        scdlXj: [],//生产道路-新建
        tjdl: [],//田间道路
        tjdlXj: [],//田间道路-新建
        ntlw: [],//农田林网
        apfh: [],//岸坡防护
        gdzl: [],//沟道治理
        pmfh: [],//坡面防护
        dyxl: [],//低压线路
        kvyxdxl: [],//10kv以下的高压输电线路
      },
      // 点覆盖物
      pointEngineering: {
        tangyan: [],//'塘堰(坝)'
        xxlhb: [],//小型拦河坝
        nyj: [],//农用井
        xxjyss: [],//小型集雨设施
        dhx: [],//倒虹吸
        nq: [],//农桥
        shuiz: [],//水闸
        lingcao: [],//渡槽
        byq: [], // 变压器
        dieshui: [],//跌水
        qita: [],//其他
        handong: [],//涵洞
        pdx: [],//配电箱
        bengzhan: [],//泵站
      },
      //面覆盖物
      surfaceEngineering: {
        ggps: [], // 灌溉排水
        tdgl: [], // 土地改良
        tdpz: [] // 土地平整
      },
      // 图斑覆盖物
      mulchEngineering: [],
      childInfoListA: [],
      xzMapCenter: null, // 获取行政中心
      apiMapCenteer: null, // api 获取行政中心 districtCoordinate
      horizonKivOut: null, //视野的定时
    }
  },
  computed: {
    showMiddleDialog() {
      return false
    }
  },
  created() {
    // loding
    if (!this.showTypeLoading) this.showTypeLoading = this.$loading({
      lock: true,
      text: '资源加载中...',
      spinner: 'el-icon-loading',
      background: 'rgba(9, 28, 49, 0.8)'
    });
  },
  mounted() {

    console.log(this.childInfoList, '11')

    // 地图初始化
    window._AMapSecurityConfig = {
      securityJsCode: MAPCONFIG.gaodeSecret
    }
    this.initMap() // 初始化地图及实例

    if (this.setIntervalId) clearTimeout(this.setIntervalId)
    this.setIntervalId = setInterval(() => {
      let myNum = this.$refs['myNum']
      myNum.forEach(res => {
        res.start()
      })
      if (this.showType === 1 || this.showType === 2) {
        let leftModel = this.$refs['leftModel']
        if (leftModel) leftModel.timeOut()

        let lineChartSheng = this.$refs['lineChartSheng']
        if (lineChartSheng) lineChartSheng.timeOut()

        let rightModel = this.$refs['rightModel']
        if (rightModel) rightModel.timeOut()

      }
      if (this.showType === 3) {
        let countyLeftModle = this.$refs['countyLeftModle']
        if (countyLeftModle) countyLeftModle.timeOut()

        let lineChartQv = this.$refs['lineChartQv']
        if (lineChartQv) lineChartQv.timeOut()

        let countyRightModel = this.$refs['countyRightModel']
        if (countyRightModel) countyRightModel.timeOut()
      }


    }, 10000);

  },
  beforeDestroy() {
    // 删除挂载 监听
    if (this.setIntervalId) clearTimeout(this.setIntervalId)
    if (this.warnInterval) clearInterval(this.warnInterval)
    // 接触地图图层的事件
    if (this.districtLayers?.length) {
      this.districtLayers.forEach(layer => {
        // 添加鼠标事件
        layer.off('mouseover', this.onMouseOverPolygon)
        // 添加离开事件监听
        layer.off('mouseout', this.onMouseOutPolygon)
        // 添加鼠标区域图层点击事件
        layer.off('click', this.onMouseClickPolygon.bind(this))
      })
    }
    try {
      window?.$aMap?.clearEvents('mouseover')
      window?.$aMap?.clearEvents('mouseout')
      window?.$aMap?.clearEvents('click')
    } catch (error) {
    }
  },

  methods: {
    /**
     * 弹窗 点击
     * @param v
     */
    districtTipShowFlagEvent(v) {
      this.districtTipShowFlag = v
    },

    /**
     * 保留两位小数
     * @param num
     * @returns {string|*|string}
     */
    formatter: function (num) {
      if (0) return num
      else if (num % 1 !== 0) return num.toFixed(2)
      else return num
    },
    /**
     * 输入框事件
     * @param item
     */
    inputClick(item) {
      window.$aMap.clearMap();
      if (this.projectMarkerLayersJvhe) this.projectMarkerLayersJvhe.setData([])
      this.initProject(item)
    },
    /**
     * 获取全部项目
     * @param params
     * @param isBl
     */
    queryProjectAllList(params, isBl = false) {
      if (this.queryProjectAllListDataObj.itemId) window.clearTimeout(this.queryProjectAllListDataObj.itemId)

      if (isBl) {
        this.queryProjectAllListDataObj.itemId = setTimeout(() => {
          if (this.showType !== 1 && this.showType !== 2 && this.showType !== 3) return
          // 清除上条记录
          this.temporaryProjectList = []
          moduleSrv.queryProjectAllList({...params})
              .then(res => {
                const {code, data} = res
                if (code === '200') {
                  this.temporaryProjectList = data
                  this._updateProject(data)
                  this.queryProjectAllList(params, true)
                }
              })
        }, 60000)
      } else {
        if (this.showType !== 1 && this.showType !== 2 && this.showType !== 3) return
        // 清除上条记录
        this.temporaryProjectList = []
        moduleSrv.queryProjectAllList({...params})
            .then(res => {
              const {code, data} = res
              if (code === '200') {
                this.temporaryProjectList = data
                this._updateProject(data)
                this.queryProjectAllList(params, true)
              }
            })
      }

    },
    /**
     * 弹窗分页事件
     * @param pageSize
     */
    handleMore(pageSize) {
      // 请求接口数据
      let query = {...this.riskParams, id: this.riskParams.districtDivisionId}
      moduleSrv
          .queryProjectFinancialProgressListPage({
            query: query,
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
    /**
     * 地图工具事件
     * @param action
     * @private
     */
    _mapTool(action) {
      switch (action) {
        case 'center':
          if (this.showType === 4) {
            let mapData = []
            Object.keys(this.lineEngineering).forEach(key => {
              this.lineEngineering[key].forEach(res => {
                mapData.push(res)
              })
            });
            Object.keys(this.pointEngineering).forEach(key => {
              this.pointEngineering[key].forEach(res => {
                mapData.push(res)
              })
            });
            Object.keys(this.surfaceEngineering).forEach(key => {
              this.surfaceEngineering[key].forEach(res => {
                mapData.push(res)
              })
            });
            this.mulchEngineering.forEach(res => {
              mapData.push(res)
            })
            // console.log(mapData)
            window.$aMap.setFitView(mapData, true, [50 * this.scaleA, 350 * this.scaleA, 100 * this.scaleA, 100 * this.scaleA]);//地图自适应
          } else {
            this.horizonKiv()
          }
          break
        case 'zoom-in':
          window.$aMap.zoomIn()
          break
        case 'zoom-out':
          window.$aMap.zoomOut()
          break
        case 'pack-up':
          // 收起
          // console.log('收起')
          this.infoUnfold = false
          this.districtTipShowFlag = false
          if (this.infoUnfoldTimeId) window.clearTimeout(this.infoUnfoldTimeId)
          this.infoUnfoldTimeId = setTimeout(() => {
            this.infoUnfoldTime = false
          }, 3000)
          break
        case 'unfold':
          // 展开
          this.infoUnfold = true
          this.districtTipShowFlag = true
          // console.log('展开')
          if (this.infoUnfoldTimeId) window.clearTimeout(this.infoUnfoldTimeId)
          this.infoUnfoldTime = true
          break

        default:
          break
      }
    },
    /**
     * 返回上级事件
     * @private
     */
    _back() {
      this.cityclickInfo = ''
      this.isShowTypeFive = false
      if (this.showType === 5) {
        this.showType = 4
        this.infoUnfold = true
        return
      }
      let arrQvchong = []
      let qvChongId = null

      this.cachePath.forEach(res => {
        // console.log(res)
        if ((res.id + '_' + res.showType) !== qvChongId) {
          arrQvchong.push(res)
          qvChongId = (res.id + '_' + res.showType)
        }
      })

      this.cachePath = arrQvchong
      this.cachePath.forEach(res => {
        // console.log(res)
      })

      // 先清空 覆盖物
      window.$aMap.clearMap();
      if (this.projectMarkerLayersJvhe) this.projectMarkerLayersJvhe.setData([])
      // 返回缓存的上一级看板
      // 先删除当前的缓存
      // console.log(this.cachePath, '----------')

      const {childInfoList} = this.cachePath.pop()
      this.cachePath.forEach(res => {
      })
      // 然后取出当前的上一级数据
      let cachePathPop = this.cachePath.pop()
      const showType = cachePathPop.showType
      const currentDistrictName = cachePathPop.currentDistrictName
      const id = cachePathPop.id
      if (showType === 2) this.childInfoListA = cachePathPop.childInfoList

      this.ifSuoQv = false
      if (showType === 1) {
        this.nowModelId = this.oneIdBack
      } else {
        this.nowModelId = id
      }

      this.childInfoList = childInfoList || JSON.parse(JSON.stringify(this.childInfoList))
      if (showType) {
        this.showType = showType
      }
      if (currentDistrictName) {
        this.currentDistrictName = currentDistrictName
      }

      switch (this.showType) {
        case 1:
          this.initProvince()
          break
        case 2:
          this.initCity('city', this.currentDistrictName, '1')
          break
        case 3:

          this.initDistrict('district', this.currentDistrictName)
          break

        default:
          break
      }
    },
    /**
     * 地图初始化事件
     * @returns {Promise<void>}
     */
    async initMap() {
      await this.$nextTick()
      let that = this
      AMapLoader.reset()
      const _mapEl = this.$refs.mapRef
      AMapLoader?.load({
        // key: '6af6f8cd802ae0707eda51a4a5b8c2e4', // 申请好的Web端开发者Key，首次调用 load 时必填
        key: MAPCONFIG.gaodeKey,
        version: '2.0',
        plugins: ['AMap.DistrictSearch', "AMap.MarkerCluster"]
      }).then(AMap => {
        that.AMap = AMap
        if (!window.$aMap) {
          window.$aMap = new AMap.Map(_mapEl, {
            zoom: MAPCONFIG.zoom,
            center: [MAPCONFIG.center[1], MAPCONFIG.center[0]],
            layers: [new AMap.TileLayer.Satellite()]
          })

          window.$aMap.on('mousemove', function (e) {
            var lnglat = e.lnglat;
            that.mouseLnglat = lnglat
          });


          //行政区划查询
          var opts = {
            extensions: "all",
            subdistrict: 1,
            showbiz: false,
            level: 'city', // 查询行政级别为 市
          };
          // // 区域查询服务实例
          if (!window.$districtSearch) {
            // let opts = { }
            window.$districtSearch = new AMap.DistrictSearch({
              subdistrict: 1, // 获取边界需要返回下级行政区
              extensions: 'all', // 返回行政区边界坐标组等具体信息
              level: 'city', // 查询行政级别为 市
              showbiz: false
            })
          }
          // // 创建一个空的区域图层集合
          // if (!this.districtLayerGroup) {
          //   this.districtLayerGroup = new AMap.LayerGroup()
          // }

          if (!this.infoWindow) {
            let A = -45 * this.scaleA
            this.infoWindow = new AMap.InfoWindow({
              isCustom: true, //使用自定义窗体
              autoMove: false,
              closeWhenClickMap: true,
              offset: new AMap.Pixel(16, A)
            })
            let that = this
            this.infoWindow.on('mouseover', () => { // 划入创建窗口
              that.createInfoWindowTwo = true
            })
            this.infoWindow.on('mouseout', () => {  // 鼠标悬浮marker关闭自定义的信息窗体
              that.createInfoWindowTwo = false
              if (!that.createInfoWindowTwo && !that.createInfoWindowOne) that.infoWindow?.close()
            })
            this.infoWindow.on('click', () => { // 鼠标点击marker进入项目看板
              window.$aMap.clearMap();
              if (that.projectMarkerLayersJvhe) that.projectMarkerLayersJvhe.setData([])
              that.initProject(that.createInfoWindowTwores)
            })

          }
        }
        this.getInitInfos() //获取看板顶部信息
      })
    },

    /**
     * 根据项目数据进行地图中项目点位
     * @param list
     * @private
     */
    _updateProject(list) {

      // console.log(list, '定位-> 第二个问题重灾区')
      if (this.projectMarkerLayersJvhe) this.projectMarkerLayersJvhe.setData([])
      this.projectMarkerLayers.map(res => {
        window.$aMap.remove(res);
      })


      let arrList = []
      list.forEach(res => {
        if (res.coordinate) {
          if (res.coordinate.indexOf('POINT') === -1) {
            const coordinate = JSON.parse(res.coordinate)
            res.coordinate = `POINT(${coordinate[0]} ${coordinate[1]})`
            res.lnglat = WKT.parse(res.coordinate).coordinates
          }
          arrList.push(res)
        }
      })
      // console.log(arrList, 'arrListarrList')
      let that = this
      var _renderMarker = function (context) {
        let res = context.data[0]
        let icon = ProjectStatus[res.progressStatus] || ProjectStatus["1"]
        context.marker.setIcon(new that.AMap.Icon({image: icon, imageSize: [18, 18]}))
        context.marker.setAnchor('bottom-center')
        context.marker.setExtData(res)
        context.marker.setzIndex(21)
        context.marker.on('mouseover', () => { // 划入创建窗口
          that.createInfoWindowTwores = res
          that.createInfoWindowOne = true
          that.createInfoWindow(context.marker, res)
        })
        context.marker.on('mouseout', () => {  // 鼠标悬浮marker关闭自定义的信息窗体

          setTimeout(() => {
            that.createInfoWindowOne = false
            if (!that.createInfoWindowTwo && !that.createInfoWindowOne) that.infoWindow?.close()
          }, 100)

        })
        context.marker.on('click', () => { // 鼠标点击marker进入项目看板
          if (that.projectMarkerLayersJvhe) that.projectMarkerLayersJvhe.setData([])
          window.$aMap.clearMap();
          that.initProject(res)
        })
      }
      var _renderClusterMarker = function (context) {
        let icon = shenglue
        context.marker.setIcon(new that.AMap.Icon({image: icon, imageSize: [16, 16]}))
        context.marker.setAnchor('bottom-center')
        context.marker.setzIndex(21)
      }

      // 聚合效果
      // if (!this.projectMarkerLayersJvhe) {
      //   this.projectMarkerLayersJvhe = new this.AMap.MarkerCluster(window.$aMap, arrList, {
      //     gridSize: 60, // 设置网格像素大小 多远聚集到一起
      //     renderClusterMarker: _renderClusterMarker, // 聚合点样式
      //     renderMarker: _renderMarker, // 非聚合点样式
      //   });
      // } else {
      //   this.projectMarkerLayersJvhe.setData(arrList)
      // }
      // return

      list.forEach(async item => {
        if (item.coordinate) {
          if (item.coordinate.indexOf('POINT') === -1) {
            const coordinate = JSON.parse(item.coordinate)
            item.coordinate = `POINT(${coordinate[0]} ${coordinate[1]})`
          }
          // Z_绘制点
          let coordinate = WKT.parse(item.coordinate)
          let icon = ProjectStatus[item.progressStatus] || progressStatus[1]
          let marker = new this.AMap.Marker({
            map: window.$aMap,
            position: coordinate.coordinates,
            icon: new this.AMap.Icon({image: icon, imageSize: [18, 18]}),
            extData: item,
            anchor: 'bottom-center', //设置锚点
            zIndex: 21,
          })
          marker.on('mouseover', () => {
            // 划入创建窗口
            this.createInfoWindow(marker, item)
          })
          // 鼠标悬浮marker关闭自定义的信息窗体
          marker.on('mouseout', () => {
            this.infoWindow?.close()
          })
          // 鼠标点击marker进入项目看板
          marker.on('click', () => {
            window.$aMap.clearMap();
            this.initProject(item)
          })
          this.projectMarkerLayers.push(marker)
        }
      })


    },

    /**
     * 把视口更新到对应的项目图版
     */
    setTimeSetFitView() {
      // clearTimeout(this.setNumber)
      // this.setNumber = setTimeout(() => {
      // 把视口更新到对应的项目图版 测试的时候飘过去就行
      if (this.showType === 4) {
        let mapData = []
        Object.keys(this.lineEngineering).forEach(key => {
          this.lineEngineering[key].forEach(res => {
            mapData.push(res)
          })
        });
        Object.keys(this.pointEngineering).forEach(key => {
          this.pointEngineering[key].forEach(res => {
            mapData.push(res)
          })
        });
        Object.keys(this.surfaceEngineering).forEach(key => {
          this.surfaceEngineering[key].forEach(res => {
            mapData.push(res)
          })
        });
        this.mulchEngineering.forEach(res => {
          mapData.push(res)
        })
        // console.log(mapData)
        window.$aMap.setFitView(mapData, true, [50 * this.scaleA, 350 * this.scaleA, 100 * this.scaleA, 100 * this.scaleA]);//地图自适应
      } else {
        this.horizonKiv()
      }
      // }, 50)
    },
    /**
     * 创建自定义弹窗
     * @param marker
     * @param item
     * @param typeNum
     */
    createInfoWindow(marker, item, typeNum = '0') {

      content   // this.infoWindow?.setAnchor('center')
      let startDate = item.startDate?.split(' ')?.[0]
      let endDate = item.endDate?.split(' ')?.[0]
      let content = ''
      if (typeNum === '0') {
        // style="transform: scale(${this.scaleA});"
        content = `
        <div class='infoWindow-wrapper' >
          <div class="title" style="">${item.projectName}</div>
          <div class="content">
            <div class="left" style="">
              <div id="code" style="width: 100px;height: 100px;"></div>
            </div>
            <ul class="info">
              <li class="info-item">
                <span class="label">建设年度：</span>
                <span class="value">${item.projectYear || 2034} 年</span>
              </li>
              <li class="info-item">
                <span class="label">项目编号：</span>
                <span class="value">${item.projectCode}</span>
              </li>
              <li class="info-item">
                <span class="label">建设面积：</span>
                <span class="value">${item.area || 0} 亩</span>
              </li>
              <li class="info-item">
                <span class="label">建设工期：</span>
                <span class="value">${startDate}至${endDate}</span>
              </li>
              <li class="info-item">
                <span class="label">建筑状态：</span>
                <span class="value">${item.status}</span>
              </li>
            </ul>
          </div>
        </div>
      `
      }
      if (typeNum === '1') {
        content = `
        <div class='infoWindow-wrapper2' >
          <div class="title" style="">${item.sectionName || '-'}</div>
          <div class="content">
             <div class="left" style="">
              <div id="code" style="width: 60px;height: 60px;"></div>
            </div>
            <ul class="info">
              <li class="info-item">
                <span class="label">设施类型：</span>
                <span class="value">${item.engineeringType || '-'}</span>
              </li>
              <li class="info-item">
                <span class="label">设施编号：</span>
                <span class="value">${item.engineeringNumber || '-'}</span>
              </li>
              <li class="info-item">
                <span class="label">设施名称：</span>
                <span class="value">${item.engineeringName || '-'}</span>
              </li>

            </ul>
          </div>
        </div>
      `
      }


      if (typeNum === "10") {
        // console.log(marker.getPosition())
        this.infoWindow?.open(window.$aMap, marker.getPosition())
        // 设置内容
        this.infoWindow?.setContent(content)

        setTimeout(() => {
          document.getElementById("code").innerHTML = ""; //清空标签内原有数据，防止多次点击生成多个二维码
          new QRCode(document.getElementById("code"), {
            text: '000000',
            width: typeNum === '0' ? 100 : 60,
            height: typeNum === '0' ? 100 : 60,
            colorLight: '#FFF',//
            colorDark: '#27262f',
          });
        })
      } else {

        // console.log('鼠标移动位置的经纬度是：' + lnglat.getLng() + ',' + lnglat.getLat());
        this.infoWindow?.open(window.$aMap, this.mouseLnglat)

        // 设置内容
        this.infoWindow?.setContent(content)

        setTimeout(() => {
          document.getElementById("code").innerHTML = ""; //清空标签内原有数据，防止多次点击生成多个二维码
          new QRCode(document.getElementById("code"), {
            text: '000000',
            width: typeNum === '0' ? 100 : 60,
            height: typeNum === '0' ? 100 : 60,
            colorLight: '#FFF',//
            colorDark: '#27262f',
          });
        })
      }


    },
    /**
     * 划入创建窗口
     * @param value
     * @param item
     * @param marker
     */
    projectSectionWinInfoEven(value, item, marker) {
      if (value === 'mouseover') {
        // 划入创建窗口
        this.createInfoWindow(marker, item, '1')
      } else {
        // 鼠标悬浮marker关闭自定义的信息窗体
        // let that = this
        // setTimeout(() => {
        this.infoWindow?.close()
        // })
      }
    },

    /**
     * 项目看板绘制项目图版
     * @param projectSpatialCoordinates
     */
    drawProject(projectSpatialCoordinates) {
      if (projectSpatialCoordinates?.length) {
        this.mulchEngineering = []
        // areaCoordinate 点、线、面数据
        let dissolveArrJihe = []
        projectSpatialCoordinates.forEach(async item => {
          if (item.areaCoordinate) {
            // const colorPool = ['#356e89', '#8a4e2c', '#7e6b3e', '#50875d']
            // console.log(item.areaCoordinate,'geoJSONData++')
            let geoJSONData = WKT.parse(item.areaCoordinate)

            // console.log(geoJSONData,'geoJSONData')
            // const randomIndex = Math.floor(Math.random() * colorPool.length)
            // 如果发现是面工程，如果需要更改颜色的话，可以在此添加逻辑

            if (geoJSONData.coordinates[0][0]) {
              dissolveArrJihe.push(polygon([geoJSONData.coordinates[0][0]], {combine: 'yes'}))

              // 临时注销
              // let layer = new this.AMap.Polygon({
              //   // map: window.$aMap,
              //   path: geoJSONData.coordinates[0][0],// simplify(geoJSONDataCoordinatesA, {tolerance: 0.2}).coordinates[0], // 多边形的坐标数组
              //   strokeColor: '#f0e023',//colorPool[randomIndex], // 边线颜色
              //   strokeWeight: 1, // 边线宽度
              //   strokeOpacity: 1, // 边线透明度
              //   fillColor: '#c58531',//colorPool[randomIndex], // 填充颜色
              //   fillOpacity: 0.6, // 填充透明度
              //   zIndex: 11
              // })
              // // 覆盖物工程
              // this.mulchEngineering.push(layer)

            }
          }
        })

        var dissolved = dissolve(featureCollection(dissolveArrJihe), {propertyName: 'combine'});
        // console.log(dissolved, 'dissolveddissolved')

        dissolved.features.forEach(async item => {
          let mapData = item.geometry.coordinates[0]

          let layer = new this.AMap.Polygon({
            map: window.$aMap,
            path: mapData, // 多边形的坐标数组
            strokeColor: '#f0e023',//colorPool[randomIndex], // 边线颜色
            strokeWeight: 1, // 边线宽度
            strokeOpacity: 1, // 边线透明度
            fillColor: '#c58531',//colorPool[randomIndex], // 填充颜色
            fillOpacity: 0.6, // 填充透明度
            zIndex: 11
          })

          // 合并后覆盖物工程
          this.mulchEngineering.push(layer)
        })
      }
      this.setTimeSetFitView()
    },

    /**
     * 点状物工程上图 优先级高
     * @param pointConstruction
     */
    drawPointConstruction(pointConstruction) {
      if (pointConstruction?.length) {
        // areaCoordinate 点

        this.pointEngineering = {
          tangyan: [],//'塘堰(坝)'
          xxlhb: [],//小型拦河坝
          nyj: [],//农用井
          xxjyss: [],//小型集雨设施
          dhx: [],//倒虹吸
          nq: [],//农桥
          shuiz: [],//水闸
          lingcao: [],//渡槽
          byq: [], // 变压器
          dieshui: [],//跌水
          qita: [],//其他
          handong: [],//涵洞
          pdx: [],//配电箱
          bengzhan: [],//泵站
        }

        pointConstruction.forEach(async item => {
          if (item.areaCoordinate) {
            // 根据 wkt 字符串绘制多边形、点、线；根据engineeringType匹配映射中的 icon 图片, 如果匹配不到，则用其他 icon 代替
            let iconPath = PointConstructionMap[item.engineeringType] || PointConstructionMap['其他']
            let iconName = PointConstructionMap[item.engineeringType] ? item.engineeringType : "其他"
            let geoJSONData = WKT.parse(item.areaCoordinate)


            // console.log(geoJSONData, 'geoJSONData点')
            // 点
            if (geoJSONData.coordinates[0] && geoJSONData.coordinates[1]) {
              let layer = new this.AMap.Marker({
                map: window.$aMap,
                position: geoJSONData.coordinates,
                icon: new this.AMap.Icon({image: iconPath, imageSize: [24, 24]}),
                anchor: 'bottom-center',
                zIndex: 20
              })
              layer.on('mouseover', () => {
                this.projectSectionWinInfoEven('mouseover', item, layer)
              });
              layer.on('mouseout', () => {
                this.projectSectionWinInfoEven('mouseout')
              });

              if (iconName === '塘堰(坝)') {
                this.pointEngineering.tangyan.push(layer)
              }
              if (iconName === '小型拦河坝') {
                this.pointEngineering.xxlhb.push(layer)
              }
              if (iconName === '农用井') {
                this.pointEngineering.nyj.push(layer)
              }
              if (iconName === '小型集雨设施') {
                this.pointEngineering.xxjyss.push(layer)
              }
              if (iconName === '倒虹吸') {
                this.pointEngineering.dhx.push(layer)
              }
              if (iconName === '农桥') {
                this.pointEngineering.nq.push(layer)
              }
              if (iconName === '水闸') {
                this.pointEngineering.shuiz.push(layer)
              }
              if (iconName === '渡槽') {
                this.pointEngineering.lingcao.push(layer)
              }
              if (iconName === '变压器') {
                this.pointEngineering.byq.push(layer)
              }
              if (iconName === '跌水') {
                this.pointEngineering.dieshui.push(layer)
              }
              if (iconName === '其他') {
                this.pointEngineering.qita.push(layer)
              }
              if (iconName === '涵洞') {
                this.pointEngineering.handong.push(layer)
              }
              if (iconName === '配电箱') {
                this.pointEngineering.pdx.push(layer)
              }
              if (iconName === '泵站') {
                this.pointEngineering.bengzhan.push(layer)
              }

              // layer.on('mouseover', () => {
              //   // 划入创建窗口
              //   this.createInfoWindow(layer, item, '1')
              // })
              // // 鼠标悬浮marker关闭自定义的信息窗体
              // layer.on('mouseout', () => {
              //   this.infoWindow?.close()
              // })


            }

          }
        })
        this.setTimeSetFitView()
      }
    },
    /**
     * 线状物工程上图 优先级中
     * @param lineConstruction
     */
    drawLineConstruction(lineConstruction) {

      if (lineConstruction?.length) {
        this.lineEngineering = {
          psaqg: [],//排水暗渠(管)
          cqmqg: [],//衬砌明渠(沟)
          sjgqxj: [],//疏浚沟渠新建
          yhdl: [],//硬化道路
          jgd: [],//机耕道
          scdl: [],//生产道路
          scdlXj: [],//生产道路-新建
          tjdl: [],//田间道路
          tjdlXj: [],//田间道路-新建
          ntlw: [],//农田林网
          apfh: [],//岸坡防护
          gdzl: [],//沟道治理
          pmfh: [],//坡面防护
          dyxl: [],//低压线路
          kvyxdxl: [],//10kv以下的高压输电线路
        }
        // areaCoordinate 点、线、面数据
        lineConstruction.forEach(async item => {
          if (item.areaCoordinate) {
            let iconPath = LineConstructionMap[item.engineeringType] || LineConstructionMap['疏浚沟渠新建']
            let typeName = LineConstructionMap[item.engineeringType] ? item.engineeringType : '疏浚沟渠新建'
            let geoJSONData = WKT.parse(item.areaCoordinate)
            if (typeName === '排水暗渠(管)') {
              var polyline1 = new AMap.Polyline({
                map: window.$aMap,
                path: geoJSONData.coordinates,
                isOutline: true,
                borderWeight: 3,
                outlineColor: "#c83810",
                strokeColor: "#FFF",
                strokeWeight: 6,
                strokeOpacity: 1,
                zIndex: 18,
              })
              var polyline2 = new AMap.Polyline({
                map: window.$aMap,
                path: geoJSONData.coordinates,
                zIndex: 19,
                strokeStyle: "dashed",
                strokeDasharray: [6, 2],
                strokeColor: "#c83810",
                strokeWeight: 1,
              })
              this.lineEngineering.psaqg.push(polyline1)
              this.lineEngineering.psaqg.push(polyline2)

              polyline1.on('mouseover', () => {
                this.projectSectionWinInfoEven('mouseover', item, polyline1)
              });
              polyline1.on('mouseout', () => {
                this.projectSectionWinInfoEven('mouseout')
              });


            }
            if (typeName === '衬砌明渠(沟)') {
              var polyline1 = new AMap.Polyline({
                map: window.$aMap,
                path: geoJSONData.coordinates,
                zIndex: 18,
                isOutline: true,
                borderWeight: 3,
                outlineColor: "#6aacff",
                strokeColor: "#FFF",
                strokeWeight: 6,
                strokeOpacity: 1,

              })
              var polyline2 = new AMap.Polyline({
                map: window.$aMap,
                path: geoJSONData.coordinates,
                zIndex: 19,

                strokeStyle: "dashed",
                strokeDasharray: [0, 0, 0],
                strokeColor: "#6aacff",
                strokeWeight: 1,
                strokeOpacity: 1,
              })
              this.lineEngineering.cqmqg.push(polyline1)
              this.lineEngineering.cqmqg.push(polyline2)
              polyline1.on('mouseover', () => {
                this.projectSectionWinInfoEven('mouseover', item, polyline1)
              });
              polyline1.on('mouseout', () => {
                this.projectSectionWinInfoEven('mouseout')
              });
            }
            if (typeName === '疏浚沟渠新建') {
              var polyline1 = new AMap.Polyline({
                map: window.$aMap,
                path: geoJSONData.coordinates,
                zIndex: 19,
                strokeStyle: "dashed",
                strokeColor: "#4f97a5",
                strokeWeight: 4,
                strokeOpacity: 1,
              })
              polyline1.on('mouseover', () => {
                this.projectSectionWinInfoEven('mouseover', item, polyline1)
              });
              polyline1.on('mouseout', () => {
                this.projectSectionWinInfoEven('mouseout')
              });
              this.lineEngineering.sjgqxj.push(polyline1)
            }
            if (typeName === '硬化道路') {
              var polyline1 = new AMap.Polyline({
                map: window.$aMap,
                path: geoJSONData.coordinates,
                zIndex: 19,
                strokeColor: "#95939d",
                strokeWeight: 4,
                strokeOpacity: 1,
              })
              polyline1.on('mouseover', () => {
                this.projectSectionWinInfoEven('mouseover', item, polyline1)
              });
              polyline1.on('mouseout', () => {
                this.projectSectionWinInfoEven('mouseout')
              });
              this.lineEngineering.yhdl.push(polyline1)

            }
            if (typeName === '机耕道') {
              var polyline1 = new AMap.Polyline({
                map: window.$aMap,
                path: geoJSONData.coordinates,
                zIndex: 18,
                isOutline: true,
                borderWeight: 0,
                strokeColor: "#ffb067",
                strokeWeight: 6,
                strokeOpacity: 1,
              })
              var polyline2 = new AMap.Polyline({
                map: window.$aMap,
                path: geoJSONData.coordinates,
                zIndex: 19,
                strokeStyle: "dashed",
                strokeDasharray: [3, 6],
                strokeColor: "#FFF",
                strokeWeight: 4,
              })
              polyline1.on('mouseover', () => {
                this.projectSectionWinInfoEven('mouseover', item, polyline1)
              });
              polyline1.on('mouseout', () => {
                this.projectSectionWinInfoEven('mouseout')
              });
              this.lineEngineering.jgd.push(polyline1)
              this.lineEngineering.jgd.push(polyline2)

            }
            if (typeName === '生产道路') {
              var polyline1 = new AMap.Polyline({
                map: window.$aMap,
                path: geoJSONData.coordinates,
                zIndex: 19,
                strokeColor: "#dd6e00",
                strokeWeight: 4,
                strokeOpacity: 1,
              })
              polyline1.on('mouseover', () => {
                this.projectSectionWinInfoEven('mouseover', item, polyline1)
              });
              polyline1.on('mouseout', () => {
                this.projectSectionWinInfoEven('mouseout')
              });
              this.lineEngineering.scdl.push(polyline1)

            }
            if (typeName === '生产道路-新建') {
              var polyline1 = new AMap.Polyline({
                map: window.$aMap,
                path: geoJSONData.coordinates,
                zIndex: 19,
                strokeStyle: "dashed",
                strokeDasharray: [6, 2],
                strokeColor: "#dd6e01",
                strokeWeight: 4,
                strokeOpacity: 1,
              })
              polyline1.on('mouseover', () => {
                this.projectSectionWinInfoEven('mouseover', item, polyline1)
              });
              polyline1.on('mouseout', () => {
                this.projectSectionWinInfoEven('mouseout')
              });
              this.lineEngineering.scdlXj.push(polyline1)

            }
            if (typeName === '田间道路') {

              var polyline1 = new AMap.Polyline({
                map: window.$aMap,
                path: geoJSONData.coordinates,
                zIndex: 19,
                strokeColor: "#80eef1",
                strokeWeight: 4,
                strokeOpacity: 1,
              })

              polyline1.on('mouseover', () => {
                this.projectSectionWinInfoEven('mouseover', item, polyline1)
              });
              polyline1.on('mouseout', () => {
                this.projectSectionWinInfoEven('mouseout')
              });

              this.lineEngineering.tjdl.push(polyline1)

            }
            if (typeName === '田间道路-新建') {
              var polyline1 = new AMap.Polyline({
                map: window.$aMap,
                path: geoJSONData.coordinates,
                zIndex: 19,
                strokeStyle: "dashed",
                strokeDasharray: [6, 2],
                strokeColor: "#dd6e01",
                strokeWeight: 4,
                strokeOpacity: 1,
              })

              polyline1.on('mouseover', () => {
                this.projectSectionWinInfoEven('mouseover', item, polyline1)
              });
              polyline1.on('mouseout', () => {
                this.projectSectionWinInfoEven('mouseout')
              });
              this.lineEngineering.tjdlXj.push(polyline1)

            }
            if (typeName === '农田林网') {
              var polyline1 = new this.AMap.Polyline({
                map: window.$aMap,
                path: geoJSONData.coordinates,  // 设置线覆盖物路径
                showDir: true,
                dirImg: iconPath,
                strokeWeight: 8,          // 线宽\
                strokeColor: "#edf2fa",
                strokeOpacity: 0, // 边线透明度
              });

              polyline1.on('mouseover', () => {
                this.projectSectionWinInfoEven('mouseover', item, polyline1)
              });
              polyline1.on('mouseout', () => {
                this.projectSectionWinInfoEven('mouseout')
              });
              this.lineEngineering.ntlw.push(polyline1)
            }
            if (typeName === '岸坡防护') {
              var polyline1 = new this.AMap.Polyline({
                map: window.$aMap,
                path: geoJSONData.coordinates,  // 设置线覆盖物路径
                showDir: true,
                dirImg: iconPath,
                strokeWeight: 8,          // 线宽\
                strokeColor: "#edf2fa",
                strokeOpacity: 0, // 边线透明度
              });

              polyline1.on('mouseover', () => {
                this.projectSectionWinInfoEven('mouseover', item, polyline1)
              });
              polyline1.on('mouseout', () => {
                this.projectSectionWinInfoEven('mouseout')
              });
              this.lineEngineering.apfh.push(polyline1)

            }
            if (typeName === '沟道治理') {
              var polyline1 = new this.AMap.Polyline({
                map: window.$aMap,
                path: geoJSONData.coordinates,  // 设置线覆盖物路径
                showDir: true,
                dirImg: iconPath,
                strokeWeight: 8,          // 线宽\
                strokeColor: "#edf2fa",
                strokeOpacity: 0, // 边线透明度
              });

              polyline1.on('mouseover', () => {
                this.projectSectionWinInfoEven('mouseover', item, polyline1)
              });
              polyline1.on('mouseout', () => {
                this.projectSectionWinInfoEven('mouseout')
              });

              this.lineEngineering.gdzl.push(polyline1)

            }
            if (typeName === '坡面防护') {
              var polyline1 = new this.AMap.Polyline({
                map: window.$aMap,
                path: geoJSONData.coordinates,  // 设置线覆盖物路径
                showDir: true,
                dirImg: iconPath,
                strokeWeight: 8,          // 线宽\
                strokeColor: "#edf2fa",
                strokeOpacity: 0, // 边线透明度
              });

              polyline1.on('mouseover', () => {
                this.projectSectionWinInfoEven('mouseover', item, polyline1)
              });
              polyline1.on('mouseout', () => {
                this.projectSectionWinInfoEven('mouseout')
              });
              this.lineEngineering.pmfh.push(polyline1)

            }
            if (typeName === '低压线路') {
              var polyline1 = new AMap.Polyline({
                map: window.$aMap,
                path: geoJSONData.coordinates,
                zIndex: 18,
                strokeColor: "#90f4ff",
                strokeWeight: 2,

              })
              var polyline2 = new AMap.Polyline({
                map: window.$aMap,
                path: geoJSONData.coordinates,
                zIndex: 19,
                strokeStyle: "dashed",
                strokeDasharray: [2, 6],
                strokeColor: "#90f4ff",
                strokeWeight: 4,

              })

              polyline1.on('mouseover', () => {
                this.projectSectionWinInfoEven('mouseover', item, polyline1)
              });
              polyline1.on('mouseout', () => {
                this.projectSectionWinInfoEven('mouseout')
              });
              this.lineEngineering.dyxl.push(polyline1)
              this.lineEngineering.dyxl.push(polyline2)

            }
            if (typeName === '10kv以下的高压输电线路') {
              var polyline1 = new AMap.Polyline({
                map: window.$aMap,
                path: geoJSONData.coordinates,
                zIndex: 18,
                strokeColor: "#90f4ff",
                strokeWeight: 2,

              })

              polyline1.on('mouseover', () => {
                this.projectSectionWinInfoEven('mouseover', item, polyline1)
              });
              polyline1.on('mouseout', () => {
                this.projectSectionWinInfoEven('mouseout')
              });
              var polyline2 = new AMap.Polyline({
                map: window.$aMap,
                path: geoJSONData.coordinates,
                zIndex: 19,
                strokeStyle: "dashed",
                strokeDasharray: [2, 2, 2, 10],
                strokeColor: "#90f4ff",
                strokeWeight: 4,

              })
              this.lineEngineering.kvyxdxl.push(polyline1)
              this.lineEngineering.kvyxdxl.push(polyline2)
            }

          }
        })

        this.setTimeSetFitView()
      }
    },
    /**
     * 面状物工程上图 优先级其次
     * @param areaConstruction
     */
    drawAreaConstruction(areaConstruction) {
      if (areaConstruction?.length) {
        this.surfaceEngineering = {
          ggps: [], // 灌溉排水
          tdgl: [], // 土地改良
          tdpz: [] // 土地平整
        }
        // areaCoordinate 点、线、面数据
        // console.log('面面面', areaConstruction)
        areaConstruction.forEach(async item => {
          if (item.areaCoordinate) {
            // 土地平整 土地改良 灌溉排水
            // ['#39dcdd', '#e6c63b', '#66e5a4']
            let colorPool = ''
            if (item.engineeringlype === '灌溉排水') {
              colorPool = '#66e5a4'
            }
            if (item.engineeringlype === '土地改良') {
              colorPool = '#f0e023'
            }
            if (item.engineeringlype === '土地平整') {
              colorPool = '#39dcdd'
            }

            let geoJSONData = WKT.parse(item.areaCoordinate)
            let layer = null
            // console.log(geoJSONData, 'geoJSONData---')

            if (geoJSONData.type === 'MultiPolygon') {
              let polyline1 = new this.AMap.Polygon({
                map: window.$aMap,
                path: geoJSONData.coordinates[0][0], // 多边形的坐标数组
                strokeColor: '#7e6b3e',//colorPool, // 边线颜色
                strokeWeight: 1, // 边线宽度
                strokeOpacity: 1, // 边线透明度
                fillColor: '#7e6b3e',//colorPool, // 填充颜色
                fillOpacity: 0.6, // 填充透明度
                zIndex: 11
              })
              polyline1.on('mouseover', () => {
                this.projectSectionWinInfoEven('mouseover', item, polyline1)
              });
              polyline1.on('mouseout', () => {
                this.projectSectionWinInfoEven('mouseout')
              });
            } else if (geoJSONData.type === 'Polygon') {

              let polyline1 = new this.AMap.Polygon({
                map: window.$aMap,
                path: geoJSONData.coordinates[0], // 多边形的坐标数组
                strokeColor: '#7e6b3e',//colorPool, // 边线颜色
                strokeWeight: 1, // 边线宽度
                strokeOpacity: 1, // 边线透明度
                fillColor: '#7e6b3e',//colorPool, // 填充颜色
                fillOpacity: 0.6, // 填充透明度
                zIndex: 11
              })

              polyline1.on('mouseover', () => {
                this.projectSectionWinInfoEven('mouseover', item, polyline1)
              });
              polyline1.on('mouseout', () => {
                this.projectSectionWinInfoEven('mouseout')
              });
            } else return

            // 面工程  surfaceEngineering:{ggps:[],tdgl:[],tdpz:[]}
            if (item.engineeringlype === '灌溉排水') {
              this.surfaceEngineering.ggps.push(layer)
            }
            if (item.engineeringlype === '土地改良') {
              this.surfaceEngineering.tdgl.push(layer)
            }
            if (item.engineeringlype === '土地平整') {
              this.surfaceEngineering.tdpz.push(layer)
            }
          }
        })
        this.setTimeSetFitView()
      }
    },

    /**
     * 根据看板信息调整地图中心点及行政区域
     * @param level
     * @returns {Promise<void>}
     */
    async drawBounds(level) {
      // 定位 -> 问题重灾区
      await this.$nextTick()
      // console.log('drawBounds', level) //省 是 null  市区 是 city  //区是district
      let that = this

      window?.$districtSearch?.setLevel(level)

      if (level === 'district') {
        // 点击区县查询，不查子
        window.$districtSearch.setSubdistrict(0)
        that.ifSuoQv = true
      } else {
        window.$districtSearch.setSubdistrict(1)
      }

      // district.adcode || district.name
      window.$districtSearch.search(this.cityclickInfo || this.currentDistrictName, async (status, result) => {

        // console.log(status, result, 'status, result')
        that.xzMapCenter = result.districtList[0].center

        if (result?.districtList?.length) {
          let resultList = []

          that.textArr.map(res => {
            window.$aMap.remove(res);
          })
          that.cityPolygons.map(res => {
            window.$aMap.remove(res);
          })

          if (level === 'district') {
            resultList = [result?.districtList[0]]
            // 如果是区县的话，只拿区县的行政区域，不往下查询了
          } else {
            resultList = result?.districtList[0]?.districtList
          }

          that.cityPolygons = []
          that.textArr = []

          // console.log('你的名字列表', resultList)
          // 根据查询的子集列表，查询子集的行政区域，并绘制到districtLayerGroup图层组中


          for (const district of resultList) {

            // textLayer.hide()

            window.$districtSearch?.search(district.adcode || district.name, (status, result) => {
              if (status == 'complete') {
                let bounds = result.districtList[0].boundaries
                if (bounds) {
                  let polygonArr = []

                  function polygonsApi(e) {
                    polygonArr.forEach(res => {
                      if (e === 'mouseover') {
                        textLayer.show()
                        res.setOptions({
                          strokeColor: '#fbfa02',
                          fillColor: '#fbfa02',
                          fillOpacity: 0.1,
                          zIndex: 12,
                        })
                      }
                      if (e === 'mouseout') {
                        textLayer.hide()
                        res.setOptions({
                          strokeColor: '#29bbc2',
                          fillColor: '#29bbc2',
                          zIndex: 10,
                          fillOpacity: 0,
                        })
                      }
                      if (e === 'click') {
                        if (!that.ifSuoQv) that.onMouseClickPolygon(result)
                      }
                    })
                  }

                  bounds.forEach((res, i) => {
                    var polygon = new that.AMap.Polygon({
                      map: $aMap,
                      strokeWeight: 3,
                      strokeColor: '#29bbc2',
                      fillColor: '#29bbc2',
                      fillOpacity: 0,
                      path: res,
                      zIndex: 10
                    });
                    polygonArr.push(polygon)

                    polygon.on('mouseover', () => {
                      polygonsApi('mouseover')
                    });
                    polygon.on('mouseout', () => {
                      polygonsApi('mouseout')
                    });

                    polygon.on('click', (e) => {
                      polygonsApi('click')
                    });

                    that.cityPolygons.push(polygon);
                  })

                  let textLayer = new that.AMap.Text({
                    map: $aMap,
                    position: district.center,
                    anchor: 'center',
                    text: district.name,
                    zIndex: 5,
                    visible: false,
                    style: {'background-color': 'transparent', color: '#fff', border: 'none'},
                  })
                  textLayer.on('mouseover', () => {
                    polygonsApi('mouseover')
                  });
                  textLayer.on('mouseout', () => {
                    polygonsApi('mouseout')
                  });

                  textLayer.on('click', (e) => {
                    polygonsApi('click')
                  });

                  that.textArr.push(textLayer)
                  that.horizonKiv(resultList)
                }

              }
            })
          }

        }
      })
    },
    /**
     * 视野自适应 视野  that.cityPolygons
     */
    horizonKiv() {
      let that = this
      if (that.horizonKivOut) window.clearTimeout(that.horizonKivOut)
      that.horizonKivOut = setTimeout(() => {
        $aMap.setFitView(that.cityPolygons, true, [200 * that.scaleA, 350 * that.scaleA, 200 * that.scaleA, 200 * that.scaleA]);//地图自适应
      }, 200)
    },
    /**
     * 根据边界数据生成多边形图层
     * @param bounds
     * @returns {*}
     */
    getLayerByBounds(bounds) {
      if (bounds) {
        // 生成行政区划polygon
        for (var i = 0; i < bounds.length; i += 1) {
          // 构造MultiPolygon的path
          bounds[i] = [bounds[i]]
        }
        return new AMap.Polygon({
          strokeWeight: 3,
          path: bounds,
          fillOpacity: 0,
          fillColor: '#80d8ff',
          strokeColor: '#80d8ff'
        })
      }
    },
    /**
     *  根据行政区获取文本图层
     * @param district
     * @returns {*}
     */
    getTextLayerByDistrict(district) {
      const {center, name} = district
      return new AMap.Text({
        position: center,
        anchor: 'center',
        text: name,
        style: {'background-color': 'transparent', color: '#fff', border: 'none'}
      })
    },

    /**
     * 鼠标行政区域悬浮事件
     * @param event
     */
    onMouseOverPolygon(event) {
      const polygon = event.target
      polygon.off('mouseout', this.onMouseOutPolygon)
      // 设置多边形的选项来更新边界样式，如边框粗细或颜色
      polygon.setOptions({
        strokeWeight: 5,
        strokeColor: '#F1F112',
        zIndex: 100
      })
    },
    /**
     * 鼠标行政区域悬浮事件
     * @param event
     */
    onMouseOutPolygon(event) {
      const polygon = event.target
      polygon.off('mouseover', this.onMouseOverPolygon)
      // 设置多边形的选项来更新边界样式，如边框粗细或颜色
      polygon.setOptions({
        strokeWeight: 3,
        strokeColor: '80d8ff',
        zIndex: 10
      })
    },
    /**
     * 鼠标行政区域点击事件
     * @param event
     * @returns {Promise<void>}
     */
    async onMouseClickPolygon(event) {
      console.log(this.childInfoList)

      // console.log(event)
      // console.log(event.districtList[0].adcode)
      this.cityclickInfo = event.districtList[0].adcode
      await this.$nextTick()
      let polygon, extData, name, level
      if (event.target) {
        polygon = event.target
        extData = polygon?.getOptions() || {}
        name = extData.name
        level = extData.level
      } else {
        extData = event.districtList[0]
        name = extData.name
        level = extData.level
      }

      //根据点击事件匹配下一级所用id
      this.childInfoList.map(item => {
        if (extData.adcode == item.districtCode) {
          this.nowModelId = item.id
          // console.log('点击', this.nowModelId)
          // 同时获取下一级子级list // data.districtDivisionId   // 点击的市
          this.queryDistrictDivisionByParentId(item.id)
        }
      })

      if (level === 'city') {
        // 跳转到地市级看板
        this.showType = 2
        // // 市看板初始化
        this.initCity(level, name)
      } else if (level === 'district') {
        // 跳转区县级别看板
        this.showType = 3
        // 区县初始化
        this.initDistrict(level, name)
      }
    },
    /**
     * 获取下层级别数据
     * @param parentId
     */
    queryDistrictDivisionByParentId(parentId) {
      console.log(this.showType)
      if (this.showType == '1') {
        parentId = '1740204531389820930'
      }
      if (this.showType == '2') {
        parentId = '1740572727019917314'
      }
      moduleSrv
          .queryDistrictDivisionByParentId({
            parentId
          })
          .then(res => {
            const {code, data} = res
            // console.log(data, '下级数据')
            if (code == '200') {
              this.childInfoList = JSON.parse(JSON.stringify(data))
            } else {
              this.childInfoList = []
            }
          })
          .finally(() => {
            this.loading = false
          })
    },
    /**
     * 省看板初始化
     * @returns {Promise<void>}
     */
    async initProvince() {

      await this.$nextTick()
      // 清空搜索框
      this.$refs.quickSearchRef.clear()
      // 看板
      const {districtLevel = 0, districtName} = this.boardInfos
      // console.log('districtName', districtLevel, districtName) // 0 江苏省
      this.cachePath = []
      this.currentDistrictName = districtName
      if (districtLevel === 0) {
        this.showType = 1
      } else if (districtLevel === 1) {
        this.showType = 2
      } else {
        this.showType = 3
      }
      //测试showtype
      // this.showType = 3
      // 覆盖行政区划
      this.drawBounds()
      // 缓存当前看板级别及名称
      this.cachePath.push({
        id: this.nowModelId,
        showType: this.showType,
        currentDistrictName: this.currentDistrictName,
        childInfoList: JSON.parse(JSON.stringify(this.childInfoList))
      })
      // console.log('获取展示数据', this.boardInfos.districtDivisionId)
      // 获取展示数据
      let params = {
        districtDivisionId: this.boardInfos?.districtDivisionId,
        // 测试写死id
        // districtDivisionId: '1740204338111975424',
        districtLevel: 0
      }
      this.riskParams = params

      // 获取仪表盘信息
      this.getDashboardInfo(0, params)// 1
      // 查询区域下所有项目列表
      this.queryProjectAllList(params)
    },
    /**
     * 市看板初始化
     * @param level
     * @param name
     * @param type
     * @returns {Promise<void>}
     */
    async initCity(level, name, type = '0') {
      await this.$nextTick()
      this.$refs.quickSearchRef.clear()


      this.drawBounds(level)
      this.currentDistrictName = name

      // this.cachePath.forEach((res) => {})

      // 缓存当前看板级别及名称
      this.cachePath.push({
        id: this.nowModelId,
        showType: this.showType,
        currentDistrictName: this.currentDistrictName,
        childInfoList: type === '1' ? this.childInfoListA : JSON.parse(JSON.stringify(this.childInfoList))
      })


      // 获取展示数据 行政等级 -1无权限 0省级 1市级 2区县 3乡镇 4村、社区
      let params = {
        // districtDivisionId: this.boardInfos?.districtDivisionId,
        // districtDivisionId: '1740204338187472896',
        districtDivisionId: this.nowModelId,
        districtLevel: 1
      }
      this.riskParams = params
      // 获取仪表盘数据
      this.getDashboardInfo(1, params)
      //查询区域下所有项目列表
      this.queryProjectAllList(params)
    },
    /**
     * 区县看板初始化
     * @param level
     * @param name
     * @returns {Promise<void>}
     */
    async initDistrict(level, name) {
      // console.log('区县面板', level, name)
      await this.$nextTick()
      this.$refs.quickSearchRef.clear()
      // 区县进入
      this.drawBounds(level)
      // return
      this.currentDistrictName = name
      // 缓存当前看板级别及名称
      if (!this.ifSuoQv) this.cachePath.push({
        id: this.nowModelId,
        showType: this.showType,
        currentDistrictName: this.currentDistrictName,
        childInfoList: JSON.parse(JSON.stringify(this.childInfoList))
      })
      // 获取展示数据
      let params = {
        districtDivisionId: this.nowModelId,
        // districtDivisionId: '1740204338271358976',
        districtLevel: 2
      }
      // this.riskParams = {
      //     districtDivisionId: '1740572727019917314',
      //     districtLevel: 2
      // }
      this.riskParams = params
      // 获取仪表板信息
      this.getDashboardInfo(2, params)
      // 获取区县风险预警列表
      this.getRiskList({
        districtDivisionId: this.nowModelId,
        // districtDivisionId: '1740572727019917314',
        districtLevel: 2
      })
      // 查询项目全部列表
      this.queryProjectAllList(params)
    },
    /**
     * 项目看板初始化  点击项目 进入初始化
     * @param project
     */
    initProject(project) {
      // console.log('点击 项目 进入 初始化 点线面', project)
      this.$refs.quickSearchRef.clear()
      // // getProjectInfo
      // this.showTypeLoading = this.$loading({
      //   lock: true,
      //   text: '资源加载中...',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(9, 28, 49, 0.8)'
      // });

      this.showType = 4

      this.currentDistrictName = project.projectName
      // const params = {projectId: '1759481847592546306'}
      const params = {projectId: project.id}

      this.riskParams = params
      // //项目大屏统计 获取数据 ,并且去绘制地图
      this.getProjectInfo(project)

      // //项目风险预警列表
      this.getRiskList(params)
      // 缓存当前路径
      this.cachePath.push({
        id: this.nowModelId,
        showType: this.showType,
        currentDistrictName: this.currentDistrictName,
        project: project
      })
      // 清空 marker 图层
      // window.$aMap?.remove(this.projectMarkerLayers)
      // this.temporaryProjectList = []

    },


    /**
     *  获取看板地区信息
     */
    getInitInfos() {
      this.loading = true
      moduleSrv
          .getDashboard()
          .then(res => {
            const {code, data} = res
            // console.log(data, '// 江苏省') // 江苏省
            // data.districtLevel
            if (code === '200') {
              // 行政等级 -1无权限 0省级 1市级 2区县 3乡镇 4村、社区
              this.boardInfos = data
              this.oneIdBack = data.districtDivisionId
              // console.log(this.boardInfos, 'moumous')
              this.nowModelId = data.districtDivisionId
              // 测试写死id
              // this.queryDistrictDivisionByParentId('1740204338111975424')
              // 获取下级 地图信息(江苏省 下级 -> 市信息)
              // data.districtDivisionId   // 江苏省id
              this.queryDistrictDivisionByParentId(data.districtDivisionId)

              if (data.districtLevel === 0) {
                this.showType = 1
                this.initProvince() // 省看板初始化
              }
              if (data.districtLevel === 1) {
                this.showType = 2
                this.initCity('city', data.districtName) // 市看板初始化  city 淮安市
              }
              if (data.districtLevel === 2) {
                this.showType = 3
                this.initDistrict('district', data.districtName) // 区看板初始化  district 盱眙县
              }


              //
              // this.initCity()
              // this.showType = 2
              //
              // showType: 1, // 1-省 2-市 3-县 4-项目 5-标段
              // this.showType = 3
            }
          })
          .finally(() => {
            this.loading = false
          })
    },

    /**
     * 项目信息
     * @param project
     * @returns {Promise<void>}
     */
    async getProjectInfo(project) {

      if (!this.showTypeLoading) this.showTypeLoading = this.$loading({
        lock: true,
        text: '资源加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(9, 28, 49, 0.8)'
      });

      // TODO: 使用的时候替换project.id, 要转换为字符串，否则数字的话，接口接受会越界project.id
      moduleSrv.queryProjectDashboardStatistic({projectId: project.id + ''}).then(res => {
        // moduleSrv.queryProjectDashboardStatistic({projectId: '1769694262980608001'}).then(res => {
        const {code, data} = res

        if (this.showTypeLoading) this.showTypeLoading.close();
        this.showTypeLoading = null

        if (code === '200') {
          // 项目调用的 数据
          this.allModelInfos = {
            ...data,
            // 看板数据
            areaProjectStatistics: data.areaProjectStatistics || {}, // 区域统计
            financialProgress: data.financialProgress || [],//资金进度
            platformActivity: data.platformActivity || [], // 平台活跃度
            projectSectionConstruction: data.projectSectionConstruction || {}, // 标段建设情况
          }
          const {
            projectSpatialCoordinates = [],
            pointConstruction = [],
            lineConstruction = [],
            areaConstruction = []
          } = data
          // console.log(data, '图斑,点状物，线状物，面状物')
          // 点击 绘制 图斑等
          // 绘制项目图斑
          this.drawProject(projectSpatialCoordinates)
          // 绘制点状物工程
          this.drawPointConstruction(pointConstruction)
          // 绘制线状物工程
          this.drawLineConstruction(lineConstruction)
          // 绘制面状物工程
          this.drawAreaConstruction(areaConstruction)
        }
      })
    },
    /**
     * 获取仪表板信息
     * @param level
     * @param params
     * @returns {Promise<void>}
     */
    async getDashboardInfo(level, params) {
      //省市级项目大屏统计
      let service = 'queryProvinceCityProjectDashboardStatistic'

      // 行政等级 -1无权限 0省级 1市级 2区县 3乡镇 4村、社区
      if (level === -1 || level === 0 || level === 1) {
        // 省 市 //省市级项目大屏统计
        service = 'queryProvinceCityProjectDashboardStatistic'
      } else if (level === 2) {
        //  2区县 //区县级项目大屏统计
        service = 'queryCountyProjectDashboardStatistic'
      } else if (level === 99) {
        params = {
          projectId: '1751840246573678593'
        }
        // 项目 //项目大屏统计
        service = 'queryProjectDashboardStatistic'
      } else {
        //省市级项目大屏统计
        service = 'queryProvinceCityProjectDashboardStatistic'
      }

      const res = await moduleSrv[service](params)
      if (this.showTypeLoading) this.showTypeLoading.close();
      this.showTypeLoading = null

      // console.log('getDashboardInfo--res--', res)
      const {code, data} = res
      if (code === '200') {
        // 大概 省市区 调用的数据统计
        // console.log('‘----------++++',data)
        this.apiMapCenteer = data.districtCoordinate || null
        this.allModelInfos = {
          ...data,
          // 看板数据
          areaProjectStatistics: data.areaProjectStatistics || {}, // 区域统计
          financialProgress: data.financialProgress || [],//资金进度
          platformActivity: data.platformActivity || [], // 平台活跃度
          projectSectionConstruction: data.projectSectionConstruction || {}, // 标段建设情况
        }
        const {
          areaProjectStatistics = {},
          financialProgress = [],
          areaConstruction = [],
          lineConstruction = [],
          pointConstruction = [],
          projectSpatialCoordinates = []
        } = data
        this.financialProgress = financialProgress // 省市 中间 下面 图表
        this.middleTopArrList?.map(item => {
          item.value = areaProjectStatistics[item.key] - 0 || 0
          item.valueStr = [item.value] /// 9//item.value+''
          return item
        })

        this.middleTopArrListUUID = false

        setTimeout(() => {

          this.middleTopArrListUUID = true
          setTimeout(() => {
            let myNum = this.$refs['myNum']
            if (myNum) myNum.forEach(res => {
              res.start()
            })
          })

        }, 2000)


        this.analysisMoneyOptions(financialProgress)
      }
    },
    /**
     * 千分分隔符 函数
     * @param number
     * @returns {string}
     */
    formatNumberWithCommas(number) {
      var parts = number.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    },
    /**
     * 标段
     * @param item
     */
    getSectionInfos(item) {
      let that = this
      const params = {
        projectSectionId: item.projectSectionId // '1762720216434880513'
      }

      this.isShowTypeFive = true

      moduleSrv
          .queryProjectSectionDashboardStatistic(params)
          .then(res => {
            // console.log(res, '标段-111')
            const {code, data} = res
            if (code === '200') {
              this.allModelInfosXiangmu = {
                ...data,
                // 看板数据
                areaProjectStatistics: data.areaProjectStatistics || {}, // 区域统计
                financialProgress: data.financialProgress || [],//资金进度
                platformActivity: data.platformActivity || [], // 平台活跃度
                projectSectionConstruction: data.projectSectionConstruction || {}, // 标段建设情况
              }

              setTimeout(() => {
                that.showType = 5
              }, 500)
            }
          })
          .finally(() => {
            this.loading = false
          })
    },

    /**
     * 数据处理
     * @param arr
     */
    analysisMoneyOptions(arr) {
      if (arr?.length > 0) {
        const labelList = []
        const firListData = []
        const secListData = []
        arr.map(item => {
          const list = item.items

          labelList.push(item.label || '无数据')
          const firValue = list[0]?.itemValue || 0
          const secValue = list[1]?.itemValue || 0
          firListData.push(firValue)
          secListData.push(secValue)
        })
        moneyProcess.xAxis.data = labelList
        // moneyProcess.legend.data = labelList
        moneyProcess.series[0].data = firListData
        moneyProcess.series[1].data = secListData
      }
      // console.log(moneyProcess, 'moneyProcessmoneyProcess')
      this.moneyLineChart = moneyProcess


    },

    /**
     * 点击进入项目看板
     * @param item
     */
    changeShowType(item) {
      this.initSection(item)
      this.infoUnfold = false
    },
    /**
     * 标段看板初始化
     * @param item
     */
    initSection(item) {
      if (this.$refs.quickSearchRef) this.$refs.quickSearchRef.clear()
      const params = {
        projectSectionId: item.id//'1774753226055221249' //  //'1774753226055221249' //
      }

      // 获取标段大屏数据
      this.getSectionInfos(params)

      // this.riskParams = params


      //标段 风险预警
      this.getRiskList({
        projectSectionId: params.projectSectionId // '1774753226055221249' // item.id //
      })
      // 清空 marker 图层
      // window.$aMap?.remove(this.projectMarkerLayers)
      // this.temporaryProjectList = []

    },
    /**
     * 日期特殊处理
     * @param dateString
     * @returns {string}
     */
    dateGeshihua(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      // console.log(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`, '=========================')
      // return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      return `${year}-${month}-${day}`
    },

    /**
     * 获取报警清单
     * @param params
     */
    getRiskList(params) {
      moduleSrv.queryRiskEarlyWarningList(params).then(res => {
        let {code, data = []} = res


        if (code === '200') {

          data.map(res => {
            res.createAt = this.dateGeshihua(res.createAt)
            res.earlyWarningTime = this.dateGeshihua(res.earlyWarningTime)
          })

          if (this.showType === 5 || this.isShowTypeFive) {
            this.riskListXiangmu = data || []
            this.riskParamsXiangmu = params
          }
          if (this.showType === 4 || this.showType === 3) {
            this.riskList = data || []
            this.riskListXiangmu = data || []
          }

        }
      })
    },

    /**
     * 关闭报警对话框
     */
    closeRiskDialog() {
      this.showRiskDialog = false
    },

    /**
     * 更新地图数据
     * @param obj
     */
    upDataMap(obj) {
      // console.log(obj.code1, obj.code2, obj.flag)
      let a = this[obj.code1][obj.code2]
      if (a.length > 0) {
        a.forEach((res => {
          if (obj.flag) res.show()
          else res.hide()
        }))
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import './assets/font.scss';
</style>

<style lang="scss">
.el-dialog__wrapper {
  background: rgba(5, 19, 49, 0.7);

  ::-webkit-scrollbar {
    width: 4px; /* 纵向滚动条*/
    height: 5px; /* 横向滚动条 */
    background-color: transparent;
  }

  /*定义滚动条轨道 内阴影*/
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
    background-color: rgba(0, 0, 0, 0);
  }

  /*定义滑块 内阴影*/
  ::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
    background-color: #296396;
    border-radius: 4px;
  }
}

.infoWindow-wrapper {
  border: 2px solid #00eaff;
  background-color: rgba(36, 53, 85, 0.8);
  width: 460px;
  border-radius: 5px;

  .title {
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 30px;

    color: #b7cce6;
    font-size: 16px;
    height: 40px;
    line-height: 40px;
    position: relative;
    padding-left: 20px;
    border-bottom: 1px solid #364767;

    &::before {
      content: '';
      width: 4px;
      height: 16px;
      background-color: #00eaff;
      position: absolute;
      left: 5px;
      top: 12px;
    }
  }

  .content {
    margin: 5px 15px 5px 15px;
    display: flex;

    .left {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #FFF;
      position: relative;
      top: 15px;
      left: 4px;
      width: 106px;
      height: 106px;
    }
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    color: #8495ae;

    .info-item {
      margin-bottom: 10px;
      margin-top: 4px;
      margin-left: 20px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;

    }

    .value {
      color: #b1c6e0;
    }
  }
}

.infoWindow-wrapper2 {
  border: 2px solid #00eaff;
  background-color: rgba(36, 53, 85, 0.8);
  width: 300px;
  border-radius: 5px;

  .title {
    padding-right: 30px;
    padding-left: 25px;

    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #b7cce6;
    font-size: 16px;
    height: 40px;
    line-height: 40px;
    position: relative;
    //padding-left: 0px;
    border-bottom: 1px solid #364767;

    &::before {
      content: '';
      width: 4px;
      height: 16px;
      background-color: #00eaff;
      position: absolute;
      left: 5px;
      top: 10px;
    }
  }

  .content {
    //margin-top: 20px;
    display: flex;

    .left {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #FFF;
      position: relative;
      top: 10px;
      left: 10px;

      margin-right: 0px;
      margin-left: 15px;

      width: 66px;
      height: 66px;
    }
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    color: #7d8da6;

    .info-item {
      margin-bottom: 10px;
      margin-top: 4px;
      margin-left: 20px;

      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .value {
      color: #b1c6e0;
    }
  }
}

</style>

