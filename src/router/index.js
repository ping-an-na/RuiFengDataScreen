import Vue from 'vue'
import Router from 'vue-router'
import settings from '@/settings'
import store from '@/store'
import { getUrlSearch } from '@/utils/index'
import { platformRoutes } from './platformRoutes'
import Layout from '@/layout'

if (getUrlSearch('debug') || sessionStorage.getItem('debug')) {
    window.debug = true
    sessionStorage.setItem('debug', '1')
}

Vue.use(Router)

const constantRoutes = [
    
    {
        path: '/empty-role',
        component: () => import('@/components/page-wrapper/emptyRole'),
        hidden: true
    },

    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },
    // 县不做路由权限
    {
        path: '/panorama',
        component: Layout,
        defaultOpen: true,
        children: [
            {
                path: 'index',
                name: 'elementsMap',
                component: () => import('@/views/fullview'), // governPictureWeb
                meta: { title: '治理一张图', icon: '' },
                dependency: []
            }
        ]
    },
    {
        path: '/',
        component: Layout,
        hidden: true,
        children: [
            {
                // 默认页面, 无权限路由时展示
                path: '',
                name: 'default',
                component: () => import('@/views/default/index'),
                meta: { title: '无内容', icon: '' },
                redirect: '/panorama/index'
            }
        ]
    }
]

// 如果设置不使用框架的登录页，需要去除登录页面的路由
if (!settings.useOwnLogin) {
    constantRoutes.shift()
}

export { constantRoutes }

// 动态路由部分, 不随权限变动的页面添加到静态路由
export const dynamicRoutes = [...platformRoutes]
const createRouter = () =>
    new Router({
        // mode: 'history', // require service support
        scrollBehavior: () => ({ y: 0 }),
        routes: constantRoutes
    })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    store.commit('route/RESET_ROUTES')
    const newRouter = createRouter()
    router.matcher = newRouter.matcher
}

export default router
