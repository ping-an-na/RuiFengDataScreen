<template>
  <div class="middle-con-se">
    <div class="middle-fir">
      <div style="width: 500px;position: relative;left: 50%;transform: translateX(-50%);">
        <top-title-modle title="工程进度"/>
      </div>
      <div class="middle-top" style="position: relative;top: -45px;">
        <div class="fir-mo">
          <div class="fir-left">
            <div class="lf-items">
              <span class="lf-items-nu">{{ constructionDays }}</span>
              <span>{{ '/' + totalConstructionDay }}</span>
            </div>
            <div class="lf-items-text">施工天数</div>
          </div>
          <div class="fir-right">
            <step-se :sectionVO="sectionVO"/>
          </div>
        </div>
      </div>

      <div class="map-top-bottom" style=""></div>

      <div style="width: 100%;height: 100px;position: relative;top: -20px;">


        <!--        <div class="prcess-con">-->
        <!--          <div-->
        <!--              style="width: 850px;height: 50px;border: rgba(25, 189, 250,0.3) 0.1px solid;position: absolute;left: 90px;top: -10px;"></div>-->
        <!--          <div style="position: absolute;left: 0;top: 2px;color: #FFF">实际总进度</div>-->
        <!--          <bar-chart :chart-data="peoplerangeOption"/>-->
        <!--        </div>-->

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


      </div>


      <div class="se-con" style="position: relative;top: -85px;">
        <div style="height: 400px;display: flex;justify-content: center;align-items: center;flex-flow: column;">
          <img v-if="!noTop" src="~@/views/fullview/map2d/img/jt/6.png" class="imgJt" @click='leftClick'
               @mousedown.left="handleLeftClickLeftDown"
               @mouseup.left="handleLeftClickLeftUp"
               @mouseleave="handleLeftClickLeftUp"
          >
          <img v-else src="~@/views/fullview/map2d/img/jt/5.png" class="imgJt" @click='leftClick'
               @mousedown.left="handleLeftClickLeftDown"
               @mouseup.left="handleLeftClickLeftUp"
               @mouseleave="handleLeftClickLeftUp"
          >
          <!--imgJt('up')-->
          <div v-if="tableList.length > 0" style="height: 320px;overflow: auto;margin-right:20px;" id="y-roll"
               v-on:mouseover="handleMouseOver" v-on:mouseout="handleMouseOut">
            <div :style="'overflow-y: auto;height: ' + (tableList.length) * 53 + 'px;'">
              <div class="se-lef" v-for="(item, index) in tableList" :key="index">
                <img src="../../../../assets/agriculture/zu2807_2x.png"
                     :class="{ 'hidden-img': item.label !== activeValue }"/>
                <div @click="clickActiveValue(item)"
                     :class="item.label === activeValue ? 'se-lef-name' : 'se-lef-name-hi'">
                  {{ item.label }}
                </div>
              </div>
            </div>
          </div>
          <!--imgJt('down')-->
          <img v-if="!noDown" src="~@/views/fullview/map2d/img/jt/7.png" class="imgJt" @click="rightClick"
               @mousedown.left="handleLeftClickRightDown"
               @mouseup.left="handleLeftClickRightUp"
               @mouseleave="handleLeftClickRightUp"
          >
          <img v-else src="~@/views/fullview/map2d/img/jt/8.png" class="imgJt" @click="rightClick"
               @mousedown.left="handleLeftClickRightDown"
               @mouseup.left="handleLeftClickRightUp"
               @mouseleave="handleLeftClickRightUp"
          >

        </div>

        <div class="ri-pie" v-if="tableList.length > 0 && processDataList.length > 0">
          <div class="ri-pie-con" v-for="(item, index) in processDataList" :key="index">
            <div class="ri-pie-item">
              <!--              <pie-chart :chart-data="setProcessOptions(item.value,item.total)"/>-->
              <pie-chart :chart-data="setProcessOptions(item.value,item.total,item.unit)"/>
              <div class="ri-name">{{ item.itemName }}</div>
            </div>
          </div>
        </div>
        <div v-if="!(processDataList.length > 0)"
             style="display: flex;justify-content: center;align-items: center;flex-flow: column;width: 80%;">
          <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 300px;position: relative;top: 10px;"/>
          <div style="color: #FFF;position: relative;top: -70px;">暂无数据...</div>
        </div>
        <div v-if="!(tableList.length > 0)"
             style="display: flex;justify-content: center;align-items: center;flex-flow: column;width: 100%;">
          <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 300px;position: relative;top: 30px;"/>
          <div style="color: #FFF;position: relative;top: -70px;">暂无数据...</div>
        </div>


      </div>
    </div>

    <div class="mid-bottom">
      <div class="bo-left">
        <top-title-modle title="报账进度" top="-10px"/>
        <div class="n-bottom-ca">
          <div class="zjeTop">总金额</div>
          <div class="wyBot">万元</div>
          <pie-chart :chart-data="areaPieOption1" v-if="true"/>
          <div v-else style="display: flex;justify-content: center;align-items: center;flex-flow: column;">
            <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 300px;position: relative;top: 0px;"/>
            <div style="color: #FFF;position: relative;top: -100px;">暂无数据...</div>
          </div>

        </div>
      </div>
      <div class="bo-left">
        <top-title-modle title="拨付进度" top="-10px"/>
        <div class="n-bottom-ca">

          <div class="zjeTop">已报账金额</div>
          <div class="wyBot">万元</div>

          <pie-chart :chart-data="areaPieOption2" v-if="true"/>
          <div v-else style="display: flex;justify-content: center;align-items: center;flex-flow: column;">
            <img src="@/views/fullview/map2d/img/bgNone.png" style="width: 300px;position: relative;top: 0px;"/>
            <div style="color: #FFF;position: relative;top: -100px;">暂无数据...</div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import stepSe from './stepSe.vue'
