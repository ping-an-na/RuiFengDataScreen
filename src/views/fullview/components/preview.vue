<template>
  <div class="office-preview">
    <div class="header flex flex-h flex-a-c flex-j-b">
      <div class="title ellipsis">文件预览{{ fileName }}</div>
      <div class="pic-btn pic-btn-close" @click="$emit('update:visible', false)"></div>
    </div>
    <!-- img预览 -->
    <div v-if="fileType === 'img'" class="img-p">
      <img style="max-width: 100%;max-height: 100%" :src="previewUrl" alt="">
    </div>
    <!-- pdf预览 -->
    <div v-else-if="fileType === 'pdf'">
      <div v-if="pdfData.pageCount > 1">
        <c-button type="primary" size="mini" icon="c-icon-arrow-left" @click="changePdfPage(0)" />
        <span style="font-size: 14px;font-weight: 550;margin: 0 10px">{{ pdfData.currentPage }} / {{ pdfData.pageCount }}</span>
        <c-button type="primary" size="mini" icon="c-icon-arrow-right" @click="changePdfPage(1)" />
      </div>
      <div style="margin-top: 5px;overflow:auto;width:100%;height:calc(100% - 20px)">
        <pdf
          :src="pdfData.src"
          :page="pdfData.currentPage"
          @num-pages="pdfData.pageCount = $event"
          @page-loaded="pdfData.currentPage = $event"
        />
      </div>
    </div>
    <!-- office等文档不预览 -->
    <div v-else>
      文件格式暂不支持doc,docx,xlsx,xls文件预览
    </div>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
import { getToken } from '@/utils/auth'
import baseUrlMap from '@/utils/config'

const token = getToken()
export default {
  name: 'Preview',
  components: {
    pdf
  },
  props: {
    previewUrl: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      // pdf数据
      pdfData: {
        // 当前页
        currentPage: 1,
        // pdf文件总页数
        pageCount: 0,
        //
        src: ''
      },
      // 空文件提示信息
      emptyTips: '暂无内容',
      imgUrl: null
    }
  },
  computed: {
    // 文件类型
    fileType() {
      return this.getFileTypeByUrl(this.previewUrl)
    },
    fileName() {
      const arr = this.previewUrl.split('/')// 取到文件路径开始到最后一个点的长度
      const fileName = arr.splice(-1)[0]
      return fileName
    }
  },
  watch: {
    previewUrl(val) {
      if (this.getFileTypeByUrl(val) === 'pdf') this.initPdf()
    }
  },

  methods: {
    /**
     * 切换pdf显示页
     * @param command
     */
    changePdfPage(command) {
      if (command === 0) {
        if (this.pdfData.currentPage > 1) {
          this.pdfData.currentPage--
        }
      } else if (command === 1) {
        if (this.pdfData.currentPage < this.pdfData.pageCount) {
          this.pdfData.currentPage++
        }
      }
    },
    /**
     * 获取文件类型
     * @return {string}
     */
    getFileTypeByUrl(url) {
      const arr = url.split('.')
      const suffixName = arr[arr.length - 1].toLowerCase()
      if (suffixName === 'pdf') return 'pdf'
      if (['png', 'jpeg', 'jpg', 'gif', 'svg'].includes(suffixName)) return 'img'
    },
    /**
     * pdf预览
     */
    initPdf() {
      try {
        // 加载
        const _this = this
        const url = this.previewUrl.split('/oss')
        const xhr = new XMLHttpRequest()
        const joinUrl = `${baseUrlMap.upload}/oss${url[1]}`
        xhr.open('get', joinUrl, true)
        xhr.setRequestHeader('Authorization', token)
        xhr.responseType = 'blob'
        xhr.onload = function() {
          if (xhr.status === 200) {
            _this.pdfData.src = _this.getObjectURL(xhr.response)
          } else if (xhr.status === 404) {
            _this.$error({ message: '文件不存在' })
          } else {
            _this.$error({ message: '读取服务器文档异常' })
          }
        }
        xhr.onerror = function() {
          _this.$error({ message: '访问服务器异常，请检查访问链接是否正常' })
        }
        xhr.send()
      } catch (e) {
        console.log(e)
      }
    },
    /**
     * 将返回的流数据转换为url
     * @param file 文件流
     */
    getObjectURL(file) {
      let url = null
      if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.webkitURL !== undefined) { // webkit or chrome
        try {
          url = window.webkitURL.createObjectURL(file)
        } catch (error) {
          console.log(error)
        }
      } else if (window.URL !== undefined) { // mozilla(firefox)
        try {
          url = window.URL.createObjectURL(file)
        } catch (error) {
          console.log(error)
        }
      }
      return url
    }
  }
}
</script>

<style lang="scss" scoped>
.office-preview {
  width: 100%;
  height: 100%;
  .title {
    width: calc(100% - 60px);
    font-size: 22px;
    font-family: YouSheBiaoTiHei;
    color: #E1E9FF;
    line-height: 29px;
    text-shadow: 0px 3px 5px rgba(0,0,0,0.5);
  }
  .img-p {
    display: flex;
    align-items: center;
    justify-content: center;
    height:calc(100% - 40px);;
  }
  .title-second {
    font-size: 14px;
    color: #E1E9FF;
    line-height: 29px;
    text-shadow: 0px 3px 5px rgba(0,0,0,0.5);
  }
}
</style>
