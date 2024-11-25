<template>
  <div class="bottom-middle-mo" v-on:mouseover="handleMouseOver2"
       v-on:mouseout="handleMouseOut2">
    <div class="bo-top-con">
      <div class="title">
        <span>施工进度</span>
      </div>
    </div>

    <!--    <div class="prcess-con" v-if="tableList.length > 0">-->
    <!--      <div-->
    <!--          style="width: 900px;height: 50px;border: rgba(25, 189, 250,0.3) 0.1px solid;position: absolute;left: -20px;top: 6px;"></div>-->
    <!--      <div style="position: absolute;left: 0;top: 22px;color: #FFF">施工总进度</div>-->
    <!--      <bar-chart :chart-data="peoplerangeOption"/>-->
    <!--    </div>-->

    <div class="progressA prcess-conA">
      <div class="sjzjdDiv">实际总进度</div>
      <div class="contA">
        <div class="pA" :style="{ width: overallProgress }">
          <div class="sA">
            <div class="spanA" v-for="count in 16" :key="count"></div>
          </div>
          <div style="position: absolute;right: -80px;top: 0px">{{ overallProgress }}</div>
        </div>
      </div>
    </div>


    <div class="se-con" v-if="tableList.length > 0">
      <div style="width:100%;display: flex;justify-content: center;align-items: center;margin-bottom: 10px;">
        <img v-if="!noLeft" src="~@/views/fullview/map2d/img/jt/1.png" class="imgJt" style="left: -10px"
             @click='leftClick'
             @mousedown.left="handleLeftClickLeftDown"
             @mouseup.left="handleLeftClickLeftUp"
             @mouseleave="handleLeftClickLeftUp"
        >
        <img v-else src="~@/views/fullview/map2d/img/jt/2.png" class="imgJt" style="left: -10px" @click='leftClick'
             @mousedown.left="handleLeftClickLeftDown"
             @mouseup.left="handleLeftClickLeftUp"
             @mouseleave="handleLeftClickLeftUp"
        >
        <!--imgJt('left')"-->
        <div style="overflow-x: auto;width: 900px;" id="x-roll" v-on:mouseover="handleMouseOver"
             v-on:mouseout="handleMouseOut">
          <!--          ${ 130 * tableList.length }px;-->
          <div class="se-con-btns" :style="`width: ${widthPX}px`">
            <div v-for="(item, index) in tableList" :key="index" @click="activeValueClick(item)">
              <div class="se-lef" @click="activeValueClick(item)">
                <div @click="activeValueClick(item)"
                     :style="`width: ${item.px}px`"
                     :class="item.label === activeValue ? 'se-lef-name' : 'se-lef-name-hi'">{{ item.label }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--imgJt('right')"-->
        <img v-if="!noRight" src="~@/views/fullview/map2d/img/jt/4.png" class="imgJt" style="right: -10px"
             @click="rightClick"
             @mousedown.left="handleLeftClickRightDown"
             @mouseup.left="handleLeftClickRightUp"
             @mouseleave="handleLeftClickRightUp"
        >
        <img v-else src="~@/views/fullview/map2d/img/jt/3.png" class="imgJt" style="right: -10px"
             @click="rightClick"
             @mousedown.left="handleLeftClickRightDown"
             @mouseup.left="handleLeftClickRightUp"
             @mouseleave="handleLeftClickRightUp"
        >

      </div>
      <!-- 走马灯 -->
      <div style="width: 980px;position: relative;left: 70px">
        <el-carousel height="150px" :autoplay="false" v-if="carouselList && carouselList.length !== 0">
          <el-carousel-item v-for="(i,index) in carouselList" :key="index">
            <div class="ri-pie">
              <div class="ri-pie-con" v-for="(item, index) in i" :key="index">
                <div class="ri-pie-item">
                  <pie-chart :chart-data="setProcessOptions(item.value,item.total,item.unit)"/>
                  <div class="ri-name">{{ item.itemName }}</div>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
        <div v-else style="display: flex;justify-content: center;align-items: center;flex-flow: column;">
          <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 200px;position: relative;top: -40px;"/>
          <div style="color: #FFF;position: relative;top: -100px;">暂无数据...</div>
        </div>
      </div>

    </div>

    <div v-else style="display: flex;justify-content: center;align-items: center;flex-flow: column;">
      <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 300px;position: relative;top: -50px;"/>
      <div style="color: #FFF;position: relative;top: -150px;">暂无数据...</div>
    </div>

  </div>
</template>
<script>
// import stepSe from './stepSe.vue'
import {
  usepeoplerangeEchartsOption,
  pieChartProcess,
  getProcessOptions,
  barProjectOptionsSe2
} from '../newEchartsOptions'
import pieChart from '@/components/echarts/pieChart'
import barChart from '@/components/echarts/barChart'
import {deepClone} from '@/utils'

const typeList = [
  {
    name: '全部',
    value: 'all'
  },
  {
    name: '土地平改',
    value: '1'
  },
  {
    name: '土地改良',
    value: '2'
  },
  {
    name: '带奶白色的',
    value: '3'
  },
  {
    name: '上升空间的',
    value: '4'
  }
]

const processDataList = [
  {
    name: 'sdfdfdf',
    value: 100
  },
  {
    name: '土地平改',
    value: 60
  },
  {
    name: '土地改良',
    value: 20
  },
  {
    name: '带奶白色的',
    value: 60
  },
  {
    name: '上升空间的',
    value: 60
  }
]

function extractNumbers(str) {
  return str.match(/\d+/g);
}

export default {
  components: {
    // stepSe,
    barChart,
    pieChart
  },
  props: {
    dataInfos: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      setTimeName: null, //
      overallProgress: "0%",
      peoplerangeOption: {},
      carouselList: [],
      tableList: [],
      areaPieOption: {},
      typeList: typeList,
      activeValue: '',
      processDataList,
      areaPieOption1: {},
      areaPieOption2: {},
      setIntervalId: '',
      nav: null,
      stopXunhuan: false,
      navNumber: 0,
      noLeft: true,
      noRight: false,
      widthPX: 0
    }
  },
  watch: {
    dataInfos: {
      deep: true,
      // immediate: true,
      handler(val) {
        if (val) {
          let {overallProgress = 0, constructionProgress = []} = val

          constructionProgress = JSON.parse(JSON.stringify(constructionProgress))
          // overallProgress = 100
          usepeoplerangeEchartsOption.series[0].data = [overallProgress] //
          usepeoplerangeEchartsOption.series[2].data = [overallProgress] //
          this.overallProgress = overallProgress + "%"
          this.peoplerangeOption = usepeoplerangeEchartsOption


          if (!constructionProgress[0]) return

          let constructionProgressAll = {
            label: '全部',
            items: [],
          }

          constructionProgress.map(res => {
            if (res.items) {
              constructionProgressAll.items.push(...res.items)
            }
          })

          let dds = [constructionProgressAll, ...constructionProgress]

          this.tableList = dds
          this.tableList.forEach(item => {
            item['px'] = (60 + (item.label.length * 16))
            // if (item.label.length > 8) {
            //   item['px'] = 220
            // } else {
            //   item['px'] = 130
            // }

            this.widthPX += item.px
          })
          // console.log(dds[0].items, 'dds[0].items')
          const list = dds[0].items.map(item => {
            if (item.itemValue) item.itemValue = item.itemValue + ''
            const num = item.itemValue ? item.itemValue : 0
            item.value = num - 0
            return item
          })
          var result = []
          for (var i = 0; i < list.length; i += 8) {
            result.push(list.slice(i, i + 8))
          }
          // console.log(result, dds, 'dds--')

          this.carouselList = result
          this.activeValue = dds[0].label || ''
        }
      }
    }
  },
  mounted() {
    this.areaPieOption1 = barProjectOptionsSe2

    // if (this.setIntervalId) clearTimeout(this.setIntervalId)

    // this.setIntervalId = setInterval(() => {
    //   if (this.stopXunhuan) return
    //   let indexA = ''
    //   if (this.activeValue && this.tableList.length > 1) {
    //     this.tableList.forEach((item, index) => {
    //       if (this.activeValue === item.label) {
    //         // console.log(this.activeValue, item.label, index)
    //         indexA = index
    //       }
    //     })
    //     if (!this.nav) this.nav = document.getElementById("x-roll")
    //     // console.log(this.nav)
    //     if (this.nav) this.nav.scrollLeft = 0
    //
    //     if (indexA === this.tableList.length - 1) {
    //       this.activeValueClick(this.tableList[0])
    //       if (this.nav) this.nav.scrollLeft = 0;
    //
    //     } // this.activeValue = this.tableList[0].label
    //     else {
    //       this.activeValueClick(this.tableList[indexA + 1])
    //       if (this.nav) {
    //         let widthPx = 0
    //         this.tableList.forEach((item, index) => {
    //           if (index <= indexA) {
    //             widthPx += item.px
    //           }
    //         })
    //         if (widthPx == 0) widthPx = 130
    //         this.nav.scrollLeft = widthPx
    //       }
    //
    //     } //this.activeValue = this.tableList[index + 1].label
    //   }
    // }, 6000)


  },
  methods: {

    handleLeftClickLeftDown(item) {
      if (!this.nav) this.nav = document.getElementById("x-roll")
      let that = this
      this.setTimeName = setInterval(() => {
        that.nav.scrollLeft = that.nav.scrollLeft - 5
      }, 15)
    },
    handleLeftClickLeftUp() {
      clearInterval(this.setTimeName)
      if (this.nav.scrollLeft < 0 || this.nav.scrollLeft === 0) {
        this.noLeft = true
        this.noRight = false
      }
      if (this.nav.scrollLeft > 400) {
        this.noLeft = false
        this.noRight = true
      }
      if (this.nav.scrollLeft < 400 && this.nav.scrollLeft > 0) {
        this.noLeft = false
        this.noRight = false
      }
    },
    handleLeftClickRightDown(item) {
      if (!this.nav) this.nav = document.getElementById("x-roll")
      let that = this
      this.setTimeName = setInterval(() => {
        that.nav.scrollLeft = that.nav.scrollLeft + 5
      }, 15)
    },
    handleLeftClickRightUp() {
      clearInterval(this.setTimeName)
      // console.log(this.nav.scrollLeft)
      if (this.nav.scrollLeft < 0 || this.nav.scrollLeft === 0) {
        this.noLeft = true
        this.noRight = false
      }
      if (this.nav.scrollLeft > 400) {
        this.noLeft = false
        this.noRight = true
      }
      if (this.nav.scrollLeft < 400 && this.nav.scrollLeft > 0) {
        this.noLeft = false
        this.noRight = false
      }
    },
    leftClick() {
    },
    rightClick() {
    },


    imgJt(data) {
      if (data == 'right') {
        this.nav.scrollLeft = this.nav.scrollLeft + 20;
      } else {
        this.nav.scrollLeft = this.nav.scrollLeft - 20;
      }

      if (this.nav.scrollLeft < 0 || this.nav.scrollLeft === 0) {
        this.noLeft = true
        this.noRight = false
      }
      if (this.nav.scrollLeft > 400) {
        this.noLeft = false
        this.noRight = true
      }
      if (this.nav.scrollLeft < 400 && this.nav.scrollLeft > 0) {
        this.noLeft = false
        this.noRight = false
      }

      // if (this.nav.scrollLeft > 0 ){
      //   this.noLeft = false
      //   this.noRight = true
      //   return;
      // }
      // this.nav.scrollLeft = 130 * this.navNumber;

      // if (data == 'right') {
      //
      //   if (this.navNumber == this.tableList.length - 1) {
      //     this.navNumber = 0
      //   } else {
      //     this.navNumber = this.navNumber + 1
      //   }
      //
      // } else {
      //
      //   if (this.navNumber == 0) {
      //     this.navNumber = this.tableList.length - 1
      //   } else {
      //     this.navNumber = this.navNumber - 1
      //   }
      //
      // }
      //
      // this.activeValueClick(this.tableList[this.navNumber])
      // this.nav.scrollLeft = 130 * this.navNumber;

    },
    handleMouseOver2() {
      this.stopXunhuan = true
    },
    handleMouseOut2() {
      this.stopXunhuan = false
    },

    handler(event) {
      // 获取滚动方向
      const detail = event.wheelDelta || event.detail;
      // 定义滚动方向，其实也可以在赋值的时候写
      const moveForwardStep = 1;
      const moveBackStep = -1;
      // 定义滚动距离
      let step = 0;
      // 判断滚动方向,这里的100可以改，代表滚动幅度，也就是说滚动幅度是自定义的
      if (detail < 0) {
        step = moveForwardStep * 100;
      } else {
        step = moveBackStep * 100;
      }
      // 对需要滚动的元素进行滚动操作
      this.nav.scrollLeft += step;


      if (this.nav.scrollLeft < 0 || this.nav.scrollLeft === 0) {
        this.noLeft = true
        this.noRight = false
      }
      if (this.nav.scrollLeft > 400) {
        this.noLeft = false
        this.noRight = true
      }
      if (this.nav.scrollLeft < 400 && this.nav.scrollLeft > 0) {
        this.noLeft = false
        this.noRight = false
      }

    },
    handleMouseOver() {
      // 添加横向滚轮
      if (!this.nav) this.nav = document.getElementById("x-roll")
      // 添加滚轮滚动监听事件，一般是用下面的方法
      if (this.nav) {
        this.nav.addEventListener('mousewheel', this.handler, false)
      }
      // 滚动事件的出来函数

    },
    handleMouseOut() {
      if (this.nav) this.nav.removeEventListener('mousewheel', this.handler, false)
    },

    activeValueClick(item) {
      if (this.activeValue === item.label) return


      this.activeValue = item.label
      if (!item.items) item.items = []
      const list = item.items.map(item => {
        // console.log(item.itemValue, '111')
        const num = item.itemValue ? item.itemValue : 0
        item.value = num - 0
        return item
      })
      var result = []
      for (var i = 0; i < list.length; i += 8) {
        result.push(list.slice(i, i + 8))
      }

      // console.log(result, 'result')
      this.carouselList = result


    },

    setProcessOptions(value, total, unit) {
      // console.log(value, total)
      const options = deepClone(getProcessOptions)
      options.angleAxis.max = total
      let a = total + unit
      options.title[0].text = a
      if (a.length > 3) {

        options.title[0].top = '38%'
        options.title[0].textStyle = {
          color: '#000',
          fontSize: 10,
          fontWeight: '500'
        }
      }

      options.series[0].data[0] = value

      if (total !== value) {
        options.title[0].textStyle.color = '#FFF'
        options.graphic = []
      }
      return options
    },


  },
  beforeDestroy() {
    if (this.setIntervalId) clearTimeout(this.setIntervalId)
  }
}
</script>

