<template>
  <div :class="`ele-quick-search ele-quick-search-${selElementTab}`">
    <!-- <div :class="!isShow ? 'qs-btn' : `qs-btn qs-btn-active`" @click="isShow = !isShow"></div> -->
    <transition name="c-fade-in-linear">
      <!--          -->
      <div v-if="isShow" class="qs-content" :class="infoUnfold?'':'qs-contentA'">
        <div class="qs-head">
          <div class="qs-input">
            <div class="qs-search-btn" @click="searchList"></div>
            <el-input v-model="name" class="cestc-dark-input" :placeholder="placeholder" @input="change"
                      @focus="jiaodian = true" @blur="jiaodianss"></el-input>
            <!--                        <c-input v-model="name" class="cestc-dark-input" :placeholder="placeholder" />-->
            <!--                        <div class="qs-search-btn" @click="searchList"></div>-->
          </div>
          <!-- <div class="qs-close" @click="closeContent"></div> -->
        </div>
        <div v-if="tableData.length && isExpend && jiaodian">
          <div class="sj-model"></div>
          <div :class="sTabs ? 'qs-list' : 'qs-list'">
            <ele-table
                v-if="tableData.length"
                :show-detail-btn="isDistrict || sActiveTab !== 'grid'"
                :columns="columns"
                :page-size="pageSize"
                :table-data="tableData"
                :total="total"
                @showEleDetail="showEleDetail"
                @centerEle="centerEle"
            ></ele-table>
            <cestc-empty v-else/>
          </div>
          <div class="extend-image" @click="handleEctebd"></div>
          <!--                    <div v-if="true" class="tb-page">-->
          <!--                        <c-pagination-->
          <!--                            class="cestc-dark-pagination"-->
          <!--                            background-->
          <!--                            layout="prev, pager, next"-->
          <!--                            :total="total"-->
          <!--                            :page-size="pageSize"-->
          <!--                            :current-page.sync="currentPage"-->
          <!--                            @current-change="changePage"-->
          <!--                        ></c-pagination>-->
          <!--                    </div>-->
        </div>
        <div v-if="tableData.length === 0 && isExpend && jiaodian">
          <div class="sj-model"></div>
          <div :class="sTabs ? 'qs-list' : 'qs-list'"
               style="height: 100px;display: flex;justify-content: center;align-items: center;color: #FFF;">
            暂无数据
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import {tabMap, gridLevelName, placeholderMap} from './tabMap'
import {getLayerStyle} from '@/views/fullview/map2d/constant'
import dictMixin from '@/mixin/dictMixin'
import eleTable from '../eleTable.vue'
import service from '@/api/nongtianApi'

