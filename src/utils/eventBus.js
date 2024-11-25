/**
 * 初始化全局 event bus
 */
import Vue from 'vue'

const eventBus = new Vue()
export const initEventBus = () => {
  Object.defineProperties(Vue.prototype, {
    $bus: {
      get: function() {
        return eventBus
      }
    }
  })
}