<style lang="scss" scoped>

.bottom-middle-mo {
  position: absolute;
  bottom: -2px;
  //height: 350px;
  width: calc(100% - 880px);
  //height: calc(100% - 89px) !important;
  height: 100%;

  background: url('~@/assets/agriculture/jvxingkuang_2x1(1).png') top center no-repeat;
  background-size: 100% 100%;

  .bo-top-con {
    width: 500px;
    margin: 0 auto;
  }

  .middle-top {
    margin: 0 13px;

    .fir-mo {
      display: flex;

      .fir-left {
        width: 229px;
        height: 171px;
        background: rgba(13, 33, 67, 0.5);
        border: 1px solid #1afcff;
        text-align: center;
      }

      .lf-items-text {
        font-family: Source Han Sans CN;
        font-weight: 500;
        font-size: 24px;
        color: #d3e2f5;
        background: linear-gradient(0deg, #1573ff 0%, #1afcff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .lf-items {
        font-family: DINPro;
        font-weight: 500;
        font-size: 24px;
        color: #5782b8;
        margin-bottom: 20px;
        margin-top: 43px;
      }

      .lf-items-nu {
        font-family: DINPro;
        font-weight: bold;
        font-size: 48px;
        color: #d3e2f5;
        background: linear-gradient(0deg, #1573ff 0%, #1afcff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .fir-right {
        flex: 1;
        padding: 0 40px;
      }
    }
  }

  .prcess-con {
    //width: 100%;
    //width: calc(100% - 72px);

    width: 860px;
    margin: 0 auto;
    height: 100px;
    margin-top: -40px;
    position: relative;
    top: 10px;
  }

  .se-con {
    //margin: 0 34px;
    margin-top: -18px;
    width: 100%;
    overflow: hidden;
    position: relative;
    z-index: 10;
    //top: -20px;
    height: 220px;

    .se-con-btns {
      display: flex;
    }

    .se-lef {
      display: flex;
      margin-bottom: 13px;

      > img {
        height: 35px;
        width: 34px;
      }

      .hidden-img {
        visibility: hidden;
      }

      .se-lef-name {
        height: 39px;
        background: url('~@/assets/agriculture/back@2x.png') top center no-repeat;
        background-size: 100% 100%;
        font-family: Source Han Sans CN;
        font-weight: bold;
        font-size: 14px;
        color: #eef3ff;
        padding-left: 26px;
        line-height: 14px;
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        //width: 130px;
        flex: 1;

        cursor: pointer;
      }

      .se-lef-name-hi {
        height: 39px;
        background: url('~@/assets/agriculture/zu_3204@2x4.png') top center no-repeat;
        background-size: 100% 100%;
        font-family: Source Han Sans CN;
        font-weight: bold;
        font-size: 14px;
        color: #eef3ff;
        padding-left: 26px;
        line-height: 14px;
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex: 1;

        cursor: pointer;
      }
    }

    .ri-pie {
      flex: auto;
      display: flex;
      flex-wrap: wrap;

      .ri-pie-con {
        width: calc(12%);

        .ri-pie-item {
          width: 80px;
          height: 80px;
        }

        .ri-name {
          color: #fff;
          line-height: 24px;
          font-size: 14px;
          text-align: center;
        }
      }
    }
  }

  ::v-deep {

    .el-carousel__indicators--horizontal {
      position: absolute !important;
      bottom: 0px !important;
    }

    .el-carousel__indicator.is-active .el-carousel__button {
      height: 5px;
      background-color: rgba(10, 158, 243, 1);
    }

    .el-carousel__button {
      height: 5px;
      background-color: rgba(10, 158, 243, 0.2);
    }

    .el-carousel__arrow--right {
      display: none;
    }

    .el-carousel__arrow--left {
      display: none;
    }
  }
}

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
  top: -8px;

  span {
    font-family: Source Han Sans CN;
    font-weight: 800;
    font-size: 18px;
    color: #ffffff;
  }
}

.imgJt {
  width: 30px;
  position: relative;
  //left: -30px;
  top: -4px;
  cursor: pointer;
  margin: 5px;
}
</style>
<style lang="scss" scoped>
.progressA {
  color: #FFF;
  display: flex;
  align-items: center;
}

.sjzjdDiv {
  font-size: 16px;
  width: 125px;
  text-align: right;
  margin: 20px;
}

.contA {
  width: 815px;
  height: 40px;
  border: rgba(25, 189, 250, 0.3) 0.1px solid;
  padding: 10px 10px;
  padding-right: 100px;
}

.pA {
  height: 100%;
  background: linear-gradient(90deg, rgba(54, 164, 255, 0.1) 0%, #36A4FF 100%);
  position: relative;
}

.sA {
  width: 710px;
  height: 100%;
  display: flex;
}

.spanA {
  width: 4px;
  height: 100%;
  background: #091e3a;
  margin-left: calc(6.25% - 4px);
  //position: relative;
  //right: -2px;
}

.prcess-conA {
  height: 55px;
  position: relative;
  top: -30px;
}

</style>
