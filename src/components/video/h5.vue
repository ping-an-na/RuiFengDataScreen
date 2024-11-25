<!--
 * @description m3u8 播放器, 支持 h265 编码格式
 * @date 2022-05-12
 * @author lism
-->
<template>
  <div :id="playId" class="play_window"></div>
</template>
<script>
/* eslint-disable */
import {errorMap} from './h5playerError' 
export default {
  name: 'VideoPlayer',
  props: {
    playId: {
      type: String,
      default: 'play_window'
    },
    // 播放器宽度
    iWidth: {
      type: Number,
      default: 600
    },
    // 播放器高度
    iHeight: {
      type: Number,
      default: 400
    },
    src: {
      type: String,
      default: 'ws://10.11.42.243:559/openUrl/TxstmBW'
    }
  },
  data() {
    return {
        videoInstance: null, // 播放器实例
        curIndex: 1, // 当前播放窗口
    };
  },
  watch: {
    src: {
      handler(val) {
        if (val) {
          this.realplay()
        }
      }
    }
  },
  mounted () {
    this.realplay()
  },
  beforeDestroy() {
    // 关闭流
    this.stopPlay()
  },
  methods: {
    init() {
      if (!this.videoInstance) {
        this.$nextTick(() => {
          this.videoInstance = new JSPlugin({
              szId: this.playId, //需要英文字母开头 必填
              szBasePath: './static', // 必填,引用H5player.min.js的js相对路径
              // iWidth: this.iWidth, // 容器给定宽高，视频自适应，可以不传宽高
              // iHeight: this.iHeight,
              // 分屏播放，默认最大分屏4*4
              iMaxSplit: 1,
              iCurrentSplit: 1,
              // 样式
              oStyle: {
                border: "#343434",
                borderSelect: "#FFCC00",
                background: "#000"
              }
            })
            // 设置取流连接超时时间，默认 6s 改为 15s
            this.videoInstance.JS_SetConnectTimeOut(this.curIndex, 15)
        })
      }
    },

    // 播放
    realplay() {
      let that = this
      this.$nextTick( async() => {
        if (!this.videoInstance) {
          await this.init()
        }
        try {
          this.videoInstance.JS_Play(this.src, {
            playURL: this.src,
            mode: 1, // 0 普通模式，1 高级模式，默认 0
          },this.curIndex).then(
            () => {console.log('play success')},
            e => { 
              console.log('e==', e, '::', errorMap.get(e));
              that.$message.warning(errorMap.get(e))
            }
          )
        } catch (e) {
          console.log('e==', e, '::', errorMap.get(e));
          that.$message.warning(errorMap.get(e))
        }
      })
    },
    // 停止播放
    stopPlay() {
      return new Promise((resolve,reject) => {
        let that = this
        this.videoInstance && this.videoInstance.JS_Stop(this.curIndex).then(
          () => { 
            console.log('stop realplay success') 
            resolve()
          },
          e => { 
            console.log('e==', e, '::', errorMap.get(e));
            that.$message.warning(errorMap.get(e))
            reject()
          }
        )
      })
    },
  },
};
</script>
<style lang="scss" scoped>
.play_window {
  height: 100%;
  width: 100%;
}
</style>
