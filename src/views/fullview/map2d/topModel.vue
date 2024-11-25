<template>
  <div :class="['fullscreenwrokbench', type === 'party' ? 'party-screen' : '']">
    <div class="banner">
      <!-- area -->
      <div class="area">
        <!-- 除了省级看板外，都要有返回按钮 -->
        <div class="back" v-if="cachePath.length > 1" @click.stop="_back">
          <img src="../../../assets/agriculture/back123.png" alt/>
        </div>
        <img src="../../../assets/agriculture/container_19.png" alt/>
        <div class="area-name">{{ currentDistrictName || '-' }}</div>
      </div>
      <div class="logo">
        <h3>{{ title }}</h3>
      </div>
      <div class="rightTime">
        <span class="span1">{{ timeUse.year }}</span>
        <span class="span2">年</span>
        <span class="span1">{{ timeUse.month }}</span>
        <span class="span2">月</span>
        <span class="span1">{{ timeUse.day }}</span>
        <span class="span2 noright">日</span>
        <i/>
        <span class="span3">{{ timeUse.hhmmss }}</span>
        <span class="pay-con">{{ getDay }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScientificDecision',
  props: {
    currentDistrictName: {
      type: String,
      default: ''
    },
    showType: {
      type: Number,
      default: 1
    },
    cachePath: {
      type: Array,
      default: []
    },
  },

  data() {
    return {
      title: '高标准农田建设监管平台',
      type: 'social',
      timeUse: {
        year: '',
        month: '',
        day: '',
        hhmmss: '',
        hhmm: '',
      },
      timeInterval: null
    }
  },
  computed: {
    getDay() {
      let now = new Date()
      return '星期' + '日一二三四五六'[now.getDay()]
    }
  },
  async created() {
    // 时间表
    this.timeInterval = setInterval(() => {
      const nowdate = new Date()
      this.timeUse.year = nowdate.getFullYear()
      this.timeUse.month = nowdate.getMonth() + 1 < 10 ? `0${nowdate.getMonth() + 1}` : nowdate.getMonth() + 1
      this.timeUse.day = nowdate.getDate() < 10 ? `0${nowdate.getDate()}` : nowdate.getDate()
      this.timeUse.hhmmss = `${nowdate.getHours() < 10 ? `0${nowdate.getHours()}` : nowdate.getHours()}:${nowdate.getMinutes() < 10 ? `0${nowdate.getMinutes()}` : nowdate.getMinutes()}:${nowdate.getSeconds() < 10 ? `0${nowdate.getSeconds()}` : nowdate.getSeconds()}`
      this.timeUse.hhmm = `${nowdate.getHours() < 10 ? `0${nowdate.getHours()}` : nowdate.getHours()}:${nowdate.getMinutes() < 10 ? `0${nowdate.getMinutes()}` : nowdate.getMinutes()}`
    }, 1000)

    // 初始化根据路由加载不同组件
    // this.loadComponentByRoute()
  },

  beforeDestroy() {
    clearInterval(this.timeInterval)
  },
  methods: {
    _back() {
      this.$emit('back')
    }
  }
}
</script>

<style lang="scss" scoped>
.fullscreenwrokbench {
  width: 100%;
  // min-width: 1920px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;

  //z-index: 9999;

  overflow: hidden;
  color: #ffffff;
  background: linear-gradient(180deg, #020c2c 70%, rgba(2, 12, 44, 0) 100%);
  //opacity: 0.8;
  ::v-deep {
    .el-loading-mask {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }

  .area {
    display: flex;
    padding: 13px 0 0 18px;
    position: absolute;

    .back {
      margin-right: 10px;
      cursor: pointer;

      img {
        width: 80px;
        margin-top: -5px;
      }
    }

    > img {
      height: 20px;
      width: 18px;
      margin-right: 10px;
    }

    .area-name {
      font-family: Source Han Sans CN;
      font-weight: bold;
      font-size: 16px;
      color: #ffffff;
      padding-top: 2px;

      width: 450px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .banner {
    width: 100%;
    height: 68px;
    background: url('~@/assets/agriculture/header_@2x.png') top center no-repeat;
    background-size: auto 100%;
    position: relative;
    z-index: 2;

    .logo {
      width: 700px;
      text-align: center;
      margin: 0 auto;

      h3 {
        margin: 0px;
        padding-top: 8px;

        font-family: PangMenZhengDao-3;
        font-weight: 400;
        font-size: 36px;
        color: #ffffff;
        background: linear-gradient(0deg, #78d4f7, #78d4f7, #74d4fc, #70c4ec, #89c9e7, #b2eafd, #b8dded, #cce0e9, #fcfeff, #f5fafb, #fff, #fff, #fff, #fff, #fff, #fff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      h6 {
        margin: 0px;
        font-size: 12px;
        font-family: Cornerstone;
        color: #e6c18a;
        line-height: 13px;
        letter-spacing: 5px;
        padding-top: 5px;
        font-weight: bold;
      }
    }

    .rightTime {
      position: absolute;
      width: 350px;
      height: 38px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      right: 10px;
      top: 0px;

      > .span1 {
        //font-family: Impact;
        font-family: PangMenZhengDao;
        color: #bbc0d5;
        text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.5);
      }

      > .span2 {
        font-size: 14px;
        font-family: PangMenZhengDao;
        color: #bbc0d5;
        margin: 0 4px;
      }

      > .noright {
        margin-right: 0px;
      }

      > .span3 {
        width: 70px;
        font-size: 14px;
        //font-family: Impact;
        font-family: PangMenZhengDao;
        color: #bbc0d5;
        text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.5);
        letter-spacing: 1px;
        display: flex;
        justify-content: center;
      }

      > i {
        width: 2px;
        height: 17px;
        // background: url('~@/assets/fullscreen/日期分页@2x.png') top center no-repeat;
        background-size: auto 100%;
        margin: 0 10px;
      }
    }
  }

  .mainbox {
    width: 100%;
    height: calc(100% - 82px);
    position: absolute;
    left: 0px;
    top: 82px;
    z-index: 3;
  }

  .menu {
    position: absolute;
    min-width: 1920px;
    width: calc(100%);
    height: 93px;
    bottom: 0;
    left: 0;
    z-index: 5;
  }

  .back-model {
    width: 108px;
    height: 29px;
    background: url('~@/assets/agriculture/back123.png') top center no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    margin-top: -10px;
    margin-right: 25px;
  }

  .pay-con {
    margin-left: 30px;
    color: #bbc0d5;

  }
}
</style>
