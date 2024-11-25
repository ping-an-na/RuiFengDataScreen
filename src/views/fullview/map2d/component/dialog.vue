<template>
  <el-dialog
      :visible="true"
      :modal="false"
      title
      :show-close="false"
      :estroy-on-close="true"
      :width="weeei?weeei:'880px'"
      :center="true"
      custom-class="custom-dialog"
      :append-to-body="true"
      :modal-append-to-body="true"
      ref="elDialog"
  >

    <!--    :fullscreen="true"-->
    <!--      -->

    <div class="top-d">
      <div class="title-model">
        <div style="transform: skew(-10deg);">{{ title }}
        </div>
      </div>
      <div class="right-close" @click="closeMidDialog"></div>
    </div>

    <div :class="{ccccDament:true,form: type==='3',content1:type === '3',content:type !== '3'}"
         :style="heeeei?heeeei:''">
      <slot name="topModel"/>
      <div style="overflow: auto;" :style="type==='1'?'height: calc(100% - 100px);':''">
        <template v-if="type==='1'">
          <el-table :data="tableData" border
                    style="width: 100%;height:100%;border: #00aaf6 solid 0.5px"
                    :header-cell-style="getHeaderClass"
                    :cell-style="getCellClass">

            <el-table-column label="序号" type="index" align="center" width="70">
              <template slot-scope="scope">{{
                  (pagination.pageNum - 1) * pagination.size + scope.$index + 1
                }}
              </template>
            </el-table-column>

            <el-table-column align="center" v-for="col in columnList" :key="col.prop" :prop="col.prop"
                             :label="col.label" :show-overflow-tooltip="col.prop === 'earlyWarningContent' ? false:true"
                             :min-width="col.width">
              <template slot-scope="scope">

                <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                  {{ scope.row[col.prop] || "--" }}
                </div>

              </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="100" v-if="hasOperate">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small"
                           style="color: rgba(118, 214, 218,1)">查看
                </el-button>
              </template>
            </el-table-column>

            <template slot="empty">
              <img src="@/views/fullview/map2d/img/bgNone.png" alt="" srcset="" style="width: 100%">
              <span style="position: relative;top: -180px;">暂无数据</span>
            </template>

          </el-table>
          <el-pagination
              class="pagination"
              @size-change="handlePageChange"
              @current-change="handlePageChange"
              :page-size="pagination.size"
              layout="prev, pager, next, jumper"
              :total="pagination.total"
          ></el-pagination>
        </template>
        <!--  -->
        <template v-if="type==='2'">
          <div class="backHandleClickBox" @click="backHandleClick" v-if="isBack">
            <i class="el-icon-arrow-left" style="color: #17273f;font-size: 22px;font-weight: 900"></i>
          </div>
          <div class="info-show" style="transform: translateY(-20px)">
            <div class="type-label">{{ detailsInfo.projectSectionName }}</div>
            <div class="type-title">
              <span>{{ detailsInfo.earlyWarningTypeStr }}</span>
              <span class="times">{{ detailsInfo.earlyWarningTime }}</span>
            </div>
            <div class="textarea">{{ detailsInfo.content }}</div>
          </div>
        </template>
        <!--  -->
        <template v-if="type==='3'">
          <el-form class="form-table" label-width="160px" :model="formTableData" :disabled="true" size="mini">
            <el-form-item :key="item.label" :label="item.label" :style="{width: item.width}" v-for="item in formList">
              <!--            <el-input v-if="item.type==='input'" :value="formTableData[item.key]"></el-input>-->
              <el-tooltip v-if="item.type ==='input'" class="item" effect="dark"
                          :disabled="!(formTableData[item.key] && formTableData[item.key].length > 7) "
                          :content="formTableData[item.key]+''" placement="top" popper-class="popperClassAA_1">
                <div class="copyInpit">{{ formTableData[item.key] }}</div>
              </el-tooltip>

              <el-input v-if="item.type==='textarea'" type="textarea" :value="formTableData[item.key]" :rows="2"
                        resize='none'></el-input>
              <div v-if="item.type==='qrCode'" id="qrCode"></div>
            </el-form-item>
          </el-form>
        </template>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {auto} from "html-webpack-plugin/lib/chunksorter";

