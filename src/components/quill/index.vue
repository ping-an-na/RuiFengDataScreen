<template>
    <div class="local-quill-editor">
        <c-upload
            v-if="type === 'url'"
            ref="upload"
            :action="uploadUrl"
            :before-upload="handleBeforeUpload"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            name="file"
            :show-file-list="false"
            :headers="headers"
            class="upload-resource"
            style="display: none"
        />
        <quill-editor ref="QuillEditor" v-model="content" :options="editorOption" class="editor" @blur="onEditorBlur" @focus="onEditorFocus" @change="onEditorChange" />
    </div>
</template>

<script>
// 引入样式和quillEditor
// import moduleSrv from '@/api/interviewTask'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { Quill, quillEditor } from 'vue-quill-editor'
import { getToken } from '@/utils/auth'

// 自定义字体大小
const Size = Quill.import('attributors/style/size')
const fontSize = ['14px', '10px', '12px', '16px', '18px', '20px', '30px', '32px']
Size.whitelist = fontSize
Quill.register(Size, true)

// 自定义字体类型
const fontFamily = ['Microsoft-YaHei', 'SimSun', 'SimHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif']
Quill.imports['formats/font'].whitelist = fontFamily
Quill.register(Quill.imports['formats/font'])

// 工具栏配置项
const toolbarOptions = [
    // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
    ['bold', 'italic', 'underline', 'strike'],
    // 引用  代码块-----['blockquote', 'code-block']
    ['blockquote', 'code-block'],
    // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
    [{ header: 1 }, { header: 2 }],
    // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
    [{ list: 'ordered' }, { list: 'bullet' }],
    // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
    // [{ script: 'sub' }, { script: 'super' }],
    // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
    [{ indent: '-1' }, { indent: '+1' }],
    // 文本方向-----[{'direction': 'rtl'}]
    // [{ direction: 'rtl' }],
    // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
    [{ size: fontSize }],
    // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
    // [{ header: [1, 2, 3, 4, 5, 6, false] }],
    // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
    [{ color: [] }],
    // 字体种类-----[{ font: [] }]
    [{ font: fontFamily }],
    // 对齐方式-----[{ align: [] }]
    [{ align: [] }],
    // 清除文本格式-----['clean']
    ['clean'],
    // 链接、图片、视频-----['link', 'image', 'video']
    ['image']
]

export default {
    name: 'LocalQuillEditor',
    // 注册 quillEditor
    components: {
        quillEditor
    },
    props: {
        backfillContext: {
            type: Object,
            default: () => {}
        },
        disabled: {
            type: Boolean,
            default: false
        },
        /* 类型（base64格式、url格式） */
        type: {
            type: String,
            default: 'url'
        }
    },
    data() {
        return {
            uploadUrl: '',
            headers: {
                Authorization: getToken()
            },
            content: '',
            editorOption: {
                modules: {
                    toolbar: {
                        container: toolbarOptions,
                        handlers: {
                            image: function (value) {
                                if (value) {
                                    // 调用iview图片上传
                                    document.querySelector('.upload-resource .el-upload').click()
                                } else {
                                    Quill.format('image', false)
                                }
                            }
                        }
                    }
                },
                theme: 'snow',
                placeholder: '请输入正文'
                // Some Quill optiosn...
            }
        }
    },
    watch: {
        backfillContext: {
            handler(val) {
                if (val) {
                    this.content = val.context
                }
            },
            immediate: true
        }
    },
    methods: {
        // 失去焦点事件
        onEditorBlur(e) {
            console.log('onEditorBlur: ', this.content)
            this.$emit('setContent', this.content)
        },
        // 获得焦点事件
        onEditorFocus(event) {
            console.log('onEditorFocus: ', event)
            if (this.disabled) {
                event.enable(false)
            }
        },
        // 内容改变事件
        onEditorChange(e) {
            console.log('onEditorChange: ', e)
            this.$emit('setContent', e)
        },
        // 上传前校检格式和大小
        handleBeforeUpload(file) {
            // 校检文件大小
            if (this.fileSize) {
                const isLt = file.size / 1024 / 1024 < this.fileSize
                if (!isLt) {
                    this.$message.error(`上传文件大小不能超过 ${this.fileSize} MB!`)
                    return false
                }
            }
            return true
        },
        handleUploadSuccess(res, file) {
            // 获取富文本组件实例
            const quill = this.$refs.QuillEditor.quill
            // 如果上传成功
            if (res.code === 0) {
                // 获取光标所在位置
                const length = quill.getSelection().index
                // 插入图片  res.url为服务器返回的图片地址
                quill.insertEmbed(length, 'image', res.data.url)
                // 调整光标到最后
                quill.setSelection(length + 1)
            } else {
                this.$message.error('图片插入失败')
            }
        },
        handleUploadError() {
            this.$message.error('图片插入失败')
        }
    }
}
</script>

