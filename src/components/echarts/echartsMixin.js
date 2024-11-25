import { debounce, createUUID } from '@/utils/index'
import echarts from './common'
import elementResizeDetectorMaker from 'element-resize-detector'
import 'echarts/lib/component/dataZoom'
export default {
    props: {
        className: {
            type: String,
            default: 'chart'
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '100%'
        },
        // 父组件传递过来的图表数据
        chartData: {
            type: Object,
            required: true
        },
        chartIdFu: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            chart: null,
            loading: true,
            chartId: 'ehcart',
            // setIntervalId: null,
        }
    },
    created() {
        this.chartId = this.chartIdFu ? this.chartIdFu : createUUID()
    },
    mounted() {
        /* 图表初始化 */
        this.$nextTick(() => {
            this.initChart()
        })
        this.__resizeHanlder = debounce(() => {
            if (this.chart) {
                this.chart.resize()
            }
        }, 100)
        window.addEventListener('resize', this.__resizeHanlder)
        const erd = elementResizeDetectorMaker()
        // 监听搜索栏的高度调整content的高度
        erd.listenTo(document.getElementById(this.chartId), () => {
            this.$nextTick(() => {
                this.__resizeHanlder()
            })
        })
    },
    deactivated() {
        window.removeEventListener('resize', this.__resizeHanlder)
    },

    activated() {
        window.addEventListener('resize', this.__resizeHanlder)
    },

    beforeDestroy() {
        // console.log('销毁echarts了~~~~~~~')
        // if(this.setIntervalId) clearTimeout( this.setIntervalId )

        if (!this.chart) return

        window.removeEventListener('resize', this.__resizeHanlder)
        this.chart.dispose()
        this.chart = null
    },
    watch: {
        /* 如果图表数据是后台获取的，监听父组件中的数据变化，重新触发Echarts */
        chartData: {
            deep: true,
            handler(val) {
                this.setOptions(val)

                // let that = this
                // if(this.setIntervalId) clearTimeout( this.setIntervalId )
                // this.setIntervalId = setInterval(() => {
                //     let chartA = echarts.init(document.getElementById(this.chartId))
                //     if(!chartA) return
                //
                //     this.setOptions(this.chartData)
                //     // chartA.clear();
                //     //
                //     // this.setOptions(val)
                // }, 2000);
            }
        }
    },
    methods: {
        timeOut(){
            this.chart.clear();
            this.setOptions(this.chartData)
        },
        initChart() {
            this.chart = echarts.init(document.getElementById(this.chartId))
            this.$emit('_chart', this.chart)
            this.setOptions(this.chartData)
        },
        setOptions(opts) {
            this.loading = !Object.keys(opts).length
            this.chart?.setOption(opts, true)
        }
    },

}
