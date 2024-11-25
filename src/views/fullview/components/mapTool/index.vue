<template>
    <div class="map-tool" @mouseenter="showTools = true" @mouseleave="showTools = false">
        <transition name="c-fade-in-linear">
            <div v-if="showTools" class="tools">
                <div class="m-tool flex flex-h flex-a-c flex-j-b" :class="toolType === 'frameSelect' ? 'm-tool-active' : ''" @click="toolClickFn('frameSelect')">
                    <span class="t-name fs14">地图框选</span>
                    <div class="t-bg t-bg-kx"></div>
                </div>
                <div class="m-tool flex flex-h flex-a-c flex-j-b" :class="toolType === 'mapAnnotation' ? 'm-tool-active' : ''" @click="toolClickFn('mapAnnotation')">
                    <span class="t-name fs14">地图标注</span>
                    <div class="t-bg t-bg-bz"></div>
                </div>
            </div>
        </transition>
        <div class="map-tool-label" :class="toolType ? 'map-tool-label-active' : ''" @click="toggleTool">
            <div class="tool-bg"></div>
            <div class="tool-label">工具箱</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GovernancePictureWebOriIndex',
    props: {
        toolType: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            showTools: false
        }
    },
    watch: {
        toolType(val) {
            if (!val) {
                const map = $twoD_map.getMap()
                map.pm.disableDraw()
            }
        }
    },
    beforeDestroy() {
        this.$emit('update:toolType', '')
    },
    mounted() {},

    methods: {
        toolClickFn(type) {
            // 点击此处可以继续绘制
            if (type === 'frameSelect' && this.toolType === 'frameSelect') {
                this.$emit('frameSelectClick')
            }
            if (type === this.toolType) return
            this.$emit('update:toolType', type)
        },
        toggleTool() {
            if (this.toolType) this.$emit('update:toolType', '')
        }
    }
}
</script>

<style lang="scss" scoped>
.map-tool {
    position: fixed;
    z-index: 1;
    bottom: 106px;
    right: 439px;
    display: flex;
    .map-tool-label {
        width: 66px;
        height: 66px;
        background-image: url('~@/assets/darktheme/imgs/mapdiv.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        cursor: pointer;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: space-around;
        .tool-bg {
            margin-top: 4px;
            height: 39px;
            width: 51px;
            // background-image: url("~@/assets/darktheme/imgs/gongjvxiang_box.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }
        .tool-label {
            color: #fff;
            font-size: 12px;
        }
        &-active {
            // background-image: url("~@/assets/darktheme/imgs/mapdivy.png");
        }
    }
    &:hover {
        // .map-tool-label {
        //   background-image: url("~@/assets/darktheme/imgs/mapdivy.png");
        // }
    }
    .tools {
        width: 110px;
        height: 88px;
        // background: url("~@/assets/darktheme/situationAware/operate-box-bg@2x.png")
        // no-repeat;
        background-size: 100% 100%;
        padding: 0 12px;
        margin-right: 12px;
        margin-top: -22px;
        position: relative;
        .m-tool {
            cursor: pointer;
            height: 44px;
            color: #fff;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            &:not(:last-child) {
                // background: url("~@/assets/darktheme/situationAware/guard-line@2x.png")
                // no-repeat bottom center;
                background-size: 100% 2px;
            }
            // .t-bg {
            //   width: 18px;
            //   height: 18px;
            //   background-image: url("~@/assets/darktheme/imgs/huizhifanwei.png");
            //   background-repeat: no-repeat;
            //   background-size: 100% 100%;
            //   &-kx {
            //     background-image: url("~@/assets/darktheme/imgs/huizhifanwei.png");
            //   }
            //   &-bz {
            //     background-image: url("~@/assets/darktheme/imgs/ditubiaozhu.png");
            //   }
            // }
            &-active {
                color: #ffe166;
                // .t-bg {
                //   &-kx {
                //     background-image: url("~@/assets/darktheme/imgs/huizhifanwei_hv.png");
                //   }
                //   &-bz {
                //     background-image: url("~@/assets/darktheme/imgs/ditubiaozhu_hv.png");
                //   }
                // }
            }
        }
    }
}
</style>
