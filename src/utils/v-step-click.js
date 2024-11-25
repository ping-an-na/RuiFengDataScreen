/**
 * @Description: 按钮的自定义指令  防抖和处理异步请求
 * 1，你可以给指令传一个指定防抖时间的参数 该参数需是大于0的正整数
 * 2，通过修饰符（async）指定响应函数是否是异步的 设定为异步，处理函数需要返回一个 Promise 当异步完成才响应下次点击逻辑
 * 3, 使用例子: v-step-click:2000.async="handleFn"（2000为防抖时间，async为指定为异步，handleFn为处理函数）
 * 4, 支持stop，prevent，capture 修饰符
 * 5, 支持指令配置为对象方式 v-step-click:2000.async="{operate: handleFn, params: ['name', 100]}"
 *    operate: 执行函数  params  函数的参数  该方式主要是应对 @click="handleFn('name', 100)"
 * @Author: zhangsen
 * @Date: 2020-11-20
 */
import { isArray, isFunction, isObject } from '@/utils/type-judgment.js'
export default function(Vue) {
  Vue.directive('step-click', {
    bind: mountFn,
    componentUpdated: mountFn,
    unbind: destroyFn
  })

  function destroyFn(el) {
    if (el.fn) {
      el.timer && clearTimeout(el.timer)
      el.removeEventListener('click', el.fn, el.capture)
    }
  }

  function mountFn(el, binding) {
    destroyFn(el)
    // 设定了定时时间
    const timerNum = /^\d+$/.test(binding.arg) ? parseInt(binding.arg, 10) : 200
    // 是否设定了异步
    const isAsync = binding.modifiers && binding.modifiers.async
    const stop = binding.modifiers && binding.modifiers.stop
    const prevent = binding.modifiers && binding.modifiers.prevent
    el.capture = binding.modifiers && binding.modifiers.capture

    el.isSending = false
    el.timer = null
    el.fn = function(event) {
      stop && event.stopPropagation()
      prevent && event.preventDefault()
      if (el.timer) return
      el.timer = setTimeout(() => {
        el.timer = null
      }, timerNum)
      el.fun = null
      el.params = []
      if (isFunction(binding.value)) {
        el.fun = binding.value
      } else if (isObject(binding.value)) {
        // 是对象类型的
        el.fun = binding.value.operate || function() {}
        el.params = isArray(binding.value.params) ? binding.value.params : []
      } else {
        console.warn('没有指定可执行函数')
        return
      }
      // 把原生点击事件暴露
      el.params.push(event)

      // 执行点击事件
      if (isAsync) {
        // 异步
        if (el.isSending) return
        el.isSending = true
        try {
          el.fun(...el.params).then(() => {
            el.isSending = false
          }).catch(() => {
            el.isSending = false
          })
        } catch (error) {
          console.warn('异步函数执行错误:', error)
          el.isSending = false
        }
      } else {
        el.fun(...el.params)
      }
    }
    el.addEventListener('click', el.fn, el.capture)
  }
}