const defaultFormList = [
  {
    label: '项目编号',
    type: 'input',
    key: 'projectCode',
    width: '50%'
  },
  {
    label: '项目名称',
    type: 'input',
    key: 'projectName',
    width: '50%'
  },
  {
    label: '立项年度',
    type: 'input',
    key: 'approvalDate',
    width: '50%'
  },
  {
    label: '项目类型',
    type: 'input',
    key: 'projectTypeName',
    width: '50%'
  },
  {
    label: '标段编号',
    type: 'input',
    key: 'sectionCode',
    width: '50%'
  },
  {
    label: '标段名称',
    type: 'input',
    key: 'sectionName',
    width: '50%'
  },
  {
    label: '建设单位',
    type: 'input',
    key: 'projectConstructingUnit',
    width: '50%'
  },
  {
    label: '标段状态',
    type: 'input',
    key: 'status',
    width: '50%'
  },
  {
    label: '建设工期',
    type: 'input',
    key: 'constructionPeriod',
    width: '50%'
  },
  {
    label: '标段金额',
    type: 'input',
    key: 'sectionCapital',
    width: '50%'
  },
  {
    label: '合同编号',
    type: 'input',
    key: 'contractNo',
    width: '50%'
  },
  {
    label: '合同名称',
    type: 'input',
    key: 'contractName',
    width: '50%'
  },
  {
    label: '建设面积',
    type: 'input',
    key: 'area',
    width: '50%'
  },
  {
    label: '基础建设面积',
    type: 'input',
    key: 'basicsArea',
    width: '50%'
  },
  {
    label: '改造提升面积',
    type: 'input',
    key: 'liftingArea',
    width: '50%'
  },
  {
    label: '高效节水灌溉面积',
    type: 'input',
    key: 'irrigatedArea',
    width: '50%'
  },
  {
    label: '建设所在地区',
    type: 'input',
    key: 'sectionRegion',
    width: '50%'
  },
  {
    label: '建设详细地址',
    type: 'input',
    key: 'sectionAddress',
    width: '50%'
  },
  {
    label: '主要建设内容',
    type: 'textarea',
    key: 'sectionContent',
    width: '100%'
  },
  {
    label: '立项年度内容',
    type: 'textarea',
    key: 'sectionContent',
    width: '100%'
  },
  {
    label: '标段备注',
    type: 'qrCode',
    key: 'remark',
    width: '100%'
  }
]

import QRCode from 'qrcodejs2-fix'

