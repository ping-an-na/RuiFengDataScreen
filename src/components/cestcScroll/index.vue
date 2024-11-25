<template>
    <div class="cestc-scroll" ref="cestc-scroll">
        <div :class="['cestc-scroll__ul', domClassName]" ref="cestc-scroll__content">
            <slot />
            <template v-if="isScroll">
                <slot />
            </template>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CestcScroll',
    props: {
        data: {
            type: Array,
            default: () => []
        },
        rollSpeed: {
            type: Number,
            default: 26
        }
    },
    data() {
        return {
            domClassName: `scroll${new Date().getTime()}`,
            isScroll: false
        }
    },
    watch: {
        data: {
            deep: true,
            immediate: true,
            handler: async function (val) {
                await this.$nextTick(() => {})

                try {
                    const scrollHeight = this.$refs['cestc-scroll__content'].offsetHeight
                    const curHeight = this.$refs['cestc-scroll'].offsetHeight
                    const isScroll = scrollHeight > curHeight
                    this.isScroll = isScroll
                    this.runRoll(val, scrollHeight)
                } catch (e) {
                    console.log('滚动error', e)
                }
            }
        }
    },
    methods: {
        runRoll(val, scrollHeight) {
            if (this.isScroll) {
                this.$nextTick(() => {
                    const time = Math.floor(scrollHeight / this.rollSpeed)
                    this.roll(scrollHeight / 2, time)
                })
            } else {
                const dom = document.querySelector(`.${this.domClassName}`)
                if (dom) {
                    dom.setAttribute('style', `animation: none;`)
                }
            }
        },
        roll(top, time) {
            const dom = document.querySelector(`.${this.domClassName}`)
            dom.setAttribute('style', `animation: rollTop ${time}s linear infinite;`)
            const runkeyframes = `@keyframes rollTop{
        100%{
          transform: translate(0px, -${top}px);
        }
      }`

            const style = document.createElement('style')
            style.setAttribute('type', 'text/css')
            document.head.appendChild(style)
            const sheet = style.sheet
            sheet.insertRule(runkeyframes, 0)
        }
    }
}
</script>

<style lang="scss" scoped>
.cestc-scroll {
    height: 100%;
    .cestc-scroll__ul {
        &:hover {
            animation-play-state: paused !important;
        }
    }
}
</style>
