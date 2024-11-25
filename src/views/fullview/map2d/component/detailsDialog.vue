<template>
    <div class="dialog-con">
        <div class="top-d">
            <div class="title-model">{{title}}</div>
            <div class="right-close" @click="closeMidDialog"></div>
        </div>
        <div class="content">
            <div class="content-ti">{{'sdahsd 标段'}}</div>
            <div class="content-se">
                <div class="content-se-1">{{'某某预警'}}</div>
                <div class="content-se-2">{{'2020-2-2'}}</div>
            </div>
            <div class="content-in">
                <div>{{'shjkhjkKJHSDKJAH空间和空间贷记卡回到家喀什卡刷道具卡是今安徽省的就卡死'}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GovernancePictureWebMiddleDialog',
    props: {
        title: {
            type: String,
            default: '预警列表'
        }
    },
    data() {
        return {
            tableData: [
                {
                    date: '2016-05-02',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                },
                {
                    date: '2016-05-04',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1517 弄',
                    zip: 200333
                },
                {
                    date: '2016-05-01',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1519 弄',
                    zip: 200333
                },
                {
                    date: '2016-05-03',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1516 弄',
                    zip: 200333
                }
            ]
        }
    },
    computed: {
        middleDialog() {
            return this.$store.getters['governPicture/middleDialog'] || {}
        },
        title() {
            return this.middleDialog.dTitle || '详情'
        },
        contentComponent() {
            const type = this.middleDialog.type || ''
            const cPath = (type && DIALOGPATHMAP[type]) || ''
            return cPath ? resolve => require([`@/views/${cPath}`], resolve) : null
        }
    },
    created() {
        if (this.middleDialog.showMaxMin) this.isMin = false
    },
    mounted() {},

    methods: {
        closeMidDialog() {
            this.$emit('closeDialog')
        }
    }
}
</script>

<style lang="scss" scoped>
.dialog-con {
    position: absolute;
    z-index: 5;
    // left: calc(50% - 396px);
    left: calc(50%);
    top: 278px;
    .top-d {
        display: flex;
        .title-model {
          flex: 1;
            width: 880px;
            height: 32px;
            background-image: url('~@/assets/agriculture/zu38_sucaianniu_2x.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
            font-family: HYYakuHei;
            font-weight: normal;
            font-size: 16px;
            color: #ffffff;
            font-style: italic;
            padding-left: 25px;
            line-height: 30px;
        }
        .right-close {
          width: 32px;
          height: 32px;
            background-image: url('~@/assets/agriculture/container_7@2x.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
            margin-left: 13px;
            cursor: pointer;
        }
    }
    .content {
        text-align: center;
        width: 880px;
        height: 560px;
        background-image: url('~@/assets/agriculture/kuangjia_2.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        color: aqua;
        .content-ti {
            font-size: 15px;
            margin: 20px auto;
        }
        .content-se {
            display: flex;
        }
        .content-in {
        }
    }
    ::v-deep {
        .el-table--border {
            border: 0;
        }
    }
}
[data-theme='dark-theme'] {
    .middle-dialog {
        // background-image: url('~@/assets/darktheme/governPicture/弹窗bg@2x.png');
        .d-head {
            height: 42px;
            text-align: center;
            line-height: 42px;
            .d-btns {
                position: absolute;
                right: 24px;
                top: -3px;
                display: flex;
            }
        }
        &.big-dialog {
            &.dialog-max {
                width: 1214px;
                left: calc(50% - 591px);
                margin-top: -100px;
                .d-head {
                    padding-top: 6px;
                    .d-btns {
                        position: absolute;
                        right: 36px;
                        top: 0px;
                        display: flex;
                    }
                }
                .dettail-section {
                    margin-top: 16px;
                    height: calc(100% - 120px);
                    padding: 12px 32px;
                }
            }
        }
    }
}
</style>
