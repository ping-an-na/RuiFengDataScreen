<template>
    <div>
        <div class="progressName">
            <el-progress :width="60" :hidden="60" type="circle" :percentage="50"></el-progress>
        </div>
        <!-- 定义修改svg -->
        <div style="width:0px; height: 0px;">
            <svg width="100%" height="100%">
                <defs>
                    <linearGradient id="write" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#0299E2" stop-opacity="0.8" />// offset 设置起始 stop-color 设置起始位置的颜色
                        <stop offset="100%" style="stop-color:#02E4DC" stop-opacity="1" />// offset 设置起始 stop-color 设置起始位置的颜色
                    </linearGradient>
                </defs>
            </svg>
        </div>
    </div>
</template>

<style scoped lang="scss">
// 此处使用的是scss语法
.progressName {
    // 这里可以用
    ::v-deep {
        .el-progress {
            margin: 0 6px;
            position: relative;
            // 修改进度条文字提示颜色
            .el-progress__text {
            }
        }
        // 设置渐变进度条，通过重新定义svg标签的url
        svg > path:nth-child(2) {
            // #write 此处的id就是定义的svg标签id 做替换即可
            stroke: url(#write);
        }
        // 修改进度条背景色
        .el-progress path:first-child {
            // stroke: #e1e1e1;
        }
        // 进度条的图形样式，控制翻转
        // .el-progress-circle {
        //     transform: rotateY(180deg);
        // }
    }
}
</style>