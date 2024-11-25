//二维地图包引入
import 'leaflet/dist/leaflet.css'
import 'leaflet'
import '@supermap/iclient-leaflet'
require('./leaflet-plugins/leaflet-geoman/js/L.PM.js')
import 'leaflet.markercluster/dist/leaflet.markercluster.js'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
require('./leaflet-plugins/pulse')
require('./leaflet-plugins/pulse.css')
require('./water.scss')
import 'leaflet.motion/dist/leaflet.motion.min.js'
require('./leaflet-plugins/customerLayer.js')
require('./leaflet-plugins/heatLayer')
require('./leaflet-plugins/chinaMap')
// require('./leaflet-plugins/mapCorrect')
require('./leaflet-plugins/polylineDecorator/L.PolylineDecorator.js')
require('./leaflet-plugins/animationMarker.js')
const WKT = require('terraformer-wkt-parser')
import * as turf from '@turf/turf'
import elementResizeDetectorMaker from 'element-resize-detector'

export default class TwoDimensionalMap {
    constructor(mapId, mType, cb, divConatiner) {
        this.darkLayers = []
        this.whiteLayers = []
        this.yingxiangLayers = []
        this.mapType = mType || window.GLOBAL_CONFIG.defaultMapType
        const MAPCONFIG = window.GLOBAL_CONFIG.erwei
        const mOption = {
            center: MAPCONFIG.center, // 地图中心
            zoom: MAPCONFIG.zoom, // 缩放比列
            minZoom: MAPCONFIG.minZoom,
            maxZoom: MAPCONFIG.maxZoom,
            zoomControl: false, // 禁用 + - 按钮
            doubleClickZoom: false, // 禁用双击放大
            attributionControl: false, // 移除右下角leaflet标识
            inertia: false
        }
        // 系统地图服务是否为超图服务  超图发的都是84坐标   全局配置获取
        if (MAPCONFIG.isSuperMap) {
            mOption.crs = L.CRS.EPSG4326
        }
        if (MAPCONFIG.maxBounds && MAPCONFIG.maxBounds.length) {
            mOption.maxBounds = L.latLngBounds(MAPCONFIG.maxBounds[0], MAPCONFIG.maxBounds[1])
        }
        this.map = L.map(mapId, mOption)
        if (!MAPCONFIG.isSuperMap) {
            //在线互联网地图
            if (MAPCONFIG.isOnlineMap) {
                if (MAPCONFIG.Satellite) {
                    AMapLoader.reset()
                    var gdDiv = document.createElement('div')
                    const divId = 'gaode-custom-' + MAPCONFIG.gaodeRenderIdx
                    if (divConatiner) {
                        const erd = elementResizeDetectorMaker()
                        erd.listenTo(divConatiner, dcon => {
                            gdDiv.style.height = dcon.offsetHeight + 'px'
                            gdDiv.style.width = dcon.offsetWidth + 'px'
                            this.map.invalidateSize({ animate: false, duration: 0.1 })
                        })
                    }
                    gdDiv.id = divId
                    gdDiv.style.height = divConatiner ? divConatiner.offsetHeight + 'px' : '100vh'
                    gdDiv.style.width = divConatiner ? divConatiner.offsetWidth + 'px' : '100vw'
                    gdDiv.style.pointerEvents = 'none'
                    document.body.append(gdDiv)
                    window._AMapSecurityConfig = {
                        securityJsCode: MAPCONFIG.gaodeSecret
                    }
                    AMapLoader.load({
                        key: MAPCONFIG.gaodeKey,
                        version: '2.0',
                        plugins: []
                    })
                        .then(AMap => {
                            this.amap = new AMap.Map(divId, {
                                zoomEnable: true,
                                dragEnable: true,
                                resizeEnable: false,
                                animateEnable: false,
                                jogEnable: false,
                                terrain: true,
                                layers: [new AMap.TileLayer.Satellite()]
                            })
                            // console.log('amap==', this.amap)
                            var position = new AMap.LngLat(MAPCONFIG.center[1], MAPCONFIG.center[0])
                            this.amap.setCenter(position)
                            this.amap.setZoom(MAPCONFIG.zoom)
                            //延迟加载 解决白屏一闪的问题
                            setTimeout(() => {
                                var gaodelayer = L.customLayer({
                                    container: gdDiv, // The DomElement object to display.
                                    minZoom: MAPCONFIG.minZoom,
                                    maxZoom: MAPCONFIG.maxZoom,
                                    opacity: 1, // Opacity of the layer.
                                    visible: true, // Visible of the layer.
                                    zIndex: 1 // The explicit zIndex of the layer.
                                })
                                gaodelayer.on('layer-render', e => {
                                    if (!!this.amap) {
                                        let azoom = this.amap.getZoom()
                                        this.amap.setZoomAndCenter(e.target._zoom, [e.target._center.lng, e.target._center.lat], true)
                                    }
                                })
                                //高德异步  在此处加载
                                this.map.addLayer(gaodelayer)
                                MAPCONFIG.gaodeRenderIdx++
                            }, 800)
                        })
                        .catch(e => {
                            console.error(e)
                        })
                }
                if (MAPCONFIG.onlineMapTypeWhite && MAPCONFIG.onlineMapTypeWhite.length) {
                    MAPCONFIG.onlineMapTypeWhite.forEach(oMap => {
                        this.whiteLayers.push(L.tileLayer.chinaProvider(oMap))
                    })
                }
                if (MAPCONFIG.onlineMapTypeYingxiang && MAPCONFIG.onlineMapTypeYingxiang.length) {
                    MAPCONFIG.onlineMapTypeYingxiang.forEach(oMap => {
                        this.yingxiangLayers.push(L.tileLayer.chinaProvider(oMap))
                    })
                }
            } else {
                //非超图离线地图--暂不涉及
                this.whiteLayers = [L.tileLayer(mapUrl || MAPCONFIG.mapUrl)]
                if (MAPCONFIG.yingxiangUrl) this.yingxiangLayers = [L.tileLayer(MAPCONFIG.yingxiangUrl)]
                if (MAPCONFIG.darkMapUrl) this.darkLayers = [L.tileLayer(MAPCONFIG.darkMapUrl)]
            }
        } else {
            //超图
            this.whiteLayers = [L.supermap.tiledMapLayer(mapUrl || MAPCONFIG.mapUrl)]
            if (MAPCONFIG.yingxiangUrl) this.yingxiangLayers = [L.supermap.tiledMapLayer(MAPCONFIG.yingxiangUrl)]
            if (MAPCONFIG.darkMapUrl) this.darkLayers = [L.supermap.tiledMapLayer(MAPCONFIG.darkMapUrl)]
        }
        switch (this.mapType) {
            case 1: // 1白底
                this.whiteLayers.forEach(blayer => {
                    this.map.addLayer(blayer)
                })
                break
            case 2: // 2黑底
                this.darkLayers.forEach(blayer => {
                    // console.log(blayer, 'blayer')
                    this.map.addLayer(blayer)
                })
                break
            case 3: // 3影像
                this.yingxiangLayers.forEach(blayer => {
                    this.map.addLayer(blayer)
                })
                break

            default:
                break
        }
        this.map.pm.setLang('zh')
        cb && cb()
    }
    changeMap(type) {
        if (this.mapType === 1) {
            this.whiteLayers.forEach(blayer => {
                this.map.removeLayer(blayer)
            })
        } else if (this.mapType === 2) {
            this.yingxiangLayers.forEach(blayer => {
                this.map.removeLayer(blayer)
            })
        } else {
            this.darkLayers.forEach(blayer => {
                this.map.removeLayer(blayer)
            })
        }
        this.mapType = type
        if (type === 1) {
            this.whiteLayers.forEach(blayer => {
                this.map.addLayer(blayer)
            })
        } else if (type === 2) {
            this.yingxiangLayers.forEach(blayer => {
                this.map.addLayer(blayer)
            })
        } else {
            this.darkLayers.forEach(blayer => {
                this.map.addLayer(blayer)
            })
        }
    }
    setZoom(level) {
        this.map.setZoom(level)
    }
    // x销毁
    destroyMap() {
        this.map.remove()
        this.map = null
    }
    // 通过多边形by latlngs
    renderPolygonBylatlngs(
        latlngs,
        bindObj = {},
        options = {
            color: 'rgb(93,182,250)',
            fillColor: 'rgb(93,182,250)',
            fillOpacity: 0.45
        }
    ) {
        const layer = L.polygon(latlngs, { ...options, bindObj }).addTo(this.map)
        return layer
    }
    // fitbounds
    fitBounds(bounds, paddingOption = { padding: [150, 150] }) {
        this.map.fitBounds(bounds, paddingOption)
    }
    // 注册layer事件
    registerLayerEvent(layer, eventType, fn) {
        layer.on(eventType, fn)
    }
    // 清除图层
    removeLayer(layer) {
        this.map.removeLayer(layer)
    }
    hasLayer(layer) {
        return this.map.hasLayer(layer)
    }
    // 清添加图层
    addLayer(layer) {
        this.map.addLayer(layer)
    }
    // 渲染标记--图片icon,传了customeOptions将不使用imgUrl
    renderMarker(latlng, imgUrl, bindObj = {}, customeOptions, noAddMap) {
        let options = customeOptions || {
            icon: L.icon({
                iconUrl: imgUrl,
                iconSize: [36, 36]
            }),
            bindObj,
            riseOnHover: true,
            riseOffset: 250,
            zIndexOffset: 8
        }
        let marker = L.marker(latlng, options)
        if (!noAddMap) marker.addTo(this.map)
        return marker
    }

