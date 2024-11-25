<!--
 * @Description:
 * @Author: qiyongguo
 * @Date: 2021-12-31
-->
<template>
    <div class="grid-large-card" :style="{width, height: !isCollapse ? height : '80px'}">
        <slot name="cusAppend" />
        <div class="g-title">
            <span class="title-rect"></span>
            <span class="grid-linear-text">{{ title }}</span>
        </div>
        <!-- <div v-if="showCollapse" :class="isCollapse ? 'co-btn collapse' : 'co-btn co-btn-open'" @click="isCollapse = !isCollapse">
      <span class="status-name">{{ !isCollapse ? '收起' : '展开' }}</span>
      <img v-if="isCollapse" src="@/assets/governPicture/down-btn.png" />
      <img v-if="!isCollapse" src="@/assets/governPicture/up-btn.png" />
        </div>-->
        <transition name="c-fade-in-linear">
            <div v-if="!isCollapse" class="card-content">
                <slot />
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    props: {
        title: String,
        width: {
            type: String,
            default: '720'
        },
        height: {
            type: String,
            default: '100%'
        },
        showCollapse: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isCollapse: false
        }
    }
}
</script>

<style lang="scss" scoped>
.grid-large-card {
    position: relative;
    height: 100%;
    .g-title {
        height: 33px;
        width: 100%;
        font-family: YouSheBiaoTiHei;
        font-size: 18px;
        line-height: 34px;
        // background-image: url('~@/assets/grid/弹窗标题背景板@2x.png');
        // background-repeat: no-repeat;
        // background-size: 100% 100%;
        padding-left: 6px;
    }
    .co-btn {
        width: 105px;
        height: 28px;
        // background-image: url('~@/assets/governPicture/coen.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: 2px;
        top: 6px;
        padding-left: 16px;
        display: flex;
        align-items: center;
        cursor: pointer;
        .status-name {
            font-size: 14px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #ffffff;
        }
        img {
            width: 20px;
            height: 20px;
            margin-left: 8px;
        }
    }
    .card-content {
        min-height: 100px;
        height: calc(100% - 32px);
        background: linear-gradient(270deg, rgba(25, 155, 254, 0.45) 0%, rgba(41, 132, 224, 0.49) 100%);
        box-shadow: 0px 4px 10px 0px rgba(0, 51, 96, 0.12), inset 0px 1px 21px 0px rgba(118, 209, 255, 0.64);
        // border: 1px solid;
        // border-image: linear-gradient(360deg, rgba(159, 213, 255, 1), rgba(120, 215, 255, 1), rgba(200, 232, 255, 1), rgba(152, 207, 255, 1)) 1 1;
    }
}

[data-theme='dark-theme'] {
    .grid-large-card {
        .g-title {
            // background-image: url('~@/assets/darktheme/grid/弹窗标题背景板@2x.png');
            .title-rect {
                display: inline-block;
                width: 5px;
                height: 14px;
                background: linear-gradient(270deg, #fffcc8 0%, #fff56a 52%, #fef897 100%);
                box-shadow: 0px 1px 9px 1px rgba(255, 40, 0, 1), inset 0px 2px 6px 0px rgba(255, 255, 255, 0.43);
                transform: rotate(18deg);
                margin-right: 8px;
            }
        }
        .co-btn {
            // background-image: url('~@/assets/darktheme/governPicture/coen.png');
        }
        .card-content {
            min-height: 100px;
            height: calc(100% - 32px);
            background: linear-gradient(270deg, rgba(0, 51, 77, 0.45) 0%, rgba(0, 25, 38, 0.5) 100%);
            box-shadow: 0px 4px 10px 0px rgba(0, 105, 131, 0.12), inset 0px 1px 12px 0px rgba(118, 209, 255, 0.64);
            // border: 1px solid;
            // border-image: linear-gradient(268deg, #00A5C6, rgba(0, 108, 129, 0.4), rgba(3, 84, 100, 0.4) , rgba(0, 185, 222, 0.4)) 2 2;
        }
    }
}
</style>
