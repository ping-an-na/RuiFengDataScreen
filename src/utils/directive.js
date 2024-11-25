import Vue from 'vue'
/**
 * 对 element-ui 的无限滚动在 el-table 上使用的封装
 */
import elInfiniteScroll from 'cestc-ioc-ui/lib/infinite-scroll'

const elScope = 'ElInfiniteScroll' // scope name
const msgTitle = `[el-table-infinite-scroll]: ` // message title
const elTableScrollWrapperClass = '.c-table__body-wrapper'
/**
	* 同步 el-infinite-scroll 的配置项
	* @param sourceVNode
	* @param sourceElem
	* @param targetElem
	*/
function asyncElOptions(sourceVNode, sourceElem, targetElem) {
  const context = sourceVNode.context
  let value;
  ['disabled', 'delay', 'immediate'].forEach((name) => {
    name = 'infinite-scroll-' + name
    value = sourceElem.getAttribute(name)
    if (value !== null) {
      targetElem.setAttribute(name, context[value] || value)
    }
  })

  // fix: windows/chrome 的 scrollTop + clientHeight 与 scrollHeight 不一致的 BUG
  const name = 'infinite-scroll-distance'
  value = sourceElem.getAttribute(name)
  value = context[value] || value
  targetElem.setAttribute(name, value < 1 ? 1 : value)
}
Vue.directive('tb-infinite-scroll', { // 指令名称为：img-error
  inserted(el, binding, vnode, oldVnode) {
    // 获取 table 中的滚动层
    const scrollElem = el.querySelector(elTableScrollWrapperClass)

    // 如果没找到元素，返回错误
    if (!scrollElem) {
      // eslint-disable-next-line no-throw-literal
      throw `${msgTitle}找不到 ${elTableScrollWrapperClass} 容器`
    }

    // 设置自动滚动
    scrollElem.style.overflowY = 'auto'

    // dom 渲染后
    setTimeout(() => {
      if (!el.style.height) {
        scrollElem.style.height = '400px'
        console.warn(
          `${msgTitle}请尽量设置 el-table 的高度，可以设置为 auto/100%（自适应高度），未设置会取 400px 的默认值（不然会导致一直加载）`
        )
      }

      asyncElOptions(vnode, el, scrollElem)

      // 绑定 infinite-scroll
      elInfiniteScroll.inserted(scrollElem, binding, vnode, oldVnode)

      // 将子集的引用放入 el 上，用于 unbind 中销毁事件
      el[elScope] = scrollElem[elScope]
    }, 0)
  },
  componentUpdated(el, binding, vnode) {
    asyncElOptions(vnode, el, el.querySelector(elTableScrollWrapperClass))
  },
  unbind: elInfiniteScroll.unbind
})

// 拖拽指令
Vue.directive('drag', function(el) {
  el.style.position = 'fixed'
  el.style.cursor = 'move'
  // 监听 当前绑定指令元素的鼠标点下去的事件
  el.onmousedown = function(e) {
    var disx = e.pageX - el.offsetLeft
    var disy = e.pageY - el.offsetTop

    if (e.preventDefault) {
      e.preventDefault()
    } else {
      e.returnValue = false // 解决快速频繁拖动滞后问题
    }

    document.onmousemove = function(e) {
    // 鼠标位置-鼠标相对元素位置=元素位置
      let left = e.clientX - disx
      let top = e.clientY - disy
      // 限制拖拽范围不超出可视区
      if (left <= 0) {
        left = 5 // 设置成5,离边缘不要太近
      } else if (left > document.documentElement.clientWidth - el.clientWidth) { // document.documentElement.clientWidth屏幕可视区宽度
        left = document.documentElement.clientWidth - el.clientWidth - 5
      }

      if (top <= 0) {
        top = 5
      } else if (top > document.documentElement.clientHeight - el.clientHeight) {
        top = document.documentElement.clientHeight - el.clientHeight - 5
      }
      el.style.left = left + 'px'
      el.style.top = top + 'px'
    }
    document.onmouseup = function() {
      document.onmousemove = document.onmouseup = null
    }
  }
})