    // 渲染标记--图片icon,传了customeOptions将不使用imgUrl
    renderMarkerWhhYuan(latlng, options) {
        return L.marker(latlng, options)
    }
    renderMarkerCun(latlng, imgUrl, bindObj = {}, customeOptions) {
        let options = customeOptions || {
            icon: L.icon({
                iconUrl: imgUrl,
                iconSize: [36, 36],
                iconAnchor: [18, 36]
            }),
            bindObj,
            riseOnHover: true,
            riseOffset: 250,
            zIndexOffset: 8
        }
        return L.marker(latlng, options).addTo(this.map)
    }
    // latlng数组生成fitbounds
    createLatLngBounds(latlngs) {
        return L.latLngBounds(latlngs)
    }
    // 动态点闪烁
    renderPulse(latlng, iconSize = [16, 16], color = 'red') {
        const pulseIcon = L.icon.pulse({
            iconSize,
            color
        })
        return L.marker(latlng, { icon: pulseIcon, zIndexOffset: 999 }).addTo(this.map)
    }
    // 飞向某个点位
    flyToPoint(latlng, zoom = 15, opts = { duration: 0.35, animate: true }) {
        this.map.flyTo(latlng, zoom, opts)
    }
    // 翻转经纬度  不改变原数组
    reverseLnglat(lnglat) {
        return lnglat.slice().reverse()
    }
    // 获取真实map对象
    getMap() {
        return this.map
    }
    // 画圆
    renderCircle(latlng, options = { radius: 200 }) {
        return L.circle(latlng, options).addTo(this.map)
    }
    // popup
    createPopUp(latlng, htmlContent, popOpts = { closeButton: false }) {
        return L.popup(popOpts)
            .setLatLng(latlng || undefined)
            .setContent(htmlContent || '')
            .openOn(this.map)
    }