export default {
  components: {
    eleTable
  },
  mixins: [dictMixin],
  props: {
    isDistrict: Boolean,
    dataInfos: {
      type: Object,
      default: () => {
      }
    },
    riskParams: {
      type: Object,
      default: () => {
      }
    },
    infoUnfold: {
      type: Boolean,
    }
  },
  data() {
    return {
      isShow: true,
      name: '',
      sActiveTab: '',
      centerMaker: null,
      centerPolygon: null,
      centerLabel: [],
      lightInterval: null,
      currentPage: 1,
      total: 0,
      tableData: [],
      lighterGridId: '',
      // pageSize: 10,
      pageSize: 99,
      isExpend: false,
      jiaodian: false,
    }
  },
  computed: {

    activeMapType() {
      return ''
      // return this.$store.state.governPicture.activeMapType
    },
    currentGrid() {
      return this.$store.getters?.currentGrid
    },
    selElementTab() {
      return this.$store.getters['governPicture/selElementTab']
    },
    sTabs() {
      return null
      // return this.isDistrict ? null : tabMap[this.selElementTab].tabs
    },
    placeholder() {
      return placeholderMap[this.selElementTab] || '项目名称搜索'
    },
    columns() {
      if (this.isDistrict) {
        return [
          {
            prop: 'name',
            label: '小区/小组名称',
            width: 130
          },
          {
            prop: 'typeName',
            label: '类型'
          }
        ]
      } else {
        if (tabMap[this.selElementTab]?.columnsMap && this.sActiveTab) {
          return tabMap[this.selElementTab]?.columnsMap[this.sActiveTab] || []
        }
        return tabMap[this.selElementTab]?.columns || []
      }
    }
  },
  watch: {
    selElementTab() {
      this.lighterGridId = ''
      this.clearMap()
      this.currentPage = 1
      this.tableData = []
      this.sActiveTab = tabMap[this.selElementTab]?.defaultActiveTab || ''
      this.isShow = false
      this.name = ''
    },
    // currentGrid: {
    //     handler(val) {
    //         // if (this.sActiveTab === 'grid' && val && val.id !== this.lighterGridId) {
    //         //     this.clearMap()
    //         // }
    //     },
    //     deep: true
    // },
    dataInfos: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          // this.searchList()
        }
      }
    }
  },
  beforeDestroy() {
    this.clearMap()
  },
  created() {
    this.sActiveTab = tabMap[this.selElementTab]?.defaultActiveTab || ''
  },
  mounted() {
    // this.$nextTick(() => {
    //     this.searchList()
    // })
  },
  methods: {
    jiaodianss() {
      let that = this
      setTimeout(() => {
        that.jiaodian = false
      }, 400)
    },
    change(value) {
      this.name = value.trim();
      this.searchList()
    },
    handleEctebd() {
      this.isExpend = false
    },
    closeContent() {
      this.isShow = false
      this.clearMap()
    },
    sTabChange() {
      this.clearMap()
      this.name = ''
      this.currentPage = 1
      this.tableData = []
      this.searchList()
    },
    clear() {
      this.tableData = []
      this.currentPage = 1
      this.clearMap()
    },
    clearMap() {
      this.$bus.$emit('clearCenterEle')
      if (this.centerLabel.length) {
        this.centerLabel.forEach(label => {
          $twoD_map.removeLayer(label)
        })
        this.centerLabel = []
      }
      if (this.centerMaker) $twoD_map.removeLayer(this.centerMaker)
      this.centerMaker = null
      if (this.centerPolygon) $twoD_map.removeLayer(this.centerPolygon)
      this.centerPolygon = null
      if (this.lightInterval) clearInterval(this.lightInterval)
      this.lightInterval = null
    },
    lightLayer(layer) {
      if (this.lightInterval) clearInterval(this.lightInterval)
      let opcity = layer.options.fillOpacity
      let count = 0
      this.lightInterval = setInterval(() => {
        if (layer) {
          opcity = opcity === 0.8 ? 0.6 : 0.8
          layer.setStyle({fillOpacity: opcity})
          if (count === 12) {
            layer.setStyle({fillOpacity: 0.6})
            clearInterval(this.lightInterval)
            this.lightInterval = null
          }
          count++
        } else {
          clearInterval(this.lightInterval)
          this.lightInterval = null
        }
      }, 500)
    },
    async centerEle(row) {
      // console.log(row, 'rorororo')
      this.$emit('inputClick', row)
      return
      if (this.isDistrict) {
        this.$emit('centerDistrict', row)
      } else {
        switch (this.selElementTab) {
          case 'grid':
            if (this.sActiveTab === 'grid') {
              // this.$emit('updateProject', [row])
              // this.lighterGridId = row.id
              // this.$store.dispatch('grid/setCurrentGrid', row)
              // const res = await service.queryProjectPageList({ id: row.id })
              // this.$store.dispatch('grid/setGridMap', res.data || [])
              // if (this.centerPolygon) $twoD_map.removeLayer(this.centerPolygon)
              // if (this.centerLabel.length) {
              //     this.centerLabel.forEach(label => {
              //         $twoD_map.removeLayer(label)
              //     })
              //     this.centerLabel = []
              // }
              // if (row.geom) {
              //     const layer = $twoD_map.renderGeoJsonByWkt(row.geom, row, {
              //         ...getLayerStyle(row, this.activeMapType),
              //         fillOpacity: 0.6,
              //         bindObj: row
              //     })
              //     if (row.geomCenter && row.geomCenter.split(',').length > 1) {
              //         const wktArr = row.geomCenter.split(',')
              //         wktArr.forEach(wkt => {
              //             const label = $twoD_map.renderMarker($twoD_map.parsePointWktReverse($twoD_map.getCenterWktPoint(wkt)), '', '', {
              //                 icon: L.divIcon({ html: `<div class="polygon-label-icon polygon-label-icon-${row.level}">${row.name}</div>`, iconSize: [100, 20] }),
              //                 interactive: false,
              //                 opacity: 1
              //             })
              //             this.centerLabel.push(label)
              //         })
              //     } else {
              //         // 保留
              //         const label = $twoD_map.renderMarker($twoD_map.parsePointWktReverse($twoD_map.getCenterWktPoint(row.geom)), '', '', {
              //             icon: L.divIcon({ html: `<div class="polygon-label-icon polygon-label-icon-${row.level}">${row.name}</div>`, iconSize: [100, 20] }),
              //             interactive: false,
              //             opacity: 1
              //         })
              //         this.centerLabel.push(label)
              //     }
              //     $twoD_map.fitBounds(layer.getBounds())
              //     this.centerPolygon = layer
              //     this.lightLayer(layer)
              // } else {
              //     this.$message.warning('无坐标数据')
              // }
            } else {
              // 用自己的中心定位
              if (this.centerMaker) $twoD_map.removeLayer(this.centerMaker)
              if (row.wkt) {
                const centerWkt = $twoD_map.getCenterWktPoint(row.wkt)
                const latlng = $twoD_map.parsePointWktReverse(centerWkt)
                const marker = $twoD_map.renderCenterWaterMaker(latlng, row)
                $twoD_map.registerLayerEvent(marker, 'click', e => {
                  const obj = e.target.options.bindObj
                  this.$store.dispatch('governPicture/setSelectDistrict', obj)
                  this.$store.dispatch('grid/setRightSecondPatch', 'fullview/map2d/sixElement/infos/district/index.vue')
                })
                $twoD_map.flyToPoint(latlng, $twoD_map.map.getZoom(), {duration: 0, animate: true})
                this.centerMaker = marker
              } else {
                this.$message.warning('无坐标数据')
              }
            }
            break
          case 'popu':
            this.$bus.$emit('centerEle', {
              dTitle: `人员详情`,
              visible: true,
              transData: row,
              type: 'POPU'
            })
            break
          case 'event':
            this.$bus.$emit('centerEle', {
              dTitle: `事件详情`,
              visible: true,
              transData: row,
              type: 'EVENT'
            })
            break
          case 'parts':
            this.$bus.$emit('centerEle', {
              dTitle: `部件详情`,
              visible: true,
              transData: row,
              type: 'CITY_PART'
            })
            break
          case 'feelings':
            this.$bus.$emit('centerEle', {
              dTitle: `民情详情`,
              visible: true,
              transData: row,
              type: 'FEELING_DETAIL'
            })
            break
          case 'org':
            this.$bus.$emit('centerEle', {
              dTitle: `${row.typeName}详情`,
              visible: true,
              transData: row,
              type: 'ORGS'
            })
            break
          case 'place':
            this.$bus.$emit('centerEle', {
              dTitle: `${row.typeName}详情`,
              visible: true,
              transData: row,
              type: 'PLACE'
            })
            break
        }
      }
    },
    showEleDetail(row) {
      if (this.isDistrict) {
        this.$emit('showDistrict', row)
      } else {
        switch (this.selElementTab) {
          case 'grid':
            if (this.sActiveTab !== 'grid') {
              this.$store.dispatch('governPicture/setSelectDistrict', row)
              this.$store.dispatch('grid/setRightSecondPatch', 'fullview/map2d/sixElement/infos/district/index.vue')
            }
            break
          case 'popu':
            this.$store.dispatch('governPicture/setMiddleDialog', {
              dTitle: `人员详情`,
              visible: true,
              transData: row,
              type: 'POPU'
            })
            break
          case 'event':
            this.$store.dispatch('governPicture/setMiddleDialog', {
              dTitle: `事件详情`,
              visible: true,
              transData: row,
              type: 'EVENT'
            })
            break
          case 'parts':
            this.$store.dispatch('governPicture/setMiddleDialog', {
              dTitle: `部件详情`,
              visible: true,
              transData: row,
              type: 'CITY_PART'
            })
            break
          case 'feelings':
            this.$store.dispatch('governPicture/setMiddleDialog', {
              dTitle: `民情详情`,
              visible: true,
              transData: row,
              type: 'FEELING_DETAIL'
            })
            break
          case 'org':
            this.$store.dispatch('governPicture/setMiddleDialog', {
              dTitle: `${row.typeName}详情`,
              visible: true,
              transData: row,
              type: 'ORGS'
            })
            break
          case 'place':
            this.$store.dispatch('governPicture/setMiddleDialog', {
              dTitle: `${row.typeName}详情`,
              visible: true,
              transData: row,
              type: 'PLACE'
            })
            break
        }
      }
    },
    changePage(page) {
      this.currentPage = page
      this.searchList()
    },
    handleSelect(obj) {
      this.selectInfos = obj
    },
    searchList(params) {
      if (!params) params = {}
      params.pageNum = this.currentPage
      params.pageSize = this.pageSize
      const {districtDivisionId} = this.dataInfos
      // params.query = {
      //     districtDivisionId: 1751840246573678593,
      //     projectName: this.name
      // }
      params.query = {
        projectName: this.name,
        ...this.riskParams
      }

      let p
      p = service.queryProjectPageList(params)
      if (p) {
        p.then(res => {
          console.log('apagesishhadhsu', res)
          if (res.code === '200' && res.data) {
            this.total = res.data.total || 0
            const arr = res.data.records || []
            arr.forEach(item => {
              item.label = item.projectName
            })
            this.tableData = arr
            // this.$emit('updateProject', this.tableData)
            this.isExpend = true
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ele-quick-search {
  position: absolute;
  right: 452px !important;
  top: 120px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 3;

  &-grid,
  &-event {
    right: 474px;
  }

  .qs-btn {
    width: 44px;
    height: 44px;
    background-image: url('~@/assets/darktheme/imgs/searchnormal.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    cursor: pointer;

    &-active,
    &:hover {
      width: 44px;
      height: 44px;
      background-image: url('~@/assets/darktheme/imgs/searchyellow.png');
    }
  }

  .qs-content {
    margin-top: 60px;
    width: 240px;
    // height: 280px;
    // background-image: url('~@/assets/darktheme/imgs/quikbg.png');
    // background-repeat: no-repeat;
    // background-size: 100% 100%;
    .qs-head {
      // border-image: linear-gradient(1deg, rgba(96, 226, 255, 1), rgba(0, 108, 144, 1)) 1 1;
      display: flex;
      justify-content: space-between;

      background: #08285e;
      border-radius: 4px;
      //border: 1px solid #7d90a5;
      width: 240px;
      height: 36px;

      .qs-input {
        height: 36px;
        width: 100%;
        // background-image: url('~@/assets/darktheme/imgs/quikhead.png');
        // background-repeat: no-repeat;
        // background-size: 100% 100%;
        padding-left: 8px;
        padding-right: 12px;
        display: flex;
        align-items: center;

        ::v-deep .c-input.cestc-dark-input .c-input__inner {
          width: calc(100% - 28px);
          background: transparent;
        }

        .qs-search-btn {
          height: 24px;
          width: 24px;
          background-image: url('~@/assets/darktheme/imgs/quicksearch.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
          //cursor: pointer;
        }
      }

      .qs-close {
        height: 37px;
        width: 52px;
        background-image: url('~@/assets/darktheme/imgs/quickclose.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
    }

    .s-tabs {
      display: flex;
      justify-content: flex-start;
      padding: 2px 10px;
    }

    .qs-list {
      //padding: 0 10px;
      //height: 367px;
      min-height: 130px;
      max-height: 330px;
      width: 240px;
      background: #08285e;
      border-radius: 4px;
      border: 1px solid #7d90a5;
      border-top: 0;
      overflow-x: hidden;
      overflow-y: auto;

      &-hastab {
        height: calc(100% - 84px);
      }
    }
  }

  .qs-contentA {
    margin-right: 20px !important;
  }

  .sj-model {
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 15px solid #08285e;
    margin: 0 auto;
  }

  ::v-deep {
    .c-input__inner,
    .cestc-dark-cascader .c-input__inner {
      border: 0;
    }

    .el-input__inner {
      height: 100%;
      width: 100%;
      background: rgba(0, 0, 0, 0);
      border: none;
      color: #FFF;
    }
  }

  .tb-page {
    margin-top: -54px;
  }

  .extend-image {
    width: 31px;
    height: 25px;
    background-image: url('~@/assets/agriculture/xingzhuang_915_2.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    margin-top: -11px;
    cursor: pointer;
  }
}
</style>
