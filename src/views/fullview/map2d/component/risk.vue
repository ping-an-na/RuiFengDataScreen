<template>
  <div>
    <div class="risk-right">
      <!--      -->
      <div class="more-btn" @click="handleMore(1)">更多</div>
      <top-title-modle title="风险预警" top="-10px"/>

      <!--          <div style="height: 100%;width: 100%;overflow: hidden">-->
      <!--            <cestc-scroll :data="riskList">-->

      <!--      <div class="base-con" :style="`height:${height ? height : 215 }px;overflow-y: auto;top:${top ? top : '0px' }`"-->
      <!--           v-if="riskList.length>0">-->
      <!--        <div class="items" v-for="(item, index) in riskList" :key="index" @click="infoErrClick(item)">-->
      <!--          <div class="item-fi">-->
      <!--            <div class="con-name">{{ '超时预警' }}</div>-->
      <!--            <div class="con-value">{{ item.earlyWarningTime }}</div>-->
      <!--          </div>-->
      <!--          <div class="item-se">{{ item.earlyWarningContent }}</div>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      v-if="limitMoveNum === 2"-->
      <div :style="`position: relative;top:${top};`">
        <div v-if="riskList.length > 0" @click.stop="infoErrClick($event)">
          <vue-seamless-scroll :data="riskList" :class-option="{ step: 0.4, limitMoveNum: limitMoveNum}"
                               :style="`height:${height ? height : 215 }px;overflow:hidden;position:relative;`">
            <div class="base-con" :style="`height:${height ? height : 215 }px;`" v-if="riskList.length>0">
              <div class="items" v-for="(item, index) in riskList" :key="index" :bbid="index">
                <div class="item-fi" :bbid="index">
                  <div class="con-name" :bbid="index">{{ item.projectSectionName }}</div>
                  <div class="con-value" :bbid="index">
                    {{ item.earlyWarningTime }}
                  </div>
                </div>
                <div class="item-se" style="display: flex;" :bbid="index">
                  <div class="fcplde-fxyj" :bbid="index">{{ handleWaring(item.earlyWarningType) }}</div>
                  <div class="houmiandeshenglue" style="" :bbid="index">{{ item.earlyWarningContent }}</div>
                </div>
              </div>
            </div>
          </vue-seamless-scroll>
        </div>
        <div v-else style="display: flex;justify-content: center;align-items: center;flex-flow: column;">
          <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 300px;position: relative;top: -30px"/>
          <div style="color: #FFF;position: relative;top: -130px;">暂无数据...</div>
        </div>
      </div>


      <!--            </cestc-scroll>-->
      <!--          </div>-->
      <!--            <div class="base-con">-->
      <!--                <div class="items" v-for="(item, index) in riskList" :key="index">-->
      <!--                    <div class="item-fi">-->
      <!--                        <div class="con-name">{{'超时预警'}}</div>-->
      <!--                        <div class="con-value">{{item.earlyWarningTime}}</div>-->
      <!--                    </div>-->
      <!--                    <div class="item-se">{{item.earlyWarningContent}}</div>-->
      <!--                </div>-->
      <!--            </div>-->


    </div>
    <div class="risk-dia">
      <common-dialog
          ref="commonDialog"
          v-if="showRiskDialog"
          @closeDialog="closeRiskDialog"
          :dataInofs="riskListByPage"
          :columnList="columnList"
          @details="handleDetails"
          :initType="dialogType"
          @handleMore="handleMore"
          :isBack="isBack"
      />
      <!--      <list-dialog v-if="showRiskDialog" @closeDialog="closeRiskDialog" :dataList="riskList" @details="handleDetails"/>-->
      <details-dialog v-if="showRiskDetailsDialog" @closeDialog="closeRiskDetailsDialog" :infos="infos"/>
    </div>
  </div>
</template>

<script>
import listDialog from './listDialog.vue'
import detailsDialog from './detailsDialog.vue'
import commonDialog from './dialog.vue'
import moduleSrv from '@/api/nongtianApi'

const columnList = [
  {
    label: '标段名称',
    prop: 'projectSectionName',
    width: '150'
  },
  {
    label: '预警类型',
    prop: 'earlyWarningTypeStr',
    width: '150'
  },
  {
    label: '预警内容',
    prop: 'earlyWarningContent',
    width: '150'
  },
  {
    label: '预警日期',
    prop: 'earlyWarningTime',
    width: '150'
  }
]