    createBindPopUp(htmlContent, popOpts) {
        return L.popup(popOpts).setContent(htmlContent || '')
    }

    // 转换wkt数据并反转经纬度
    parsePointWktReverse(wktStr) {
        let geoJson = WKT.parse(wktStr)
        return geoJson.coordinates.reverse()
    }
    // geometry转换为wkt
    convertGeomatryToWkt(geometry) {
        return WKT.convert(geometry)
    }
    // wkt转换为geometry
    parseWkt(wktStr) {
        return WKT.parse(wktStr)
    }
    // 转换wkt为Geometry-geojson然后渲染
    renderGeoJsonByWkt(
        wktStr,
        properties = {},
        options = {
            style: {
                color: '#0961ae',
                fillColor: '#0961ae',
                fillOpacity: 0.5,
                zIndex: 3
            }
        },
        noAddMap
    ) {
        const geometry = WKT.parse(wktStr)
        let layer = L.geoJSON({ type: 'Feature', properties, geometry }, options)
        if (!noAddMap) layer.addTo(this.map)
        return layer
    }
    // latlng数组生成fitbounds
    createLatLngBounds(latlngs) {
        return L.latLngBounds(latlngs)
    }
    // 折线by latlngs
    renderPolylineBylatlngs(
        latlngs,
        bindObj = {},
        options = {
            color: '#ff3d00',
            weight: 5
        }
    ) {
        const layer = L.polyline(latlngs, { ...options, bindObj }).addTo(this.map)
        return layer
    }
    // maker在线上运动轨迹
    renderMovingPolylineBylatlngs(
        latlngs,
        options = { color: '#ff3d00', weight: 5 },
        motionOptions = {
            auto: true,
            duration: 5000
        },
        markerOptions = {
            removeOnEnd: false,
            showMarker: true,
            icon: L.icon({
                iconUrl: '/static/grid_management_platform/erweiicons/location-red.png',
                iconSize: [25, 32],
                iconAnchor: [12.5, 32]
            })
        }
    ) {
        const layer = L.motion.polyline(latlngs, options, motionOptions, markerOptions).addTo(this.map)
        return layer
    }
    // LonLat 是否在区域范围内  此处需要传geojson，传数组的话turf.polygon可能会出错
    iscontains(point, areaFeature) {
        return turf.booleanPointInPolygon(turf.point(point), areaFeature)
    }
    // 渲染一个热力图
    renderHeatLayer(
        heatLatlngs,
        opts = {
            radius: 30,
            minOpacity: 0.5
        }
    ) {
        return L.heatLayer(heatLatlngs, opts).addTo(this.map)
    }
    // Geometry-geojson然后渲染
    renderGeoJson(
        geoJson,
        options = {
            style: {
                color: '#0961ae',
                fillColor: '#0961ae',
                fillOpacity: 0.5
            }
        }
    ) {
        return L.geoJSON(geoJson, options).addTo(this.map)
    }
    // 点聚合对象
    createNewCluster(options) {
        return L.markerClusterGroup(options || {})
    }
    // 渲染标记--图片icon,传了customeOptions将不使用imgUrl
    createMrker(wkt, imgUrl, bindObj = {}, customeOptions) {
        const geometry = WKT.parse(wkt)
        let options = customeOptions || {
            icon: L.icon({
                iconUrl: imgUrl,
                iconSize: [32, 32],
                iconAnchor: [16, 32]
            }),
            bindObj,
            riseOnHover: true,
            riseOffset: 250,
            zIndexOffset: 8
        }
        return L.marker(geometry.coordinates.reverse(), options)
    }

