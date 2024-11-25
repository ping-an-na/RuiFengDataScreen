<!--
 * @description m3u8 播放器, video 播放器
 * @date 2022-05-12
 * @author lism
-->
<template>
  <video-player
    ref="videoPlayer"
    class="video-player vjs-custom-skin"
    :playsinline="playsinline"
    :options="playerOptions"
    @play="onPlayerPlay($event)"
    @pause="onPlayerPause($event)"
    @ended="onPlayerEnded($event)"
    @waiting="onPlayerWaiting($event)"
    @playing="onPlayerPlaying($event)"
    @loadeddata="onPlayerLoadeddata($event)"
    @timeupdate="onPlayerTimeupdate($event)"
    @canplay="onPlayerCanplay($event)"
    @canplaythrough="onPlayerCanplaythrough($event)"
    @statechanged="playerStateChanged($event)"
    @ready="playerReadied"
    @fullscreenchange="fullscreenchange"
  />
</template>
<script>
/* eslint-disable */
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css';
import 'videojs-contrib-hls' // 直播推流
import { videoPlayer } from 'vue-video-player'


export default {
  name: 'VideoPlayer',
  components: {
    videoPlayer
  },
  props: {
    selfOptions: Object,
    // 播放速度
    playbackRates: {
      type: Array,
      default: () => [0.7, 1.0, 1.5, 2.0]
    },
    // 封面
    poster: {
      type: String,
      default: ''
    },
    // 数据源
    sources: {
      type: Array,
      default: () => []
    },
    // 视频无法播放时提示信息
    notSupportedMessage: {
      type: String,
      default: '此视频暂无法播放，请稍后再试!!!'
    },
    // 视频显示比例
    aspectRatio: {
      type: String,
      default: '16:9'
    },
    // 设置controBar 
    controlBar: {
      type: Object,
      default: ()=> ({
        timeDivider: true, // 当前时间和持续时间的分隔符
        durationDisplay: true, // 时长显示
        remainingTimeDisplay: true, // 剩下时间
        currentTimeDisplay: true, // 当前时间
        volumeControl: true, // 声音控制键
        playToggle: true, // 暂停和播放键
        progressControl: true, // 进度条
        fullscreenToggle: true // 全屏按钮
      })
    },
    // 是否循环播放
    loop: Boolean,
    // 是否在不全屏状态下外放声音
    muted: Boolean,
    // 是否浏览器 准备好后自动播放
    autoplay: Boolean,
    // 是否直播
    isLive: Boolean,
  },
  data() {
    return {
       // 记录当前播放时间
      nowPlayer: null,
      options: {
        language:'zh',
        autoplay: this.autoplay, // 如果true,浏览器准备好时开始回放。
        playbackRates: this.playbackRates, // 播放速度
        muted: this.muted, // 默认情况下将会消除任何音频。--- 不全屏播放的时候是否禁止声音外放
        loop: this.loop, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        aspectRatio: this.aspectRatio, // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: this.sources,
        poster: this.poster, // 你的封面地址
        notSupportedMessage: this.notSupportedMessage, // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: this.controlBar,
        hls: true
      }
    };
  },
  computed: {
    // true表示默认情况下应尝试内联播放-false表示我们应使用浏览器的默认播放模式
    playsinline(){
      var ua = navigator.userAgent.toLocaleLowerCase();
      if (ua.match(/tencenttraveler/) != null || ua.match(/qqbrowse/) != null) {
          return true
      }else{
          return true             
      }
    },
    // 当前播放对象实例
    videoObj() {
      return this.$refs.videoPlayer.player
    },
    playerOptions() {
      if(this.isLive) {
        return {
          autoplay: true, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: this.sources,
          notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        }
      } else {
        if(this.selfOptions) {
          Object.assign(this.options, this.selfOptions)
          return this.options
        }else {
          return this.options;
        }
      }
    }
  },
  methods: {
    // 播放回调
    onPlayerPlay(player) {
      // 从给定时刻进行播放
      if(this.nowPlayer) {
        player.currentTime(this.nowPlayer)
      }
    },
    // 暂停回调
    onPlayerPause(player) {
    },
    // 视频播完回调
    onPlayerEnded(player) {
      this.nowPlayer = null;
    },
    // DOM元素上的readyState更改导致播放停止
    onPlayerWaiting(player) {
    },
    // 已开始播放回调
    onPlayerPlaying(player) {
    },
    // 当播放器在当前播放位置下载数据时触发
    onPlayerLoadeddata(player) {  
      // 直播每次播放都会调用--录播只是刚开始调用一次 
    },
 
    // 当前播放位置发生变化时触发。
    onPlayerTimeupdate(player) {
      // 获取到当前的播放时间
      this.nowPlayer = player.currentTime();
    },
 
    // 媒体的readyState为HAVE_FUTURE_DATA或更高
    onPlayerCanplay(player) {
    },
 
    //媒体的readyState为HAVE_ENOUGH_DATA或更高。这意味着可以在不缓冲的情况下播放整个媒体文件。
    onPlayerCanplaythrough(player) {
    },
 
    // 播放状态改变回调
    playerStateChanged(playerCurrentState) {
    },
 
    // 将侦听器绑定到组件的就绪状态。与事件监听器的不同之处在于，如果ready事件已经发生，它将立即触发该函数。。
    playerReadied(player) {
    },
    fullscreenchange(){

    }
  },
};
</script>
<style lang="scss" scoped>
.video-player {
  ::v-deep {
    .video-js .vjs-control-bar {
      bottom: 2em;
    }
  }
}
</style>
