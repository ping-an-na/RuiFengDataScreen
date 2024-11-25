<!--
@Author: lism
@Description: 区域说明-项目
@Date: 2024-
-->
<template>
  <div class="card-wrapper" :class="{infoUnfold:!infoUnfold,showFlag:!showFlag}">
    <ul class="tab-list" v-if="showFlag">
      <li :class="['tab-list-item', {active: activeTab === '1'}]" @click="_change('1')">点状物工程</li>
      <li :class="['tab-list-item', {active: activeTab === '2'}]" @click="_change('2')">线状物工程</li>
      <li :class="['tab-list-item', {active: activeTab === '3'}]" @click="_change('3')">面状物工程</li>
    </ul>
    <div class="right" v-show="showFlag">
      <div class="top">
        <div class="title">区域说明：</div>
        <div class="action">
          <el-switch v-model="showFlag" @change="changeSwitch"/>
        </div>
      </div>
      <ul class="content" v-if="showFlag">
        <li class="list-item"
            v-for="(item,index) in contentList"
            :key="item.code"
            :class="{row: item.name.length > 8}"
            :style="activeTabStyle(activeTab,index)"
            @click="iconClick(item,index)">
          <img v-if="activeTab === '1'" :src="item.flag?pointEngineering[item.code]: pointEngineeringFalse[item.code]"
               alt srcset/>
          <img v-if="activeTab === '2'" :src="item.flag?lineEngineering[item.code]: lineEngineeringFalse[item.code]" alt
               srcset/>
          <img v-if="activeTab === '3'"
               :src="item.flag?surfaceEngineering[item.code]: surfaceEngineeringFalse[item.code]" alt srcset/>
          <span class="name">{{ item.name }}</span>
        </li>
      </ul>
    </div>
    <div v-show="!showFlag" style="display: flex;justify-content: center;align-items: center;">
      <div style="padding-right: 10px;">图例:</div>
      <el-switch v-model="showFlag" @change="changeSwitch"/>
    </div>
  </div>
</template>

<script>
import {
  PointConstructionMap,
  LineConstructionMap,
  AreaConstructionMap,
  ProjectStatus,//
  pointEngineering,
  pointEngineeringFalse,
  lineEngineering,
  lineEngineeringFalse,
  surfaceEngineering,
  surfaceEngineeringFalse
} from './map-constant'

