const getters = {
  token: state => state.user.token,
  userId: state => state.user.userId,
  userName: state => state.user.userName,
  avatar: state => state.user.avatar,
  userProfile: state => state.user.profile,
  routes: state => state.route.routes,
  menuList: state => state.route.menuList,
  systemConfiglist: state => state.user.systemConfiglist,
  routesLoaded: state => state.route.routesLoaded,
  powerRoutes: state => state.route.powerRoutes,
  isRightDetail: state => state.grid.isRightDetail,
  lastTableTag: state => state.grid.lastTableTag || {},
  oneToNdicts: state => state.grid.oneToNdictDatas || [],
  orgRoleList: state => state.user.orgRoleList,
  selectedOrgRole: state => state.user.selectedOrgRole,
  currentGrid: state => state.grid.currentGrid,
  theme: state => state.governPicture.theme,
  orgRange: state => state.patrol.orgRange,
  getDictsByType: (state) => (type) => {
    return state.grid.eventDict.filter(item => item.dictType === type)
  }, // 废弃
  showAI: state => state.governPicture.aiDisplayConfig.dictDesc === '1',
  bsDicts: state => state.user.bsDicts,
  getBsDictsByType: (state, getters) => (dictType) => {
    const matchNode = getters.bsDicts.filter(item => item.dictType === dictType)
    if (!matchNode.length) return []
    return matchNode
  }
}
export default getters
