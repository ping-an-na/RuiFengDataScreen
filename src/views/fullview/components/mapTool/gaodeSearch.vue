<template>
    <div class="gaode-search">
        <div class="gaode-input">
            <c-input v-model="keywords" placeholder="请输入关键词" @keyup.enter.native="searchList" />
            <div class="qs-search-btn" @click="searchList"></div>
        </div>
        <div v-if="resultList.length" class="gaode-result">
            <div v-for="(item,index) in resultList" :key="index" class="g-result" @click="locAddress(item)">
                <div class="a-name ellipsis fs14">{{ item.name }}</div>
                <div class="a-loc ellipsis fs12">{{ item.address }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GovernancePictureWebOriGaodeSearch',

    data() {
        return {
            keywords: '',
            resultList: [],
            centerMarker: null
        }
    },
    watch: {
        keywords(val) {
            if (!val) this.resultList = []
        }
    },
    beforeDestroy() {
        this.$bus.$off('gaodeLoc')
        this.clearCenter()
    },
    mounted() {},

    methods: {
        searchList() {
            this.clearCenter()
            this.resultList = []
            if (!this.keywords) {
                this.$message.info('请输入关键词！')
                return
            }
            // 高德服务端方式
            // fetch(`https://restapi.amap.com/v3/place/text?key=${window.GLOBAL_CONFIG.erwei.gaodeServerKey}&city=${window.GLOBAL_CONFIG.erwei.city || '全国'}&keywords=${this.keywords}`).then(data => {
            //   return data.text()
            // }).then(res => {
            //   const resObj = JSON.parse(res)
            //   if (resObj.status === '1') {
            //     this.resultList = resObj.pois || []
            //   } else {
            //     this.$message.error(resObj.info)
            //   }
            // })
            AMap.plugin(['AMap.PlaceSearch'], () => {
                // 构造地点查询类
                const placeSearch = new AMap.PlaceSearch({
                    pageSize: 20, // 单页显示结果条数
                    pageIndex: 1, // 页码
                    city: window.GLOBAL_CONFIG.erwei.city || '全国', // 兴趣点城市
                    citylimit: true, // 是否强制限制在设置的城市内搜索
                    extensions: 'all'
                })
                placeSearch.search(this.keywords, (status, result) => {
                    if (status === 'no_data') {
                        this.$message.info('未搜索到相关地点')
                    } else if (status !== 'complete') {
                        // 列出常年的错误
                        const errKeyMap = {
                            SERVICE_NOT_AVAILABLE: '服务不可用',
                            INVALID_USER_KEY: 'key不正确或过期',
                            INVALID_USER_SCODE: '安全码未通过验证',
                            INVALID_USER_DOMAIN: '绑定域名无效',
                            USERKEY_PLAT_NOMATCH: '请求key与绑定平台不符',
                            INSUFFICIENT_PRIVILEGES: '权限不足，服务请求被拒绝',
                            USER_KEY_RECYCLED: 'Key被删除',
                            INVALID_PARAMS: '请求参数非法',
                            UNKNOWN_ERROR: '其他未知错误'
                        }
                        this.$message.warning(errKeyMap[result] || '搜索出错')
                    } else {
                        this.resultList = result?.poiList?.pois || []
                    }
                })
            })
        },
        locAddress({ location }) {
            this.$bus.$emit('gaodeLoc', `${location.lng},${location.lat}`)
            // this.clearCenter()
            // let latlng
            // if (location) {
            //   const arr = location.split(',')
            //   latlng = arr.reverse()
            //   this.centerMarker = $twoD_map.renderMarker(latlng, '', '', {
            //     icon: L.divIcon({
            //       html: `<div class="cestc-loaction cestc-loaction-yellow"></div>`,
            //       iconSize: [26, 26]
            //     }),
            //     bindObj: {}
            //   })
            // }
            // const MAPCONFIG = window.GLOBAL_CONFIG.erwei
            // $twoD_map.flyToPoint(latlng, MAPCONFIG.maxZoom, { duration: 1, animate: true })
        },
        clearCenter() {
            if (this.centerMarker) $twoD_map.removeLayer(this.centerMarker)
            this.centerMarker = null
        }
    }
}
</script>

<style lang="scss" scoped>
// .gaode-search {
//   position: absolute;
//   top: 100px;
//   left: 24px;
//   width: 404px;
//   .gaode-input {
//     height: 44px;
//     background-repeat: no-repeat;
//     background-size: 100% 100%;
//     background-image: url("~@/assets/darktheme/imgs/gaodesearch.png");
//     display: flex;
//     align-items: center;
//     padding: 0 16px;
//     ::v-deep {
//       .c-input {
//         .c-input__inner {
//           background-color: transparent;
//           border: none;
//           color: #ffffff;
//           &::placeholder {
//             font-size: 14px;
//             color: #ffffff;
//           }
//         }
//       }
//     }
//     .qs-search-btn {
//       height: 24px;
//       width: 24px;
//       background-image: url("~@/assets/darktheme/imgs/quicksearch.png");
//       background-repeat: no-repeat;
//       background-size: 100% 100%;
//       cursor: pointer;
//     }
//   }
//   .gaode-result {
//     padding: 6px 10px;
//     width: 100%;
//     height: 240px;
//     background-repeat: no-repeat;
//     background-size: 100% 100%;
//     background-image: url("~@/assets/darktheme/imgs/gaoderesult.png");
//     overflow-y: auto;
//     .g-result {
//         color: #fff;
//         height: 36px;
//         border-image: linear-gradient(316deg, rgba(0, 76, 102, 0.51), rgba(113, 219, 255, 1), rgba(0, 82, 109, 0.53)) 1 1;
//         border-bottom: 1px;
//         font-family: PingFangSC-Medium, PingFang SC;
//         display: flex;
//         flex-direction: column;
//         justify-content: space-around;
//         border-bottom: 1px solid;
//         border-image: linear-gradient(316deg, rgba(0, 76, 102, 0.51), rgba(113, 219, 255, 1), rgba(0, 82, 109, 0.53)) 1 1;
//         cursor: pointer;
//         padding: 0 12px;
//         .a-name {
//           font-weight: 500;
//         }
//         .a-loc {
//           color: rgba(255, 255, 255, 0.6);
//         }
//         &:hover {
//           background-repeat: no-repeat;
//           background-size: 100% 100%;
//           background-image: url("~@/assets/darktheme/situationAware/tr-bg-hover@2x.png");
//         }
//     }
//   }
// }
</style>
