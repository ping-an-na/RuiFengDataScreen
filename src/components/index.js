import CestcDialog from './CestcDialog'
import eyeBtn from './eyeBtn.vue'
import CestcEllipsis from './CestcEllipsis'
import CestcEmpty from './CestcEmpty'
import RichText from './quill'
import CommonPageList from './layout/commonPageList'
import TopTitleModle from './topTitleModle'
import CestcScroll from './cestcScroll'

export default {
    install: function (Vue) {
        Vue.component('CestcDialog', CestcDialog)
        Vue.component('eyeBtn', eyeBtn)
        Vue.component('CestcEllipsis', CestcEllipsis)
        Vue.component('CestcEmpty', CestcEmpty)
        Vue.component('CommonPageList', CommonPageList)
        Vue.component('TopTitleModle', TopTitleModle)
        Vue.component('RichText', RichText)
        Vue.component('CestcScroll', CestcScroll)
    }
}
