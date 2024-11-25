<template>
  <div class="dialog-con">
    <div class="top-d">
      <div class="title-model">{{ title }}</div>
      <div class="right-close" @click="closeMidDialog"></div>
    </div>
    <div class="content">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="name" label="标段名称" width="150"></el-table-column>
        <el-table-column prop="city" label="预警类型" width="100"></el-table-column>
        <el-table-column prop="address" label="预警内容"></el-table-column>
        <el-table-column prop="zip" label="预警日期" width="100"></el-table-column>
        <el-table-column label="操作" width="50">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
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
  mounted() {
  },

  methods: {
    closeMidDialog() {
      this.$emit('closeDialog')
    },
    handleClick(row) {
      this.$emit('details', row)
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
    width: 880px;
    height: 560px;
    background-image: url('~@/assets/agriculture/kuangjia_2.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
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