const tabMap = {
  1: PointConstructionMap,
  2: LineConstructionMap,
  3: AreaConstructionMap
}
export default {
  props: {
    infoUnfold: {
      type: Boolean,
      default: false
    },
    districtTipShowFlag: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    districtTipShowFlag: {
      handler(nVal) {
        this.showFlag = nVal
      },
      immediate: true
    }
  },
  data() {
    return {
      activeTab: '1',
      showFlag: true, // 是否显示

      // 点覆盖物
      pointEngineeringA: [
        {name: '塘堰(坝)', code: 'tangyan', flag: true},
        {name: '小型拦河坝', code: 'xxlhb', flag: true},
        {name: '农用井', code: 'nyj', flag: true},
        {name: '小型集雨设施', code: 'xxjyss', flag: true},
        {name: '倒虹吸', code: 'dhx', flag: true},
        {name: '农桥', code: 'nq', flag: true},
        {name: '水闸', code: 'shuiz', flag: true},
        {name: '渡槽', code: 'lingcao', flag: true},
        {name: '变压器', code: 'byq', flag: true},
        {name: '跌水', code: 'dieshui', flag: true},
        {name: '其他', code: 'qita', flag: true},
        {name: '涵洞', code: 'handong', flag: true},
        {name: '配电箱', code: 'pdx', flag: true},
        {name: '泵站', code: 'bengzhan', flag: true},
      ],
      // 线覆盖物
      lineEngineeringA: [
        {name: '疏浚沟渠新建', code: 'sjgqxj', flag: true},
        {name: '硬化道路', code: 'yhdl', flag: true},
        {name: '排水暗渠(管)', code: 'psaqg', flag: true},
        {name: '机耕道', code: 'jgd', flag: true},
        {name: '衬砌明渠(沟)', code: 'cqmqg', flag: true},
        {name: '生产道路', code: 'scdl', flag: true},
        {name: '生产道路-新建', code: 'scdlXj', flag: true},
        {name: '田间道路', code: 'tjdl', flag: true},
        {name: '田间道路-新建', code: 'tjdlXj', flag: true},
        {name: '农田林网', code: 'ntlw', flag: true},
        {name: '岸坡防护', code: 'apfh', flag: true},
        {name: '沟道治理', code: 'gdzl', flag: true},
        {name: '坡面防护', code: 'pmfh', flag: true},
        {name: '低压线路', code: 'dyxl', flag: true},
        {name: '10kv以下的高压输电线路', code: 'kvyxdxl', flag: true},
      ],
      //面覆盖物
      surfaceEngineeringA: [
        {name: '灌溉和排水', code: 'ggps', flag: true},
        {name: '土地改良', code: 'tdgl', flag: true},
        {name: '土地平整', code: 'tdpz', flag: true},
      ],
      pointEngineering,
      pointEngineeringFalse,
      lineEngineering,
      lineEngineeringFalse,
      surfaceEngineering,
      surfaceEngineeringFalse
    }
  },
  computed: {

    contentList() {
      if (this.activeTab === '1') {
        return this.pointEngineeringA
      }
      if (this.activeTab === '2') {
        return this.lineEngineeringA
      }
      if (this.activeTab === '3') {
        return this.surfaceEngineeringA
      }
      // 对象转数组
      // return Object.keys(tabMap[this.activeTab]).map(key => {
      //   return {
      //     label: key,
      //     icon: tabMap[this.activeTab][key]
      //   }
      // })
    }
  },
  methods: {
    changeSwitch(e) {
      // console.log(e)
      if (e === true || e === false) this.$emit('districtTipShowFlagEvent', e)
    },
    activeTabStyle(v, i) {
      // console.log(v === "1" || i % 2 === 0,v  , i % 2)
      if (v === "1" && i % 2 === 0) return 'width:45%'
      if (v === "1" && i % 2 === 1) return 'width:55%'
      if (v === "2" && i % 2 === 0 && i !== 14) return 'width:58%'
      if (v === "2" && i % 2 === 1 && i !== 14) return 'width:42%'
      if (v === "2" && i === 14) return "width:100%"
      return ''
    },
    iconClick(item, index) {
      if (this.activeTab === '1') {
        this.pointEngineeringA[index].flag = !this.pointEngineeringA[index].flag
        this.$emit('upDataMap', {
          code1: 'pointEngineering',
          code2: this.pointEngineeringA[index].code,
          flag: this.pointEngineeringA[index].flag
        })
      }
      if (this.activeTab === '2') {
        this.lineEngineeringA[index].flag = !this.lineEngineeringA[index].flag
        this.$emit('upDataMap', {
          code1: 'lineEngineering',
          code2: this.lineEngineeringA[index].code,
          flag: this.lineEngineeringA[index].flag
        })
      }
      if (this.activeTab === '3') {
        this.surfaceEngineeringA[index].flag = !this.surfaceEngineeringA[index].flag
        this.$emit('upDataMap', {
          code1: 'surfaceEngineering',
          code2: this.surfaceEngineeringA[index].code,
          flag: this.surfaceEngineeringA[index].flag
        })
      }
    },
    _change(tabValue) {
      if (this.activeTab === tabValue) return
      this.activeTab = tabValue
    }
  }
}
</script>

<style lang="scss" scoped>
.showFlag {
  width: 110px !important;
  justify-content: center;
  align-items: center;
  height: 45px !important;
}

.infoUnfold {
  bottom: 320px !important;
}

.card-wrapper {
  position: absolute;
  left: 450px;
  bottom: 335px;
  //width: 390px;
  width: 320px;
  height: 310px;
  transition: width 0.5s, height 0.5s, bottom 0.5s;
  color: #fff;
  background-color: rgba(33, 41, 27, 0.85);
  border: 1px solid #79abc6;
  display: flex;

  border-radius: 8px;
  overflow: hidden;

  .tab-list {
    width: 48px;
    background-color: #1f2e51;
    display: flex;
    flex-direction: column;

    .tab-list-item {
      writing-mode: vertical-rl;
      color: #fff;
      height: 100px;
      height: 130px;
      cursor: pointer;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      &.active {
        background: linear-gradient(90deg, rgba(32, 134, 221, 1), rgba(32, 134, 221, 0.3));
      }
    }
  }

  .right {
    padding: 10px;
    width: calc(100% - 48px);

    .top {
      display: flex;

      .action {
        margin-left: auto;
      }
    }

    .content {
      display: flex;
      flex-wrap: wrap;
      margin-top: 10px;
      height: 32px;
      align-items: center;

      .list-item {
        width: 50%;
        height: 32px;
        line-height: 32px;
        //margin-bottom: 10px;
        padding-left: 10px;
        cursor: pointer;

        &.row {
          width: 100%;
        }

        .name {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
