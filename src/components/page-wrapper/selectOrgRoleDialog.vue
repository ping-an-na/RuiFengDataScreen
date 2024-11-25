<template>
  <c-dialog
    title="选择角色"
    v-bind="$attrs"
    top="25vh"
    append-to-body
    custom-class="select-org-role-wrapper"
    :close-on-click-modal="false"
    v-on="$listeners"
  >
    <div class="select-org-role">
      <div
        v-for="(item) in filteredOrgRoleList"
        :key="item.id"
        class="org-role-item"
        :class="{'selected': item.id === selectedOrgRole.id}"
        @click="switchOrgRole(item)"
      >
        {{ item.org.ancestors }} - {{ item.role.name }}
      </div>
    </div>
  </c-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    nextUrl: {
      type: String,
      default: ''
    },
    from: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['orgRoleList', 'selectedOrgRole']),
    filteredOrgRoleList() {
      return this.orgRoleList.filter(item => !!item?.role?.id)
    }
  },

  methods: {
    async switchOrgRole(item) {
      // 当前已选的不可点击
      // 当前已选的不可点击
      if (item.id === this.selectedOrgRole.id) {
        if (this.$route.path === '/empty-role') {
          this.$router.push('/')
        } else {
          window.location.reload()
        }
        return
      }

      await this.$store.dispatch('user/switchOrgRole', item)
      if (this.from === 'login') {
        this.$router.push(this.nextUrl || '/')
      } else {
        window.location.reload()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.select-org-role-wrapper {
  ::v-deep {
    & {
      min-width: 450px;
      max-width: 50%;
    }
  }
  .select-org-role {
    height: 300px;
    padding: 20px 0;
    overflow: auto;
    .org-role-item {
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      padding-left: 10px;
      user-select: none;
      color: #4B4B4B;
      white-space: nowrap;
      &:hover {
        background: #F9FAFE;
        color: #36A4FF;
        cursor: pointer;
      }
      &.selected {
        color: #36A4FF;
      }
    }
  }
}
</style>

<style lang="scss">
.select-org-role-wrapper {
  border-radius: 10px 10px 0 0;
  width: fit-content;
  min-width: 450px;
  max-width: 50%;
  .c-dialog__header {
    background-image: linear-gradient(135deg, #78C2FF 0%, #36A4FF 100%);
    border-radius: 10px 10px 0 0;
    .c-dialog__title {
      font-size: 16px;
      color: #FFFFFF;
      font-weight: bold;
    }
    .c-dialog__close {
      color: #FFFFFF;
    }
  }
}
</style>
