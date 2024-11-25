export default {
  data() {
    return {
      centerMarker: null
    }
  },
  created() {
    // 初始化事件类型
    // this.$store.dispatch('grid/setEventDict')
    this.$store.dispatch('grid/setEventCasdata')
    this.$bus.$on('centerEle', (eleData) => {
      if (eleData?.transData?.wkt) {
        const centerWkt = $twoD_map.getCenterWktPoint(eleData.transData?.wkt)
        this.centerPoint(eleData, centerWkt)
      } else {
        this.$message.warning('未获取到坐标信息，无法定位！')
      }
    })
    this.$bus.$on('clearCenterEle', (eleData) => {
      if (this.centerMarker) {
        $twoD_map.removeLayer(this.centerMarker)
        this.centerMarker = null
      }
    })
  },
  methods: {
    // 通用居中显示
    centerPoint(cData, centerWkt) {
      if (this.centerMarker) {
        $twoD_map.removeLayer(this.centerMarker)
        this.centerMarker = null
      }
      // 测试提出--定位时详情关闭
      this.$store.dispatch('governPicture/setMiddleDialog', {
        dTitle: '',
        visible: false,
        transData: null,
        type: ''
      })
      const latlng = $twoD_map.parsePointWktReverse(centerWkt || cData.transData.wkt)
      const MAPCONFIG = window.GLOBAL_CONFIG.erwei
      $twoD_map.flyToPoint(latlng, MAPCONFIG.maxZoom, { duration: 1, animate: false })
      setTimeout(() => {
        this.centerMarker = $twoD_map.renderCenterWaterMaker(latlng, cData)
        $twoD_map.registerLayerEvent(this.centerMarker, 'click', (e) => {
          const obj = e.target.options.bindObj
          this.$store.dispatch('governPicture/setMiddleDialog', obj)
        })
      }, 300)
    }
  }
}
