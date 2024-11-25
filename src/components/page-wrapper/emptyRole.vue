<!--
@Author: lism
@Description: 空白页面+切角色页面
@Date: 2023-12-26
-->
<template>
  <div class="empty-page">
    <select-org-role-dialog :visible.sync="showSelectOrgRole" from="login" :next-url="nextUrl" />
  </div>
</template>

<script>
import selectOrgRoleDialog from '@/components/page-wrapper/selectOrgRoleDialog'
import { mapGetters } from 'vuex'
export default {
  name: '',
  components: { selectOrgRoleDialog },
  data() {
    return {
      showSelectOrgRole: false,
      nextUrl: '/',
      redirect: '/'
    }
  },
  computed: {
    ...mapGetters(['orgRoleList'])
  },
  watch: {
    orgRoleList: {
      deep: true,
      immediate: true,
      handler(nVal) {
        if (nVal.length <= 1) {
          // 不用选择机构角色
          this.$router.push({ path: this.redirect || '/' })
        } else {
          this.nextUrl = this.redirect || '/'
          this.showSelectOrgRole = true
        }
      }
    }

  }
}
</script>

  <style scoped lang="scss">
  .empty-page {
    height: 100%;
  }
  </style>
