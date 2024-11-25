<template>
  <div class="m-steps-area">
    <div class="m-steps">
      <div
          :class="
            [
                'm-steps-item',
                {
                  'finished': sectionVO[item.code],
                  'middle-wait': !sectionVO[item.code],
                },

            ]"
          style="display: flex;flex-flow: column;align-items: center"
          v-for="(item,n) in totalSteps"
          :key="n"
          @click="onChange(n)"
      >
        <!--        未完成 1-->
        <div class="m-steps-icon">
          <!-- <span class="u-icon" v-if="current<=n">{{ n }}</span> -->
          <!-- <span class="el-icon-check u-icon" v-else></span> -->
        </div>
        <div class="m-steps-content" style="
                display: flex;
                flex-flow: column;
                align-items: center;
            ">
          <div class="u-steps-title" :class="{'u-steps-titleA':n === 0,'u-steps-titleB':n === 3}">
            <img src="@/assets/agriculture/process1.png" style="margin-left: 2px;" v-if="sectionVO[item.code]"/>
            <img src="@/assets/agriculture/process2.png" style="margin-left: 2px;" v-else/>
          </div>
          <!-- stepsDesc[n-1] -->
          <div class="u-steps-description">{{ item.name }}</div>
          <div class="u-steps-time">{{ sectionVO[item.code] }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'aSteps',
  props: {
    stepsLabel: {
      // 步骤title数组
      type: Array,
      default: () => {
        return []
      }
    },
    stepsDesc: {
      // 步骤description数组
      type: Array,
      default: () => {
        return []
      }
    },
    // totalSteps: {
    //   // 总的步骤数
    //   type: Number,
    //   default: 4
    // },
    currentStep: {
      // 当前选中的步骤
      type: Number,
      default: 1
    },
    sectionVO: {
      type: Object,
      default: {}
    },

  },
  data() {
    return {
      // 若当前选中步骤超过总步骤数，则默认选择步骤1
      current: this.currentStep > this.totalSteps ? 1 : this.currentStep,
      totalSteps: [
        {name: '项目立项', code: 'approvalDate'},
        {name: '项目开工', code: 'constructionDate'},
        {name: '完工确认', code: 'completeDate'},
        {name: '竣工验收', code: 'finishDate'},
      ]
    }
  },
  methods: {
    onChange(index) {
      // 点击切换选择步骤
      //console.log('index:', index)
      // if (this.current !== index) {
      //   this.current = index
      //   this.$emit('change', index)
      // }
    }
  }
}
</script>
<style lang="scss" scoped>
$steps-color: #03b955;

.m-steps-iconA {
  background: url('~@/assets/agriculture/zu_3175@_2x.png') no-repeat;
  background-size: 100% 100%;

  .u-icon {
  }
}

.m-steps-iconB {
  background: url('~@/assets/agriculture/zu3204@2x3.png') no-repeat;
  background-size: 100% 100%;

  .u-icon {
    color: rgba(0, 0, 0, 0.25);
  }
}


