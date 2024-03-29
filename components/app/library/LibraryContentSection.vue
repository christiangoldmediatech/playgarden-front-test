<template>
  <v-row
    class="content-section"
    :class="{
      'app-bar-height': !Boolean(heightOverride),
      'overridden-height': Boolean(heightOverride)
    }"
    :style="{ '--max-height': maxHeight }"
  >
    <v-col class="content-column" cols="12" lg="9">
      <div class="section-title text-xl-h4 text-lg-h5">
        {{ titles.columnA }}
      </div>
      <slot name="columnA" />
    </v-col>
    <v-col class="content-column additional-info-column" cols="12" lg="3">
      <div class="section-title text-xl-h4 text-lg-h5">
        {{ titles.columnB }}
      </div>

      <div ref="scrollableContent" class="additional-info-content">
        <slot name="columnB" />
      </div>

      <div class="additional-info-fade" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, onMounted, onUnmounted, ref } from '@nuxtjs/composition-api'
import { useVuetifyHelper, useWindowDimensions } from '@/composables'
import { debounce } from 'lodash'

export type ColumnTitles = {
  columnA: string
  columnB: string
}

export default defineComponent({
  name: 'LibraryContentSection',

  props: {
    titles: {
      type: Object as PropType<ColumnTitles>,
      required: true
    },

    heightOverride: {
      type: String,
      required: false,
      default: ''
    }
  },
  emits: ['scroll:last-reached'],
  setup(props, { emit }) {
    const { APP_BAR_HEIGHT } = useWindowDimensions()
    const vuetify = useVuetifyHelper()
    const columnIsHorizontal = computed(() => vuetify.breakpoint.mdAndDown)
    const scrollableContent = ref<HTMLDivElement | null>(null)

    const maxHeight = computed(() => {
      if (props.heightOverride) {
        return props.heightOverride
      }
      return `${APP_BAR_HEIGHT}px`
    })

    const handleLastReached = debounce(() => {
      emit('scroll:last-reached')
    }, 100)

    const handleScroll = () => {
      const element = scrollableContent.value
      if (!columnIsHorizontal.value) {
        if (element!.scrollTop + element!.clientHeight >= element!.scrollHeight) {
          handleLastReached()
        }
        return
      }

      if (element!.scrollLeft + element!.clientWidth >= element!.scrollWidth) {
        handleLastReached()
      }
    }

    onMounted(() => {
      scrollableContent.value?.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      scrollableContent.value?.removeEventListener('scroll', handleScroll)
    })

    return {
      maxHeight,
      scrollableContent
    }
  }
})
</script>

<style lang="scss" scoped>
.row.content-section {
  &.app-bar-height {
    @media screen and (min-width: 1264px) {
      height: calc(100vh - var(--max-height));
      max-height: calc(100vh - var(---max-height));
    }
  }

  &.overridden-height {
    @media screen and (min-width: 1264px) {
      height: var(--max-height);
      max-height: var(--max-height);
    }
  }

  .content-column {
    position: relative;
    padding-top: 33px;
    max-width: 100%;
    overflow: hidden;

    @media screen and (min-width: 1264px) {
      padding-top: 60px;
      max-height: 100%;
    }

    .section-title {
      position: absolute;
      top: 0;
      color: #606060;
      font-weight: 700;
      font-size: 14px;
      line-height: 1.5;

      @media screen and (min-width: 1264px) {
        font-size: 30px;
      }
    }
  }

  .additional-info-column {
    .additional-info-fade {
      position: absolute;
      background: transparent;
      width: 100%;
      height: 100%;
      box-shadow: inset -50px 0px 25px -18px #FFFFFF;
      pointer-events: none;
      @media screen and (max-width: 1263px) {
        top: 0px;
        left: 0px;
      }
      @media screen and (min-width: 1264px) {
        top: 0;
        box-shadow: inset 0px -64px 32px -24px #FFFFFF;
      }
    }

    .additional-info-content {
      display: flex;
      padding-right: 64px;
      flex-wrap: nowrap;
      overflow: scroll;
      -ms-overflow-style: none;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }

      @media screen and (min-width: 1264px) {
        max-height: 100%;
        flex-direction: column;
        padding-right: 0px;
        padding-bottom: 64px;
      }
    }
  }
}
</style>
