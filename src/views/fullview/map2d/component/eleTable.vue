<template>
  <div class="commo-tb-list">
    <div class="tb-list">
      <div v-for="item in tableData" :key="item.id" class="list-con" @click="center(item)">
        <el-tooltip class="item" effect="dark" :content="item.projectName" placement="top" :disabled="!(item.projectName && item.projectName.length > 20)"
                    popper-class="popperClassAA_1">
          <div :class="item.id === activeId ? 'list-item-active': 'list-item'">{{ item.projectName }}</div>
        </el-tooltip>
      </div>
    </div>
    <!-- <c-table
  ref="table"
  class="cestc-dark-table"
  :data="tableData"
  :show-cell-border="false"
  stripe
  tooltip-effect="dark"
  style="width: 100%"
  height="100%"
>
  <c-table-column
    v-for="item in columns"
    :key="item.prop"
    :label="item.label"
    :prop="item.prop"
    :width="item.width"
    show-overflow-tooltip
  >
    <template v-slot="{ row }">
      {{ row[item.prop] }}
    </template>
  </c-table-column>
  <c-table-column
    v-if="showBtns"
    :width="actionWidth"
    align="left"
    header-align="left"
    label="操作"
  >
    <template v-slot="{ row }">
      <c-tooltip content="地图居中" effect="dark" placement="top">
        <span
          class="action-btn center-btn"
          @click="center(row)"
        ></span>
      </c-tooltip>
      <c-tooltip v-if="showDetailBtn" :content="detailTip" effect="dark" placement="top">
        <span
          class="action-btn detail-btn"
          @click="showDetail(row)"
        ></span>
      </c-tooltip>
      <c-tooltip v-if="showTaskBtn" content="发布任务" effect="dark" placement="top">
        <span
          class="action-btn task-btn"
          @click="createTask(row)"
        ></span>
      </c-tooltip>
    </template>
  </c-table-column>
    </c-table>-->
  </div>
</template>

<script>
export default {
  filters: {
    filterData(val) {
      if ([null, undefined].includes(val)) return '--'
      return val
    }
  },
  props: {
    actionWidth: {
      type: [String, Number],
      default: 80
    },
    columns: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    showBtns: {
      type: Boolean,
      default: true
    },
    showDetailBtn: {
      type: Boolean,
      default: true
    },
    showTaskBtn: {
      type: Boolean,
      default: false
    },
    detailTip: {
      type: String,
      default: '查看详情'
    }
  },
  data() {
    return {
      activeId: ''
    }
  },
  methods: {
    center(row) {
      this.activeId = row.id
      this.$emit('centerEle', row)
    },
    showDetail(row) {
      this.$emit('showEleDetail', row, true)
    },
    createTask(row) {
      this.$emit('addTask', row)
    }
  }
}
</script>

<style lang="scss">
.c-popper.grid-popover {
  margin-left: 0;
  width: auto;
}
</style>

<style lang="scss" scoped>
.commo-tb-list {
  height: 100%;

  .tb-list {
    padding-top: 19px;

    .list-con {
      cursor: pointer;
      height: 36px;
      display: flex;
      align-items: center;
      padding: 0 10px;

      .list-item {
        white-space: nowrap; /* 确保文本在一行内显示 */
        overflow: hidden; /* 隐藏超出容器的文本 */
        text-overflow: ellipsis; /* 使用省略号表示被截断的文本 */
        //width: 200px;
        flex: 1;
        font-family: Source Han Sans CN;
        font-weight: 500;
        font-size: 12px;
        color: #c6ddf6;
        //margin-bottom: 19px;
        &:hover {
          color: #1ff2ff;
        }
      }

      .list-item-active {
        white-space: nowrap; /* 确保文本在一行内显示 */
        overflow: hidden; /* 隐藏超出容器的文本 */
        text-overflow: ellipsis; /* 使用省略号表示被截断的文本 */
        //width: 200px;
        flex: 1;
        font-family: Source Han Sans CN;
        font-weight: 500;
        font-size: 12px;
        color: #1ff2ff;
        //margin-bottom: 19px;
      }
    }

  }

  .list-con:hover {
    background: rgba(3, 24, 59, .9);
  }
}
</style>
<style>
.popperClassAA_1 {
  background: #08285e !important;
}
</style>