.m-steps-area {
  width: 100%;
  margin: 0px auto;

  .m-steps {
    padding-top: 10px;
    display: flex;

    .m-steps-itemA {
      align-items: center;
    }

    .m-steps-item {
      display: inline-block;
      flex: 1; // 弹性盒模型对象的子元素都有相同的长度，且忽略它们内部的内容
      flex-wrap: nowrap;
      white-space: nowrap;
      overflow: hidden;
      font-size: 16px;
      line-height: 32px;
      align-items: center;

      .m-steps-icon {
        // display: inline-block;
        // margin-right: 8px;
        width: 92px;
        height: 74px;
        text-align: center;
      }

      .m-steps-content {
        .u-steps-title {
          position: relative;
          display: inline-block;
          //margin-left: 26px;

          > img {
            width: 14px;
            height: 14px;
          }
        }

        .u-steps-description {
          font-family: Source Han Sans CN;
          font-weight: 500;
          font-size: 16px;
          color: #30cff7;
          //line-height: 20px;

        }

        .u-steps-time {
          font-family: Source Han Sans CN;
          font-weight: 400;
          font-size: 14px;
          color: #93a5bd;
          margin-top: 4px;
          line-height: 13px;
        }
      }
    }

    .finished {
      // margin-right: 16px;

      .m-steps-icon {
        background: url('~@/assets/agriculture/zu_3175@_2x.png') no-repeat;
        background-size: 100% 100%;

        .u-icon {
        }
      }

      .m-steps-content {
        .u-steps-title {
          > img {
            width: 14px;
            height: 14px;
          }
          &:after {
            position: absolute;
            top: 13px;
            left: 100%;
            display: block;
            width: 100px;
            content: '';
            border: 1px dashed #1afcff;
          }
          &:before {
            position: absolute;
            top: 13px;
            left: -100px;
            display: block;
            width: 100px;
            // height: 1px;
            content: '';
            border: 1px dashed #1afcff;
          }
        }
        .u-steps-titleA{
          &:before {
            display: none;
          }
        }
        .u-steps-titleB{
          &:after {
            display: none;
          }
        }

        .u-steps-description {
          font-family: Source Han Sans CN;
          font-weight: 500;
          font-size: 16px;
          color: #30cff7;
        }
      }
    }

    .process {
      // margin-right: 16px;
      .m-steps-icon {
        background: url('~@/assets/agriculture/zu_3175@_2x.png') no-repeat;
        background-size: 100% 100%;
        // background: $steps-color;
        // border: 1px solid rgba(0, 0, 0, 0.25);
        // border-color: $steps-color;
        .u-icon {
          color: #fff;
        }
      }

      .m-steps-content {
        .u-steps-title {
          //margin-left: 26px;

          > img {
            width: 14px;
            height: 14px;
          }

          &:after {
            position: absolute;
            top: 13px;
            left: 100%;
            display: block;
            width: 9999px;
            // height: 1px;
            content: '';
            border: 0.5px dashed #1afcff;
          }
        }

        .u-steps-description {
          // font-family: Source Han Sans CN;
          // font-weight: 500;
          // font-size: 16px;
          // color: #93a5bd;
        }
      }
    }

    .last-process {
      margin-right: 0;

      .m-steps-icon {
        background: $steps-color;
        border: 1px solid rgba(0, 0, 0, 0.25);
        border-color: $steps-color;

        .u-icon {
          color: #fff;
        }
      }

      .m-steps-content {
        .u-steps-title {
          //margin-left: 26px;

          > img {
            width: 14px;
            height: 14px;
          }
        }

        .u-steps-description {
          font-family: Source Han Sans CN;
          font-weight: 500;
          font-size: 16px;
          color: #93a5bd;
        }
      }
    }

    .middle-wait {
      // margin-right: 16px;

      .m-steps-icon {
        background: url('~@/assets/agriculture/zu3204@2x3.png') no-repeat;
        background-size: 100% 100%;

        .u-icon {
          color: rgba(0, 0, 0, 0.25);
        }
      }

      .m-steps-content {
        .u-steps-title {
          &:after {
            position: absolute;
            top: 13px;
            left: 100%;
            display: block;
            width: 100px;
            content: '';
            border: 1px dashed #93a5bd;
          }
          &:before {
            position: absolute;
            top: 13px;
            left: -100px;
            display: block;
            width: 100px;
            // height: 1px;
            content: '';
            border: 1px dashed #93a5bd;
          }
        }
        .u-steps-titleA{
          &:before {
            display: none;
          }
        }
        .u-steps-titleB{
          &:after {
            display: none;
          }
        }

        .u-steps-description {
          font-family: Source Han Sans CN;
          font-weight: 500;
          font-size: 16px;
          color: #93a5bd;
        }
      }
    }

    .last-wait {
      margin-right: 0;
      // cursor: pointer;

      .m-steps-icon {
        background: url('~@/assets/agriculture/zu3204@2x3.png') no-repeat;
        background-size: 100% 100%;

        .u-icon {
          color: rgba(0, 0, 0, 0.25);
        }
      }

      .m-steps-content {
        .u-steps-title {
          //margin-left: 40px;

          &:before {
            position: absolute;
            top: 13px;
            left: -200px;
            display: block;
            width: 200px;
            // height: 1px;
            content: '';
            border: 1px dashed #1afcff;
          }
        }

        .u-steps-description {
          font-family: Source Han Sans CN;
          font-weight: 500;
          font-size: 16px;
          color: #93a5bd;
        }
      }
    }
  }
}
</style>

