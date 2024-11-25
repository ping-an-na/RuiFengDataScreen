<!--
@Author: lism
@Description: 区域说明
@Date: 2024-
-->
<template>
  <div :class="showFlag?'card-wrapper':'card-wrapperA'" style="transition: all 0.5s;overflow: hidden">
    <div class="top">
      <div v-if="showFlag" class="title">区域说明：</div>
      <div class="action" style="display: flex;display: flex;justify-content: center;align-items: center">
        <div v-if="!showFlag">图例：</div>
        <el-switch v-model="showFlag" @change="changeSwitch"/>
      </div>
    </div>
    <ul class="list" v-if="showFlag">
      <li class="list-item">
        <img :src="getImgPath(1)" alt srcset style="width: 20px;height: 20px;"/>
        <span class="name">立项</span>
      </li>
      <li class="list-item">
        <img :src="getImgPath(2)" alt srcset style="width: 20px;height: 20px;"/>
        <span class="name">在建</span>
      </li>
      <li class="list-item">
        <img :src="getImgPath(3)" alt srcset style="width: 20px;height: 20px;"/>
        <span class="name">验收</span>
      </li>
    </ul>
  </div>

</template>

<script>
import {ProjectStatus} from './map-constant'

export default {
  props: {
    districtTipShowFlag: {
      type: Boolean,
      default: false
    },

    // @districtTipShowFlagEvent="districtTipShowFlagEvent" :districtTipShowFlag="districtTipShowFlag"
  },
  data() {
    return {
      showFlag: true
    }
  },
  watch: {
    districtTipShowFlag: {
      handler(nVal) {
        this.showFlag = nVal
      },
      immediate: true
    }
  },
  methods: {
    changeSwitch(e) {
      // console.log(e)
      this.$emit('districtTipShowFlagEvent', e)
    },
    getImgPath(type) {
      return ProjectStatus[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.card-wrapperA {
  position: absolute;
  left: 450px;
  bottom: 335px;
  padding: 10px;
  color: #fff;
  background-color: rgba(33, 41, 27, 0.85);
  border: 1px solid #79abc6;
  border-radius: 6px;
  width: 114px;
  height: 44px;

}

.card-wrapper {
  position: absolute;
  left: 450px;
  bottom: 335px;
  height: 80px;
  width: 250px;
  padding: 10px;
  color: #fff;
  background-color: rgba(33, 41, 27, 0.85);
  border: 1px solid #79abc6;

  .top {
    display: flex;

    .action {
      margin-left: auto;
    }
  }

  .list {
    display: flex;
    margin-top: 10px;
    height: 32px;
    align-items: center;
    background-color: #1f3962;

    .list-item {
      width: 33.3%;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;

      .name {
        margin-left: 5px;
      }
    }
  }
}
</style>
