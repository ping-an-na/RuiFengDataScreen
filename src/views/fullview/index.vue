<template>
  <div class="wrap">
    <div class="ScaleBox" ref="ScaleBox" :style="{ width: widthA + 'px', height: heightA + 'px' }">
      <div class="full-view-container">
        <transition name="c-collapse-transition">
          <index-2d :scaleA="scale"></index-2d>
        </transition>
        <!-- <realTime-communication></realTime-communication> -->
      </div>
    </div>
  </div>
</template>

<script>
import index2d from '@/views/fullview/map2d/index_2D.vue'
// import realTimeCommunication from '@/views/fullview/components/realTimeCommunication/index.vue'

export default {
  data() {
    return {
      widthA: 1920,
      heightA: 1080,
      scale: 1,
    }
  },
  mounted() {
    this.setScale();
    window.addEventListener('resize', this.setScale);
    // 监听 屏幕变化
  },
  components: {
    index2d
    // realTimeCommunication
  },
  methods: {
    setScale() {
      this.scale = this.getScale();
      window.scaleAChuandi = this.scale
      // window.localStorage.setItem("scale",ww < wh ? ww : wh)

      // console.log(this.scale, 'this.scalethis.scale')
      this.$refs.ScaleBox.style.setProperty('--scale', this.scale);

      // console.log('++++-===============++++++++')
      // console.log(this.$refs.ScaleBox.style)
      // console.log(document.getElementsByClassName('dialog__body'))
    },
    getScale() {
      const {widthA, heightA} = this;
      let ww = window.innerWidth / widthA;
      let wh = window.innerHeight / heightA;
      return ww < wh ? ww : wh;
    }
  }
}
</script>
<style lang="scss" scoped>

//.el-dialog__body {
//    width: 1200px;
//    //height: 600px;
//    position: fixed;
//    //left: -1130px;
//    //left: 50%;
//    //transform: translateX(-50%);
//    left: 0;
//    top: 0;
//    background: #051331;
//    border-radius: 10px;
//    z-index: 9999;
//}

.wrap {
  background: #051331;
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 998;
}

#ScaleBox {
  --scale: 1;
}

.ScaleBox {
  transform: scale(var(--scale)) translate(-50%, -50%);
  display: flex;
  height: 100%;
  flex-direction: column;
  transform-origin: 0 0;
  position: absolute;
  left: 50%;
  top: 50%;
  transition: 0.3s;
  z-index: 999;
}

//::v-deep {
//
//}


.full-view-container {
  height: 100%;
  overflow: hidden;
  background: #023743;

  .heat-color-bg {
    position: fixed;
    bottom: 24px;
    left: calc(50vw - 500px);
    width: 538px;
    height: 108px;
    background: linear-gradient(90deg, rgba(0, 88, 161, 0.56) 50%, rgba(41, 129, 196, 0.53) 5%);
    box-shadow: inset 0px 0px 10px 0px rgba(0, 162, 255, 0.19);
    border-radius: 12px;
    // border: 1px solid;
    border-image: linear-gradient(196deg, rgba(172, 219, 255, 0.7), rgba(228, 246, 255, 1), rgba(134, 202, 254, 1)) 1 1;
    padding: 16px 20px;

    .intensy {
      background: rgba(153, 214, 255, 0.04);
      width: 100%;
      margin-top: 20px;
    }

    .i-vals {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;

      .i-val {
        font-weight: 500;
        font-size: 14px;
      }
    }
  }
}
</style>

<style lang="scss">
//#ScaleBoxAA {
//  --scale: 1;
//}
//
//.el-dialog__body {
//  transform: scale(var(--scale)) !important;
//  //transform: scale(0.8) !important;
//}
</style>
