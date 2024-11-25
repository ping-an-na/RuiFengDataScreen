<template>
    <div class="cestc-empty">
        <div class="empty-img"></div>
        <div class="empty-tip">{{ nodata }}</div>
    </div>
</template>

<script>
export default {
    name: 'GovernancePictureWebIndex',
    props: {
        nodata: {
            type: String,
            default: '暂无数据'
        }
    },
    data() {
        return {}
    },

    mounted() {},

    methods: {}
}
</script>

<style lang="scss" scoped>
.cestc-empty {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 16px;
    text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.5);
    .empty-img {
        width: 135px;
        height: 84px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .empty-tip {
        margin-top: 6px;
    }
}
</style>
