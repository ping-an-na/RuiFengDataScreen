import TwoDimensionalMap from '@/utils/mapTool/TwoDimensionalMap'
export default {
  beforeDestroy() {
    this.twoD_map && this.twoD_map.destroyMap()
    this.twoD_map = null
  },
  data() {
    return {
      twoD_map: null// 二维地图类对象，真实map对象为twoD_map.map
    }
  },
  methods: {
    // type  1白底 2黑底  3影像, 4-卫星
    initTwoDMap(mapId = 'map', type = 1, cb, divContainer) {
      this.twoD_map = new TwoDimensionalMap(mapId, type, cb, divContainer)
    }
  }
}
