/**
 * @description 全屏js
 * @date 2020-01-08
 * @author mayijun
 */
export default {
  launchFullScreen(element) {
    element = element || document.documentElement
    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen()
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen()
    } else if (element.msRequestFullscreen) {
      // console.log("全屏展示dom",element)
      element.msRequestFullscreen()
    }
  },
  fullScreenCancel() {
    // 目前该方法可以兼容ie11效果
    const de = window.parent.document
    if (de.exitFullscreen) {
      de.exitFullscreen()
    } else if (de.mozCancelFullScreen) {
      de.mozCancelFullScreen()
    } else if (de.webkitCancelFullScreen) {
      de.webkitCancelFullScreen()
    } else if (de.msExitFullscreen) {
      de.msExitFullscreen()
    }
  },
  // 判断是否全屏状态
  isFullScreen() {
    return document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen
  }

}