import {
  usepeoplerangeEchartsOption,
  pieChartProcess,
  getProcessOptions,
  barProjectOptionsSe2,
  setBarProjectOptionsSe2,
  setBarProjectOptionsSe2New,
  sjzjdEcharts,
  jhzjdEcharts
} from '../newEchartsOptions'
import pieChart from '@/components/echarts/pieChart'
import barChart from '@/components/echarts/barChart'
import {deepClone} from '@/utils'


function extractNumbers(str) {
  return str.match(/\d+/g);
}

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

const processDataList = []

export default {
  components: {
    stepSe,
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
      setTimeName: null,
      overallProgress: '0%',
      financialProgress: [],
      peoplerangeOption: {},
      totalConstructionDay: 0,
      constructionDays: 0,
      areaPieOption: {},
      typeList: typeList,
      tableList: [],
      activeValue: '',
      processDataList,
      areaPieOption1: {},
      areaPieOption2: {},
      sectionVO: {},
      jhzjdEcharts,
      sjzjdEcharts,
      nav: null,
      navNumber: 0,
      noTop: true,
      noDown: false,

    }
  },
  watch: {
    dataInfos: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {

          let {overallProgress = 0, constructionProgress = [], financialProgress = {}, sectionVO = {}} = val

          this.totalConstructionDay = val.totalConstructionDay
          this.constructionDays = val.constructionDays

          this.sectionVO = sectionVO;
          constructionProgress = JSON.parse(JSON.stringify(constructionProgress))

          usepeoplerangeEchartsOption.series[0].data = [overallProgress] //
          usepeoplerangeEchartsOption.series[2].data = [overallProgress] //
          this.overallProgress = overallProgress + '%'
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
          this.clickActiveValue(constructionProgressAll)

          this.setOptions1(financialProgress)
          this.setOptions2(financialProgress)

          // console.log(dds[0].items, 'dds[0].items')
          // const list = dds[0].items.map(item => {
          //   if (item.itemValue) item.itemValue = item.itemValue + ''
          //   const num = item.itemValue ? item.itemValue : 0
          //   item.value = num - 0
          //   return item
          // })
          // var result = []
          // for (var i = 0; i < list.length; i += 8) {
          //   result.push(list.slice(i, i + 8))
          // }
          // this.processDataList = result
          // this.activeValue = dds[0].label || ''
        }
      }
    }
  },
  mounted() {

    // 测试
    // this.setOptions1({})
    // this.setOptions2({})
  },
  methods: {
    handleLeftClickLeftDown(item) {
      if (!this.nav) this.nav = document.getElementById("y-roll")
      let that = this
      this.setTimeName = setInterval(() => {
        that.nav.scrollTop = that.nav.scrollTop - 2
      }, 15)
    },
    handleLeftClickLeftUp() {
      clearInterval(this.setTimeName)
      if (this.nav.scrollTop < 0 || this.nav.scrollTop === 0) {
        this.noTop = true
        this.noDown = false
      }
      if (this.nav.scrollTop > 200) {
        this.noTop = false
        this.noDown = true
      }
      if (this.nav.scrollTop < 200 && this.nav.scrollTop > 0) {
        this.noTop = false
        this.noDown = false
      }
    },
    handleLeftClickRightDown(item) {
      if (!this.nav) this.nav = document.getElementById("y-roll")
      let that = this
      // console.log(that.nav.scrollTop)
      this.setTimeName = setInterval(() => {
        that.nav.scrollTop = that.nav.scrollTop + 2
      }, 15)
    },
    handleLeftClickRightUp() {
      clearInterval(this.setTimeName)
      if (this.nav.scrollTop < 0 || this.nav.scrollTop === 0) {
        this.noTop = true
        this.noDown = false
      }
      if (this.nav.scrollTop > 200) {
        this.noTop = false
        this.noDown = true
      }
      if (this.nav.scrollTop < 200 && this.nav.scrollTop > 0) {
        this.noTop = false
        this.noDown = false
      }
    },
    leftClick() {
    },
    rightClick() {
    },

    imgJt(data) {
      if (!this.nav) this.nav = document.getElementById("y-roll")


      if (data == 'down') {
        this.nav.scrollTop = this.nav.scrollTop + 20;
      }
      if (data == 'up') {
        this.nav.scrollTop = this.nav.scrollTop - 20;
      }


      if (this.nav.scrollTop < 0 || this.nav.scrollTop === 0) {
        this.noTop = true
        this.noDown = false
      }
      if (this.nav.scrollTop > 200) {
        this.noTop = false
        this.noDown = true
      }
      if (this.nav.scrollTop < 200 && this.nav.scrollTop > 0) {
        this.noTop = false
        this.noDown = false
      }


      // if (data == 'down') {
      //   if (this.navNumber == this.tableList.length - 1) {
      //     this.navNumber = 0
      //   } else {
      //     this.navNumber = this.navNumber + 1
      //   }
      // }
      // if (data == 'up') {
      //   if (this.navNumber == 0) {
      //     this.navNumber = this.tableList.length - 1
      //   } else {
      //     this.navNumber = this.navNumber - 1
      //   }
      // }
      // this.clickActiveValue(this.tableList[this.navNumber])
      // this.nav.scrollTop = 53 * this.navNumber;
    },

    handleMouseOver() {
      // 添加横向滚轮
      if (!this.nav) this.nav = document.getElementById("y-roll")
      // 添加滚轮滚动监听事件，一般是用下面的方法
      if (this.nav) {
        this.nav.addEventListener('mousewheel', this.handler, false)
      }
    },
    handleMouseOut() {
      if (this.nav) this.nav.removeEventListener('mousewheel', this.handler, false)
    },
    handler(event) {


      console.log(this.nav.scrollTop, 'this.nav.scrollTop')
      if (this.nav.scrollTop < 0 || this.nav.scrollTop === 0) {
        this.noTop = true
        this.noDown = false
      }
      if (this.nav.scrollTop > 200 || this.nav.scrollTop === 200) {
        this.noTop = false
        this.noDown = true
      }
      if (this.nav.scrollTop < 200 && this.nav.scrollTop > 0) {
        this.noTop = false
        this.noDown = false
      }
    },

    clickActiveValue(item) {

      this.activeValue = item.label
      if (!item.items) item.items = []
      const list = item.items.map(item => {
        const num = item.itemValue ? item.itemValue : 0
        item.value = Number(num)
        return item
      })
      this.processDataList = list
    },

    setProcessOptions(value, total, unit) {
      // console.log(value, total)
      const options = deepClone(getProcessOptions)

      options.graphic[0].style.width = 73.5
      options.graphic[0].style.height = 73.5
      options.title[0].top = 50


      options.angleAxis.max = total
      let a = total + unit
      options.title[0].text = a
      if (a.length > 3) {

        options.title[0].top = 50
        options.title[0].textStyle = {
          color: '#000',
          fontSize: 12,
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


    setOptions1(obj) {
      var data = [

        {
          name: '已报账金额',
          value: obj?.submitMoney || 0
        },
        {
          name: '未报账金额',
          value: obj?.noSubmitMoney || 0
        },

      ]
      const options = this.setOpt(data)
      this.areaPieOption1 = options
    },
    setOptions2(obj) {
      var data = [
        {
          name: '已拨付金额',
          value: obj.appropriate || 0
        },
        {
          name: '未拨付金额',
          value: obj.noAppropriate || 0
        },
      ]
      const options = this.setOpt(data)
      this.areaPieOption2 = options

      // console.log(this.areaPieOption2, 'this.areaPieOption2')

    },
    setOpt(data) {
      let sum = 0
      const optionData = []
      data.forEach(item => {
        sum += Number(item.value)
      })
      data.forEach(item => {
        optionData.push({
          value: item.value,
          value1: item.value,
          name: item.name,
          labelLine: {
            normal: {
              length: 15
            }
          },
          label: {
            normal: {
              formatter: params => {
                return '{value|' + params.value + '}' + '{value1|万元}'
              },
              // padding: [0, -100, 25, -100],
              rich: {
                value: {
                  fontSize: 10,
                  fontWeight: 'bold',
                  color: '#fff'
                },
                value1: {
                  fontSize: 10,
                  fontWeight: 'bold',
                  color: '#fff'
                }
              }
            }
          }
        })
        if (sum) {
          optionData.push({
            value: sum / 100, // 控制每个环形之间的间隙
            name: '',
            itemStyle: {
              label: {
                show: false
              },
              labelLine: {
                show: false
              },
              color: 'rgba(0, 0, 0, 0)',
              borderColor: 'rgba(0, 0, 0, 0)',
              borderWidth: 0
            }
          })
        }


        // 配置一个空值
      })
      // console.log(optionData, 'optionData')

      const options = setBarProjectOptionsSe2New(sum, data, optionData, {
        width: 95,
        height: 95
      })

      return options
    }
  }
}
</script>

<style lang="scss" scoped>
.middle-con-se {
  width: calc(100% - 877px);
  height: calc(100% - 66px);
  position: absolute;
  padding: 0 10px;
  left: 438px;
  top: 68px;
  padding-bottom: 79px;
  //background: #020c2c;
  //opacity: 0.90;
}

.middle-fir {
  width: 100%;
  height: calc(100% - 240px);
  margin-bottom: 10px;
  // position: absolute;
  // left: 450px;
  // top: 66px;
  background: url('~@/assets/agriculture/jvxingkuang_2x1(1).png') top center no-repeat;
  background-size: 100% 100%;
  padding-top: 20px;

  .map-top-bottom {
    width: calc(100% - 72px);
    margin: 0 auto;
    height: 1px;
    background: #93a5bd;
    opacity: 0.4;
    margin-bottom: 11px;

    position: relative;
    top: -25px;
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
        padding: 0 20px;
      }
    }
  }


  .se-con {
    display: flex;

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
        width: 200px;
        background: url('~@/assets/agriculture/back@2x.png') top center no-repeat;
        background-size: 100% 100%;
        font-family: Source Han Sans CN;
        font-weight: bold;
        font-size: 14px;
        color: #eef3ff;
        // background: linear-gradient(0deg, #8fb9f7 0%, rgba(255, 255, 255, 0.87) 100%);
        // -webkit-background-clip: text;
        // -webkit-text-fill-color: transparent;
        padding-left: 26px;

        line-height: 14px;
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;

      }

      .se-lef-name-hi {
        width: 200px;
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
      }
    }

    /* 整个滚动条 */
    .ri-pie::-webkit-scrollbar {
      width: 6px; /* 滚动条的宽度 */
      height: 6px; /* 滚动条的高度，对水平滚动条有效 */
      border-radius: 6px;
      background: #1b2843; /* 背景颜色 */
    }

    /* 滚动条轨道 */
    .ri-pie::-webkit-scrollbar-track {
      border-radius: 6px;
      background: #1b2843; /* 轨道的背景颜色 */
    }

    /* 滚动条滑块 */
    .ri-pie::-webkit-scrollbar-thumb {
      border-radius: 6px;
      //background-color: #c1c1c1; /* 滑块的背景颜色 */
      border: 0px solid rgba(0, 0, 0, 0); /* 滑块的边框和轨道相同的颜色，可以制造“边距”的效果 */
      background: linear-gradient(0deg, #015fea, #00bdf9);

    }

    ///* 滚动条滑块：悬停效果 */
    //.ri-pie::-webkit-scrollbar-thumb:hover {
    //  background-color: #a8a8a8; /* 滑块的悬停颜色 */
    //}
    //
    ///* 滚动条滑块：激活时的效果 */
    //.ri-pie::-webkit-scrollbar-thumb:active {
    //  background-color: #888888; /* 滑块的激活颜色 */
    //}

    /* 滚动条按钮（上下箭头） */
    .ri-pie::-webkit-scrollbar-button {
      display: none; /* 通常情况下不显示滚动条按钮 */
    }


    .ri-pie {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      overflow: auto;

      position: relative;
      left: -12px;
      top: 30px;
      height: 350px;


      .ri-pie-con {
        width: calc(25% - 9px);
        height: 202px;
        display: flex;
        justify-content: center;

        .ri-pie-item {
          width: 120px;
          height: 120px;
        }

        .ri-name {
          color: #fff;
          line-height: 24px;
          font-size: 14px;
          text-align: center;
          width: 200%;
          transform: translateX(-25%);
        }
      }
    }
  }
}

.mid-bottom {
  display: flex;
  justify-content: space-between;

  .bo-left {
    width: calc(50% - 6px);
    height: 298px;
    background: url('~@/assets/agriculture/jvxingkuang_2x1(1).png') top center no-repeat;
    background-size: 100% 100%;
  }

  .n-bottom-ca {
    margin-top: -20px;
    width: 100%;
    height: 250px;
    transform: scale(1.10);
    position: relative;
    //left: -70px;
    top: -20px;
  }
}

.imgJt {
  width: 30px;
  position: relative;
  left: -60px;
  cursor: pointer;
  margin: 5px;
}

.zjeTop {
  z-index: 10;
  position: absolute;
  top: 97px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8)
}

.wyBot {
  z-index: 10;
  position: absolute;
  top: 140px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7)
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
  width: 100px;
  text-align: right;
  margin: 20px;
}

.contA {
  width: 840px;
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
  width: 740px;
  height: 100%;
  display: flex;
}

.spanA {
  width: 4px;
  height: 100%;
  background: #091e3a;
  margin-left: calc(6.25% - 4px);
  position: relative;
  right: -2px;
}

.prcess-conA {
  height: 55px;
  position: relative;
  top: -10px;
}

</style>
