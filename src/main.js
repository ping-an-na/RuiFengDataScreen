import Vue from 'vue'
import '@/styles/index.scss'
import CestcIocUI from 'cestc-ioc-ui'
import App from '@/App'
require('./utils/directive')
import store from '@/store'
import router from '@/router'
import '@/icons'
// import '@/permission'
import preprocess from '@/config/preprocess'
import initStepClick from '@/utils/v-step-click'
import globalComponents from '@/components'
import { initEventBus } from '@/utils/eventBus'
import { message } from '@/resetMessage' // 引入重写的message
import * as filters from './utils/filters.utils'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' // 引入Element UI样式

// 数字跳动动画
import VueAnimateNumber from 'vue-animate-number'
Vue.use(VueAnimateNumber)
// 无限滚动
import scroll from 'vue-seamless-scroll'
Vue.use(scroll)
//lodash
import _ from 'lodash'


Vue.use(ElementUI)

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
initStepClick(Vue)
Vue.use(CestcIocUI)
Vue.use(globalComponents)
initEventBus()
Vue.prototype.$message = message

preprocess(
    new Vue({
        el: '#app',
        router,
        store,
        render: h => h(App)
    })
)
