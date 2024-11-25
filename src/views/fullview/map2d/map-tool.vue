<!--
@Author: lism
@Description:
@Date: 2024-
-->
<template>
    <ul class="map-tool" :style="showType===4?'top:160px':''">
        <!-- 定位到中心点 -->
        <div class="map-tool-con">
            <li class="map-tool-item center" @click="$emit('commond', 'center')" />
        </div>

        <div class="map-tool-con">
            <!-- 缩小 -->
            <li class="map-tool-item zoom-in" @click="$emit('commond', 'zoom-in')" />
            <div class="min-line"></div>
            <!-- 放大 -->
            <li class="map-tool-item pack-up"  @click="$emit('commond', 'zoom-out')" />
        </div>
        <div class="map-tool-con">
            <!-- 展开 -->
            <li  :class="isBig?'map-tool-item quanpingFangda':'map-tool-item quanpingSuoxiao'"  @click="handleFullscreen"/>
            <div class="min-line"></div>
            <!-- 收起 -->
            <li :class="infoUnfold?'map-tool-item unfold':'map-tool-item shouQi'" @click="$emit('commond', infoUnfold?'pack-up':'unfold')" />
        </div>
    </ul>
</template>

<script>
export default {
  props:['infoUnfold','showType'],
  data(){
    return{
      isBig:true,
    }
  },
  mounted() {
    // //各种适配的浏览器事件
    document.addEventListener('fullscreenchange', () => {
      let isFullscreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
      isFullscreen = !isFullscreen;
      this.isBig = isFullscreen
    });
    document.addEventListener('mozfullscreenchange', () => {
      let isFullscreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
      isFullscreen = !isFullscreen;
      this.isBig = isFullscreen
    });
    document.addEventListener('webkitfullscreenchange', () => {
      let isFullscreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
      isFullscreen = !isFullscreen;
      this.isBig = isFullscreen
    });
    document.addEventListener('msfullscreenchange', () => {
      let isFullscreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
      isFullscreen = !isFullscreen;
      this.isBig = isFullscreen
    });
  },
  methods:{
    handleFullscreen() {

      let main = document.body;
      if (!this.isBig) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        // this.isBig = true
      } else {
        if (main.requestFullscreen) {
          main.requestFullscreen();
        } else if (main.mozRequestFullScreen) {
          main.mozRequestFullScreen();
        } else if (main.webkitRequestFullScreen) {
          main.webkitRequestFullScreen();
        } else if (main.msRequestFullscreen) {
          main.msRequestFullscreen();
        }
      }
      this.isBig = !this.isBig
    },
  }
}
</script>

<style lang="scss" scoped>
.map-tool {
    position: absolute;
    left: 450px;
    top: 210px;
    //top:160px;
    .map-tool-con {
        background: #ffffff;
        border-radius: 2px;
    }
    .min-line {
        width: 80%;
        height: 2px;
        background-color: rgba(121, 126, 137, 0.2);
        margin-left: 10%;
    }
    .map-tool-item {
        background-repeat: no-repeat;
        background-size: 14px 14px;
        background-position: center;
        cursor: pointer;
        width: 32px;
        height: 32px;
        // background-color: rgba(#fff, 0.9);
        // border-radius: 2px;
        // box-shadow: 0px 3px 10px 0px rgba(121, 126, 137, 0.3);
        &.center {
            background-image: url(~@/assets/agriculture/position_@2x.png);
            margin-bottom: 8px;
        }
        &.zoom-in {
            background-image: url(~@/assets/agriculture/fangda_2.png);
        }
        &.zoom-out {
            background-image: url(~@/assets/agriculture/quanping@2x.png);
        }
        &.quanpingFangda{
          background-image: url(~@/views/fullview/map2d/img/big.png);
        }
        &.quanpingSuoxiao{
          background-image: url(~@/views/fullview/map2d/img/small.png);
        }
        &.shouQi{
          background-image: url(~@/views/fullview/map2d/img/shouqi.png);
        }
        &.pack-up {
            background-image: url(~@/assets/agriculture/suoxaio.png);
            margin-bottom: 8px;

        }
        &.unfold {
            background-image: url(~@/assets/agriculture/zhankai_2.png);
        }
    }
}
</style>
