export default {
    data() {
        return {
            toolType: '',
            transdata: null
        }
    },
    computed: {
        activeMenu() {
            return this.$store.getters['governPicture/activeMenu']
        },
        toolContentComponent() {
            return ''
            // return this.toolType ? resolve => require([`@/views/fullview/components/mapTool/contents/${this.toolType}.vue`], resolve) : null
        },
        rootGrid() {
            return this.$store.getters['grid/rootGrid']
        }
    },
    watch: {
        toolType(newVal, oldVal) {
            if (!oldVal && newVal) {
                if (this.currentGrid.id !== this.rootGrid.id) {
                    this.$store.dispatch('grid/setCurrentGrid', this.rootGrid)
                } else {
                    $twoD_map.flyToPoint(this.centerLatlng, this.mapZoom)
                }
            }
            if (oldVal && !newVal) {
                $twoD_map.flyToPoint(this.centerLatlng, this.mapZoom)
            }
        },
        activeMenu() {
            this.toolType = ''
        }
    },
    created() {},
    methods: {
        toolChangeFn(type) {
            this.toolType = type
        },
        _frameSelectClick() {
            this.$refs.toolContent && this.$refs.toolContent.drawPolygon()
        }
    }
}