export default {
  name: 'Risk',
  components: {
    listDialog,
    detailsDialog,
    commonDialog
  },
  props: {
    limitMoveNum: {
      type: Number,
      default: 5
    },
    top: {
      type: String,
      default: '0px'
    },
    height: {
      type: Number,
      default: 0
    },
    riskList: {
      type: Array,
      default: () => []
    },
    params: {
      type: Object,
      default: () => {
      }
    },
    riskParams: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      classOption: {
        step: 0.4,
        limitMoveNum: 3,
      },
      showRiskDialog: false,
      showRiskDetailsDialog: false,
      infos: {},
      isBack: true,
      dialogType: '1',
      riskListByPage: {},
      columnList: columnList,

    }
  },
  watch: {},
  async created() {
  },
  mounted() {
    this.$bus.$on('riskParams', msg => {
      debugger
      // A发送来的消息
      // this.riskParams = msg
    })
  },
  destroyed() {
  },
  methods: {
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

    handleMore(pageSize) {
      console.log(this.riskParams, pageSize)
      let query = {...this.riskParams, id: this.riskParams.projectId}
      // 请求接口数据
      moduleSrv
          .queryRiskEarlyWarningPageList({
            query,
            pageNum: pageSize,
            pageSize: 8
          })
          .then(res => {
            const {code, data = []} = res
            if (code === '200') {

              // console.log('getRiskListBypage--res--', res)
              const list = data.records.map(item => {

                item.createAt = this.dateGeshihua(item.createAt)
                item.earlyWarningTime = this.dateGeshihua(item.earlyWarningTime)

                //预警类型 1超时预警、2安全预警、3巡视预警、4其他预警
                item.earlyWarningTypeStr = this.handleWaring(item.earlyWarningType)
                item.content = item.earlyWarningContent
                return item
              })
              this.riskListByPage = data
            }
          })
      this.dialogType = '1'
      this.isBack = true
      this.showRiskDialog = true
    },

    infoErrClick(row) {
      let event = row.target || row.srcElement
      let bbid = event.getAttribute('bbid');
      let data = this.riskList[bbid]
      console.log(data, bbid, 'data')
      // this.riskListByPage = data
      this.dialogType = '2'
      this.isBack = false
      this.showRiskDialog = true

      setTimeout(() => {

        console.log(this.$refs.commonDialog)

        this.$refs.commonDialog.detailsInfo = {
          projectSectionName: data.projectSectionName || '',
          earlyWarningTime: data.earlyWarningTime || '',
          earlyWarningTypeStr: this.handleWaring(data.earlyWarningType) || '',
          content: data.earlyWarningContent || '',
        }

      }, )


    },
    handleWaring(type) {
      switch (type) {
        case 1:
          return '超时预警'
        case 2:
          return '安全预警'
        case 3:
          return '安全预警'
        case 4:
          return '其他预警'
      }
    },
    closeRiskDialog() {
      this.showRiskDialog = false
    },
    closeRiskDetailsDialog() {
      this.showRiskDetailsDialog = false
    },
    handleDetails(row) {
      this.closeRiskDialog()
      this.showRiskDetailsDialog = true
      this.infos = row
    }
  }
}
</script>

<style lang="scss" scoped>
.base-con {
  min-height: 150px;
  position: relative;
  margin-bottom: 20px;
  display: flex;
  flex-flow: column;

  .items {
    cursor: pointer;

    width: calc(100% - 40px);
    margin: 0 auto;
    height: 60px;
    background: url('~@/assets/agriculture/4@2x.png') top center no-repeat;
    background-size: 100% 100%;
    padding: 6px 7px 12px 39px;


    margin-bottom: 10px;
    margin-top: 10px;

  }

  .item-fi {
    display: flex;
    justify-content: space-between;
    //width: 100%;
    // height: 28px;
    // background: rgba(4, 32, 79, 0.5);
    // align-items: center;
    // padding: 0 20px;
    margin-bottom: 2px;
    margin-left: 6px;
    margin-right: 4px;

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
    margin-left: 10px;
    margin-top: 12px;


    .houmiandeshenglue {
      width: 80%;

      display: inline-block;
      white-space: nowrap;
      //width: 80%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.risk-right {
  position: relative;

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
}

.fcplde-fxyj {
  width: 19%;
  margin-left: 1%;
  background: linear-gradient(0deg, rgba(14, 247, 246, 1) 0%, rgba(14, 247, 246, 0.4) 20%, #FFF 100%);
  //background: linear-gradient(to top, #ff0000, #ffff00); /*设置渐变的方向从左到右 颜色从ff0000到ffff00*/
  -webkit-background-clip: text; /*将设置的背景颜色限制在文字中*/
  -webkit-text-fill-color: transparent; /*给文字设置成透明*/
  font-weight: 900;

}
</style>
