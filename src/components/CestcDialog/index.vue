<template>
    <c-dialog v-bind="$attrs" class="cestc-dialog" :modal="true" append-to-body :close-on-click-modal="false" v-on="$listeners">
        <slot />
        <div v-if="$slots.footer" class="footer">
            <slot name="footer" />
        </div>
        <div v-else class="footer">
            <c-button @click.stop="_cancle">取消</c-button>
            <c-button type="primary" @click.stop="_confirm">确认</c-button>
        </div>
    </c-dialog>
</template>

<script>
export default {
    data() {
        return {
            levelList: null
        }
    },
    watch: {},
    created() {},
    methods: {
        _cancle() {
            this.$emit('cancle')
        },
        _confirm() {
            this.$emit('confirm')
        }
    }
}
</script>

<style lang="scss" scoped>
.cestc-dialog {
    .footer {
        text-align: right;
    }
}
</style>