    // 渲染平安指数 div + 图片
    createHtmlMarker(bindObj = {}, customerOptions) {
        const geometry = WKT.parse(bindObj.wkt)
        let options = customerOptions || {
            icon: L.divIcon({
                html: `
        <div class="safety-info-box flex flex-v flex-j-b flex-a-c">
            <div class="safety-top flex flex-h flex-j-c flex-a-c">${bindObj.totalScore || '-'}</div>
            <div class="safety-bot ${bindObj.scoreLevel}"></div>
        </div>
        `,
                iconSize: [52, 68],
                iconAnchor: [34, 68]
            }),
            bindObj,
            riseOnHover: true,
            riseOffset: 250,
            zIndexOffset: 8
        }
        return L.marker(geometry.coordinates.reverse(), options)
    }

    // marker创建layer
    addMarkerLayer(markers = []) {
        const layer = new L.layerGroup()
        markers.forEach(marker => marker.addTo(layer))
        return layer
    }

    // 获取中心点
    getCenterWktPoint(wktStr, isLatlng) {
        if (!wktStr) return ''
        const geometry = WKT.parse(wktStr)
        const center = turf.centroid(geometry)
        if (center.geometry && center.geometry.type === 'Point') {
            let coor = center.geometry.coordinates
            return isLatlng ? coor.reverse() : `POINT (${coor[0]} ${coor[1]})`
        }
        return ''
    }
    // 红色水波纹
    renderRedWater(latlng, iconAnchor) {
        return this.renderMarker(latlng, '', '', {
            icon: L.divIcon({
                html: `<div id="grad2">
                  <div class="biggest-circle">
                      <div class="middle-circle">
                          <div class="inner-circle"></div>
                      </div>
                  </div>
                </div>`,
                iconAnchor: [30, 34]
            }),
            bindObj: {}
        })
    }
    //生成随机点
    getRandomPoints(count, geometry) {
        return turf.randomPoint(count, { bbox: turf.bbox(geometry) })
    }
    // 定位divIcon
    renderlocationMarker(latlng, num, obj, iconAnchor) {
        return this.renderMarker(latlng, '', '', {
            icon: L.divIcon({
                html: `<div class="cestc-loaction">${num}</div>`,
                iconSize: [50, 50]
                // iconAnchor: iconAnchor || [25,50]
            }),
            bindObj: obj || {}
        })
    }
    // 自定义divicon
    createDivIcon(options = { html: '' }) {
        return L.divIcon(options)
    }
    // 水波纹并添加定位图标
    renderCenterWaterMaker(latlng, obj) {
        return this.renderMarker(latlng, '', '', {
            icon: L.divIcon({
                html: `<div class="cestc-center-water"></div>`,
                iconSize: [75, 30],
                iconAnchor: [38.5, 15]
            }),
            bindObj: obj || {},
            riseOnHover: true,
            riseOffset: 250,
            zIndexOffset: 999
        })
    }
    // 小区点位---面上图--修改
    renderMarkerDistrict(district, noAddMap) {
        const fillColorMap = {
            DISTRIC: 'rgba(255,48,25,1)',
            VILLAGE: 'rgba(255,210,77,1)',
            INDEPENDENT: 'rgba(87,171,255,1)'
        }
        const wkt = this.getCenterWktPoint(district.wkt)
        const geometry = WKT.parse(wkt)
        const layer = this.renderGeoJsonByWkt(
            district.wkt,
            {},
            {
                bindObj: district,
                color: '#ffffff',
                weight: 2,
                dashArray: [4, 8],
                fillColor: fillColorMap[district.elementType] || '#FFA41E',
                fillOpacity: 0.36
            },
            noAddMap
        )
        const label = this.renderMarker(
            geometry.coordinates.reverse(),
            '',
            '',
            {
                icon: L.divIcon({
                    html: `<div class="cestc-district" title="${district.name}"><span class="d-name">${district.name}</span></div>`,
                    iconSize: [50, 54],
                    iconAnchor: [25, 27]
                }),
                bindObj: district,
                riseOnHover: true,
                riseOffset: 230,
                zIndexOffset: 200
            },
            noAddMap
        )
        return {
            layer,
            label
        }
    }
    //自定义轨迹线---
    renderGridManMoveLine(latlngs, loop) {
        const routeLine = L.polyline(latlngs, { weight: 6, color: '#FFB500', opacity: 0.4, dashArray: [1, 2] }).addTo(this.map)
        const routeLineDash = L.polyline(latlngs, { weight: 1, color: '#FFB500', opacity: 1, dashArray: [3, 6] }).addTo(this.map)
        var lineDistance = turf.length(routeLine.toGeoJSON(), { units: 'meters' })
        const realRouteLine = L.polyline([], { weight: 8, color: '#ff9900', opacity: 0.6, dashArray: [1, 2] }).addTo(this.map)
        const decorator = L.polylineDecorator(routeLine, {
            patterns: [
                {
                    repeat: 60,
                    symbol: L.Symbol.arrowHead({
                        pixelSize: 5,
                        headAngle: 75,
                        polygon: false,
                        pathOptions: {
                            stroke: true,
                            weight: 1,
                            color: '#FF6800',
                            opacity: 0.6
                        }
                    })
                }
            ]
        }).addTo(this.map)
        const carIcon = L.icon({
            iconSize: [138, 138],
            iconAnchor: [69, 98]
            // iconUrl: require('@/assets/darktheme/event/renzou.gif')
        })
        const speedList = []
        latlngs.forEach(() => {
            // speedList.push(Math.round(Math.random()*(5-1)+1))
            speedList.push(1)
        })
        const animatedMarker = L.animatedMarker(routeLine.getLatLngs(), {
            animationTime: 10000,
            lineDistance,
            speedList: speedList,
            icon: carIcon,
            playCall: updateRealLine
        }).addTo(this.map)
        var newLatlngs = [routeLine.getLatLngs()[0]]
        // 绘制已行走轨迹线（橙色那条）
        function updateRealLine(latlng, isFinish) {
            newLatlngs.push(latlng)
            realRouteLine.setLatLngs(newLatlngs)
            //结束了轨迹播放
            if (isFinish && loop) {
                newLatlngs = [routeLine.getLatLngs()[0]]
                realRouteLine.setLatLngs([])
                animatedMarker.stop()
                setTimeout(() => {
                    animatedMarker.start()
                }, 1000)
            }
        }
        this.map.fitBounds(routeLine.getBounds(), { maxZoom: 19, animate: false, padding: [0, 0] })
        animatedMarker.start()
        return [animatedMarker, realRouteLine, routeLine, decorator, routeLineDash]
    }
    // 获取一个点并计算给定距离(以度、弧度、英里或公里为单位)的目标点的位置。本项目使用默认值km
    getDestinationLatlng(latlng, distance = 0.5, bearing = 90) {
        let point = latlng.slice().reverse()
        let rPoint = turf.destination(point, distance, bearing)
        return rPoint.geometry.coordinates.slice().reverse()
    }
    //获取亮点距离
    getDistanceByPoints(point1, point2) {
        return turf.distance(point1, point2)
    }
}
