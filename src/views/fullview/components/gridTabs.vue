
<template>
    <div class="grid-tabs">
        <div v-for="item in tabs" :key="item.type" :class="['tab', activeTab == item.type ? 'active-tab' : '']" @click="activeTab = item.type;$emit('change', item.type)">
            <span class="ellipsis" :title="item.label">{{ item.label }}</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        tabs: {
            type: Array,
            default: () => []
        },
        defaultActiveTab: [Number, String]
    },
    data() {
        return {
            activeTab: this.defaultActiveTab || 1
        }
    }
}
</script>

<style lang="scss" scoped>
// .grid-tabs {
//   height: 28px;
//   display: flex;
//   margin-left: 4px;
//   .tab {
//     height: 100%;
//     width: 88px;
//     line-height: 28px;
//     text-align: center;
//     font-family: YouSheBiaoTiHei;
//     font-size: 16px;
//     background-repeat: no-repeat;
//     background-size: 100% 100%;
//     margin-left: -12px;
//     cursor: pointer;
//     background-image: url('~@/assets/grid/未选中-1.png');
//     &.active-tab {
//       background-image: url('~@/assets/grid/选中-1.png');
//     }
//     span {
//       display: inline-block;
//       background-image: linear-gradient(to bottom, #ffffff 0%, #b3dcff 100%);
//       background-clip: text;
//       color: transparent;
//       width: 68px;
//     }
//     &:first-child {
//       background-image: url('~@/assets/grid/未选中-2.png');
//       &.active-tab {
//         background-image: url('~@/assets/grid/选中-2.png');
//       }
//     }
//     &:hover {
//       background-image: url('~@/assets/grid/选中-1.png');
//       &:first-child {
//         background-image: url('~@/assets/grid/选中-2.png');
//       }
//     }
//   }
// }

// [data-theme="dark-theme"] {
//   .grid-tabs {
//   .tab {
//     background-image: url('~@/assets/darktheme/grid/未选中-1.png');
//     &.active-tab {
//       background-image: url('~@/assets/darktheme/grid/选中-1.png');
//     }
//     span {
//       background-image: linear-gradient(to bottom, #ffffff 0%, #ffffff 100%);
//     }
//     &:first-child {
//       background-image: url('~@/assets/darktheme/grid/未选中-2.png');
//       &.active-tab {
//         background-image: url('~@/assets/darktheme/grid/选中-2.png');
//       }
//     }
//     &:hover {
//       background-image: url('~@/assets/darktheme/grid/选中-1.png');
//       &:first-child {
//         background-image: url('~@/assets/darktheme/grid/选中-2.png');
//       }
//     }
//   }
// }
// }
</style>
