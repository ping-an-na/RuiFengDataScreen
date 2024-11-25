<template>
  <div class="commo-tb-list">
    <c-table
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
    </c-table>
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
  methods: {
    center(row) {
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
}
</style>