<style scoped lang="scss">
.editor {
    height: 316px;
}
.local-quill-editor {
    ::v-deep {
        .SizeTiShi {
            font-size: 12px;
            color: #999999;
            text-align: right;
            /* margin-right: 20px; */
            margin-top: 60px;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item::before {
            content: '14px' !important;
            font-size: 14px;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='10px']::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='10px']::before {
            content: '10px' !important;
            font-size: 10px;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='12px']::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='12px']::before {
            content: '12px' !important;
            font-size: 12px;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='14px']::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='14px']::before {
            content: '14px' !important;
            font-size: 14px;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='16px']::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='16px']::before {
            content: '16px' !important;
            font-size: 16px;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='18px']::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='18px']::before {
            content: '18px' !important;
            font-size: 18px;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='20px']::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='20px']::before {
            content: '20px' !important;
            font-size: 20px;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='30px']::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='30px']::before {
            content: '30px' !important;
            font-size: 30px;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='32px']::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='32px']::before {
            content: '32px' !important;
            font-size: 32px;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='SimSun']::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='SimSun']::before {
            content: '宋体' !important;
            font-family: 'SimSun';
        }

        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='SimHei']::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='SimHei']::before {
            content: '黑体' !important;
            font-family: 'SimHei';
        }

        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='Microsoft-YaHei']::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='Microsoft-YaHei']::before {
            content: '微软雅黑' !important; //Microsoft-YaHei
            font-family: 'Microsoft YaHei';
        }

        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='KaiTi']::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='KaiTi']::before {
            content: '楷体' !important;
            font-family: 'KaiTi';
        }

        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='FangSong']::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='FangSong']::before {
            content: '仿宋' !important;
            font-family: 'FangSong';
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='Arial']::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='Arial']::before {
            content: 'Arial' !important;
            font-family: 'Arial';
        }

        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='Times-New-Roman']::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='Times-New-Roman']::before {
            content: 'Times New Roman' !important;
            font-family: 'Times New Roman';
        }

        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='sans-serif']::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='sans-serif']::before {
            content: 'sans-serif' !important;
            font-family: 'sans-serif';
        }

        .ql-font-SimSun {
            font-family: 'SimSun';
        }

        .ql-font-SimHei {
            font-family: 'SimHei';
        }

        .ql-font-Microsoft-YaHei {
            font-family: 'Microsoft YaHei';
        }

        .ql-font-FangSong {
            font-family: 'FangSong';
        }

        .ql-font-Arial {
            font-family: 'Arial';
        }

        .ql-font-Times-New-Roman {
            font-family: 'Times New Roman';
        }

        .ql-font-sans-serif {
            font-family: 'sans-serif';
        }
    }
}
[data-theme='dark-theme'] {
    .local-quill-editor {
        ::v-deep {
            .ql-snow .ql-picker {
                color: #ffffff;
            }
            .ql-stroke {
                stroke: #ffffff;
            }
            .ql-fill {
                fill: #ffffff;
            }
            .ql-picker-options {
                background: linear-gradient(0deg, #00404d 0%, #053c58 100%);
            }
            .ql-container {
                color: #ffffff;
            }
        }
    }
}
</style>
