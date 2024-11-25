import path from 'path'
import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { setToken, getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'
import settings from './settings'
const qs = require('qs')
let firstLoad = true

function clearQueryCache(path) {
    // 清除缓存
    const cache = window.sessionStorage.getItem('queryCache')
    if (cache) {
        const obj = JSON.parse(cache)
        obj[path] = ''
        window.sessionStorage.setItem('queryCache', JSON.stringify(obj))
    }
}

// 先解析从其他平台跳转过来的 token
// function matchToken() {
//     const url = window.location.href
//     const params = qs.parse(url.split('?')[1])
//     if (params.token) {
//         setToken(params.token)
//         store.commit('user/SET_TOKEN', params.token)
//     }
//     if (params.appCode) {
//         store.commit('user/SET_APPCODE', params.appCode)
//     }
// }

// matchToken()

NProgress.configure({ showSpinner: false })

// const whiteList = ['/login']
// localStorage.setItem('token', '123')

router.beforeEach(async (to, from, next) => {
    NProgress.start()
    const hasToken = getToken()
    next()
    NProgress.done()
    // 刷新页面去除缓存
    if (from.path === '/') {
        clearQueryCache(to.path)
    }
})

router.afterEach((to, from) => {
    document.title = getPageTitle(to.meta.title)
    NProgress.done()
    if (!to.query || !to.query.cache) {
        clearQueryCache(from.path)
    }
    if (!(from.path && from.query.cache)) {
        clearQueryCache(to.path)
    }
})

function getDefaultOpenRoutePath(routePath, route) {
    routePath = path.resolve(routePath, route.path)
    if (route.children && route.children.length) {
        routePath = getDefaultOpenRoutePath(routePath, route.children[0])
    }
    return routePath
}
