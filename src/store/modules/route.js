import { constantRoutes, dynamicRoutes } from '@/router'
import rootStore from '@/store'
import Layout from '@/layout'
import { isExternal } from '@/utils/validate'
import ExternalPage from '@/views/external-page'

const state = {
  routes: constantRoutes,
  routesLoaded: false,
  menuList: [],
  powerRoutes: []
}
const mutations = {
  SET_ROUTES(state, routes) {
    state.routes = constantRoutes.concat(routes)
  },
  SET_POWER_ROUTES(state, dynamicRoutes) {
    const res = dynamicRoutes || []
    res.push({ path: '*', redirect: '/404', hidden: true }) // 404跳转路由必须放在最后一个
    state.powerRoutes = res
  },
  SET_ROUTESLOADED(state, status) {
    state.routesLoaded = status
  },
  RESET_ROUTES(state) {
    state.routes = constantRoutes
    state.routesLoaded = false
  },
  SET_MENU_LIST(state, val) {
    state.menuList = val
  }
}

const actions = {
  async getPowerRoutes({ commit }) {
    const powerList = rootStore?.state?.user?.powerList
    const powerRoutes = analysisPowerToRoutes(powerList)
    const menuList = analysisPowerToMenus(powerList)
    commit('SET_POWER_ROUTES', powerRoutes)
    commit('SET_ROUTES', powerRoutes)
    commit('SET_MENU_LIST', menuList)
    commit('SET_ROUTESLOADED', true)
    return powerRoutes
  }
}

/**
 * 解析权限列表为动态路由
 * @param {Array} powerList
 * @returns 动态生成的路由表
 */
function analysisPowerToRoutes(powerList) {
  const res = []

  function analysisHelper(powerList) {
    for (let i = 0; i < powerList.length; i++) {
      const power = powerList[i]
      if (!power.children || !power.children.length) {
        const external = isExternal(power.path)
        if (external && power.isFrame === 1) continue // 新标签打开的无需路由
        if (!power.path) continue // 未配置地址无法匹配路由
        if (external) {
          // 处理内嵌打开路由
          res.push({
            path: `/external-page${power.id}`,
            component: Layout,
            meta: { title: '', icon: power.icon },
            children: [{
              path: '',
              component: ExternalPage,
              meta: {
                title: power.name,
                icon: power.icon,
                externalPath: power.path
              }
            }]
          })
        } else {
          // 处理自有内容路由
          const paths = power.path.split('/')
          if (!paths.length === 3) {
            console.error('路由地址配置错误 -> ', power.path)
            continue
          }
          const firstLevel = `/${paths[1]}`
          const secondLevel = paths[2]
          dynamicRoutes.forEach(route => {
            if (route.path === firstLevel) {
              if (!route.children) return // 无子路由
              const matchedSecondLevel = route.children.find(item => item.path === secondLevel)
              if (!matchedSecondLevel) return // 未匹配到子路由
              const existRoute = res.find(item => item.path === firstLevel) // 查看一级路由是否已存在
              const target = existRoute || Object.assign({}, route, { children: [] })
              target.children.push(matchedSecondLevel)
              if (matchedSecondLevel.dependency && matchedSecondLevel.dependency.length) {
                // 存在依赖路由
                matchedSecondLevel.dependency.forEach(dep => {
                  if (dep.includes('/')) {
                    // 跨级路由依赖 (目前仅能处理跨级一级路由, 如果需要匹配跨级路由的子路由, 这里需要扩展)
                    if (res.find(item => item.path === dep)) return // 结果中已存在, 不需要往下处理
                    res.push(dynamicRoutes.find(item => item.path === dep))
                  } else {
                    if (target.children.find(child => child.path === dep)) return // 该依赖路由已经被添加
                    target.children.push(route.children.find(item => item.path === dep)) // 添加依赖
                  }
                })
              }!existRoute && res.push(target)
            }
          })
        }
      } else {
        analysisHelper(power.children)
      }
    }
  }
  analysisHelper(powerList)
  return res
}

/**
 * 解析权限列表为菜单渲染项
 * @param {Array} powerList
 * @returns 动态生成的菜单
 */
function analysisPowerToMenus(powerList) {
  const routes = powerList.map((power, index) => {
    if (!power.children || !power.children.length) {
      const external = isExternal(power.path)
      if (external && power.isFrame === 1) {
        // 新标签打开
        return {
          path: power.path,
          meta: {
            title: power.name,
            icon: power.icon
          }
        }
      } else {
        // 内嵌打开或者平台自有内容
        const path = external ? `/external-page${power.id}` : (power.path || `/external${power.id}`)
        return {
          path,
          meta: { title: '', icon: power.icon },
          children: [{
            path: '',
            meta: {
              title: power.name,
              icon: power.icon,
              externalPath: external ? power.path : ''
            }
          }]
        }
      }
    } else {
      return {
        path: power.path || `/external${index}`,
        name: power.name,
        meta: { title: power.name, icon: power.icon },
        alwaysShow: true,
        children: analysisPowerToMenus(power.children)
      }
    }
  })
  return routes
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