export default {
  props: {
    isBack: {
      type: Boolean,
      default: true
    },
    weeei: {
      type: String,
      default: "",
    },
    heeeei: {
      type: String,
      default: "",
    },
    istopModel: {
      type: String,
      default: "",
    },

    initType: {
      type: String,
      default: '1'
    },
    title: {
      type: String,
      default: '预警列表'
    },
    dataInofs: {
      type: Object,
      default: () => {
      }
    },
    columnList: {
      type: Array,
      default: () => []
    },
    hasOperate: {
      type: Boolean,
      default: true
    },
    formList: {
      type: Array,
      default: () => []
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
        },
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
      ],
      formTableData: {},
      pagination: {
        total: 80,
        size: 8,
        pageNum: 1
      },
      type: 1,
      detailsInfo: {},
      // formList: defaultFormList
      scale: 1,
    }
  },
  computed: {


    getCellClass({row, column, rowIndex, columnIndex}) {
      return {
        color: '#838da4'
      }
    },
    getHeaderClass({row, column, rowIndex, columnIndex}) {
      return {
        color: '#00aaf6'
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setScale);
  },
  created() {
    // this.formList =
    this.$nextTick(() => {
      this.getQrcode()

      this.setScale()
      window.addEventListener('resize', this.setScale);
    })


  },
  watch: {
    dataInofs: {
      deep: true,
      immediate: true,
      handler(val) {
        // console.log(val, '2222')
        if (val) {

          this.pagination.total = val.total || 0
          if (val.records) this.tableData = val.records
          else this.tableData = []

          if (this.initType === '3') {
            if (val) this.formTableData = val
            else this.formTableData = {}
          }
        }
      }
    },
    initType: {
      deep: true,
      immediate: true,
      handler(val) {
        this.type = val
      }
    },
    formList: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.formList = val
        }
      }
    }
  },
  mounted() {
  },
  updated() {
  },
  methods: {
    auto,
    setScale() {
      // this.scale = window.scaleAChuandi
      // console.log(this.scale, 'this.scalethis.scale')
      // el-dialog__body
      // el-dialog
      //el-dialog--center

      // let className = document.getElementsByClassName("el-dialog");
      // let className1 = document.getElementById("el-dialog");
      // // console.log(className1)
      // console.log(className[0], 'className')
      // className[0].style.transform = `scale(${this.scale})`;
      // className1.style.setProperty('--scale', this.scale);
      // className[0].style.transform = `scale(${this.scale}) translate(-50%, -50%)!important;`;
      // console.log(className[0].style, 'className')


    },
    getScale() {
      const widthA = 1920
      const heightA = 1080

      let ww = window.innerWidth / widthA;
      let wh = window.innerHeight / heightA;
      return ww < wh ? ww : wh;
    },


    scaleDialog() {
      return `scale(${this.scale})`;
    },
    backHandleClick() {
      this.type = '1'
    },
    handleClick(row) {
      console.log('rowsjhdjkashdkshd', row)
      this.detailsInfo = row
      this.type = '2'
    },
    handlePageChange(e) {
      console.log(e)
      this.pagination.pageNum = e
      this.$emit('handleMore', e)
    },
    closeMidDialog() {
      this.$emit('closeDialog')
    },
    getQrcode() {
      if (this.type !== '3') return
      // if(item.type==='qrCode')
      document.getElementById('qrCode').innerHTML = '' //清空标签内原有数据，防止多次点击生成多个二维码
      new QRCode(document.getElementById('qrCode'), {
        text: '000000',
        colorLight: 'transparent',
        colorDark: '#3194e6',
        width: 100,
        height: 100
      })
    }
  }
}
</script>
<style scoped lang="scss">
.el-dialog__body {

}

.times {
  padding-left: 30px;
}

.ccccDament {
  //max-height: 60vh;
  overflow: auto;
  padding-bottom: 20px;
}

.copyInpit {
  font-size: 12px;
  background: #223858;
  color: #f7f8f9;
  border-radius: 5px;
  padding-left: 8px;
  height: 28px;
  white-space: nowrap; /* 禁止文本换行 */
  overflow: hidden; /* 隐藏超出部分的内容 */
  text-overflow: ellipsis; /* 当文本溢出时显示省略号 */

}


::v-deep {
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 14px;
  }


  .custom-dialog .el-dialog__body .content .el-table--border::after {
    background-color: transparent;
  }

  .top-d {
    transform: translateX(25px) scaleX(1.05);

  }

  .right-close {
    width: 32px;
    height: 32px;
  }

  .el-textarea.is-disabled .el-textarea__inner {
    cursor: default !important;
  }
}

.backHandleClickBox {
  cursor: pointer;
  width: 30px;
  height: 30px;
  background: #496999;
  position: absolute;
  top: 95px;
  left: 70px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

#el-dialog {
  --scale: 1;
}

::v-deep {
  .el-pagination__editor.el-input {
    margin: 0 10px;
  }

  .el-pagination__jump {
    color: #6d7d96;
  }

  .el-input__inner {
    border: 1px solid #6d7d96;
  }


  //.el-dialog {
  //  background-color: transparent;
  //  -webkit-box-shadow: none !important;
  //  box-shadow: none !important;
  //  position: fixed;
  //  left: 50% !important;
  //  top: 50% !important;
  //  transform: scale(var(--scale)) translate(-50%, -50%) !important;
  //}

}


//}

::v-deep {
  .form-table {
    position: relative;
    left: -22px;
  }

  //.custom-dialog .el-dialog__body .content1 .form-table {
  //  position: relative;
  //  left: -22px;
  //}
}
</style>
