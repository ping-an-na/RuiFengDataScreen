<!--
 * @Description:
 * @Author: qiyongguo
 * @Date: 2021-12-30
-->
<template>
  <div class="grid-tabs">
    <div v-for="item in firstList" :key="item.type"
         :class="['ellipsis tab', activeTab == item.type ? 'active-tab' : '']"
         :style="{marginLeft: hasSpace ? '7px' : '0px'}"
         @click="xialaTab = '';activeTab = item.type;$emit('change', item.type)">
      <span :title="item.label">{{ item.label }}</span>
    </div>
    <c-select v-if="xialaList.length" v-model="xialaTab" :class="['rect-select',xialaTab ? 'rect-select-active' : '']"
              popper-class="grid-popover" style="width: 140px" placeholder="更多"
              @change="xialaChange">
      <c-option v-for="item in xialaList" :key="item.type" :label="item.label" :value="item.type">
      </c-option>
    </c-select>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
    defaultActiveTab: {
      type: [Number, String],
      default: 1
    },
    hasSpace: {
      type: Boolean,
      default: true
    },
    moreNum: {
      type: Number,
      default: 4
    },
    hasMore: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeTab: this.defaultActiveTab || 1,
      xialaTab: ''
    }
  },
  computed: {
    firstList() {
      return this.hasMore ? this.tabs.slice(0, this.moreNum) : this.tabs
    },
    xialaList() {
      return this.hasMore ? this.tabs.slice(this.moreNum) : []
    }
  },
  methods: {
    xialaChange(val) {
      if (val) {
        this.activeTab = ''
      }
      this.$emit('change', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.grid-tabs {
  min-height: 28px;
  display: flex;
  margin-left: 4px;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  .tab {
    height: 100%;
    line-height: 28px;
    text-align: center;
    font-size: 16px;
    color: #ffffff;
    cursor: pointer;
    // max-width: 110px;
    margin: 6px;
    margin-right: 0;
    padding: 0 8px;
    background: rgba(0,130,230,0.6);
    box-shadow: inset 0px 0px 10px 0px rgba(39,192,255,0.88);
    border-radius: 4px;
    border: 1px solid #80C8FF;
    &.active-tab,&:hover {
      background: rgba(230,142,0,0.6);
      box-shadow: inset 0px 0px 10px 0px rgba(255,216,153,0.88);
      border-radius: 4px;
      border: 1px solid #FFCE80;
    }
  }
  .rect-select {
    min-width: 80px;
    margin-left: 8px;
     background-image: linear-gradient(
      180deg,
      rgba(58, 105, 153, 0.5) 1%,
      rgba(28, 78, 128, 0.64) 86%
    );
    border: 1px solid #00bbff;
    box-shadow: inset 0px 0px 8px 0px rgba(86, 180, 227, 0.3);
    border-radius: 2px;
    &.rect-select-active {
      background-image: linear-gradient(
        180deg,
        rgba(67, 141, 179, 0.8) 1%,
        rgba(45, 124, 204, 0.64) 84%
      );
      border: 1px solid #33c9ff;
      box-shadow: inset 0px 0px 8px 0px rgba(54, 201, 255, 0.5);
    }
    /deep/ {
      .c-input {
        .c-input__inner {
          background: none;
          border: none;
          height: 28px !important;
          line-height: 28px;
          font-size: 16px;
          color: #cce8ff;
          font-weight: 500;
          &::placeholder {
            font-size: 14px;
            color: #7ac3ff;
          }
        }
        .c-select__caret {
          color: #4db8ff;
          font-size: 20px;
          &.c-input__icon {
            line-height: 28px;
          }
        }
      }
      .c-cascader__tags {
        display: flex;
        align-items: center;
        right: 16px;
        .c-tag {
          font-size: 16px;
          color: #cce8ff;
          font-weight: 500;
          max-width: 70%;
          background: none;
          .c-icon-close {
            width: 18px;
            height: 18px;
            line-height: 18px;
            background: rgba(77, 184, 255, 0.3);
            color: #cce8ff;
            top: 1px;
            &:hover {
              background: rgba(19, 40, 107, 0.7);
            }
          }
          &:last-child {
            border-radius: 7px;
            background: rgba(77, 184, 255, 0.3);
            font-size: 12px;
            color: #cce8ff;
            height: 14px;
            line-height: 14px;
          }
        }
      }
      .c-input__icon {
        font-size: 20px;
        color: #4db8ff;
      }
      .c-icon-arrow-down {
        &:before {
          content: '\e790';
        }
      }
    }
  }
}
</style>
