window.GLOBAL_CONFIG = {
    defaultMapType: 3,
    // defaultMapType: 2,
    moreThanInitialZoomLevel_1: 1, //人房-大于初始化地图zoom几个层级，扩展到社区聚合
    moreThanInitialZoomLevel_2: 3, //人房-大于初始化地图zoom几个层级，直接上图
    crs: 'gcj02', //地图坐标系 用于事件坐标的取值
    erwei: {
        mapUrl: 'http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', //白色
        yingxiangUrl: '', //影像
        darkMapUrl: 'http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', //深色地图
        isSuperMap: false,
        maxBounds: [],
        center: [31.936032, 118.898894],
        zoom: 13,
        minZoom: 8,
        maxZoom: 18,
        isOnlineMap: true,
        Satellite: true, // 是否使用卫星地图
        onlineMapTypeWhite: [],
        onlineMapTypeYingxiang: ['GaoDe.Satellite.Map', 'GaoDe.Satellite.Annotion'],
        onlineMapTypeDark: ['GAODEDARK'],
        gaodeRenderIdx: 1, //防止一个页面多次渲染高德自定义深色地图
        gaodeKey: '7a3a1ea76fa0dcfa1c97ae205310a9ab', // key
        gaodeServerKey: 'edbad9d12174658cfd04886ab6d4060a',
        gaodeSecret: '8689af9a42a53081707a1c34aee24705', // 密钥
        gaodeDarkStyle: 'amap://styles/blue',
        city: ''
    },
    rzt: {
        meetingUrl: 'https://10.32.141.213:6443',
        server: 'https://10.32.141.213:6443',
        wsServer: 'wss://10.32.141.213:6443/wss/',
        sipServer: 'wss://10.32.141.213:7443',
        defaultPwd: '12aa34zz'
    },
    headBg: './static/img/head-bg@2x.png',
    clientId: 'shzl' // 用来跳转统一登陆标识
}

window.defaultTheme = 'dark-theme'

window.MARKER_LIMIT = 8000

window.gridmanOnlineInterval = 10 //秒
