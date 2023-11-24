<template>
  <v-hover #default="{ hover }">
    <v-sheet
      class="category-video-card clickable"
      :color="backgroundColorRGBA"
      elevation="0"
      @click="goToLibraryCategoryPage"
    >
      <div class="left-column">
        <div class="title-text mt-1 mt-lg-0">
          {{ name }}
        </div>

        <div class="description-text mb-1 mb-lg-3">
          {{ description }}
        </div>

        <div class="progress">
          <div class="progress-icon">
            <img src="@/assets/svg/library/category-star.svg">
          </div>

          <div class="progress-text ml-2 mr-3">
            {{ finishedActivities.length }} / {{ playlist.length }}
          </div>

          <div class="progress-bar pr-lg-3">
            <v-progress-linear :value="progress" height="10" rounded v-bind="{ color }" />
          </div>
        </div>
      </div>

      <div class="right-column">
        <div class="icon-section" :class="{ 'icon-section-scaled': hover }" :style="{ '--borderColor': color }">
          <img :src="icon">
          <div class="start-text">
            {{ $t('videoLibrary.start') }}
          </div>
        </div>
      </div>
    </v-sheet>
  </v-hover>
</template>

<script lang="ts">
import { defineComponent, PropType, useRouter, computed } from '@nuxtjs/composition-api'
import { hexToRgb } from '@/utils/colorTools'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'

export default defineComponent({
  name: 'CategoryVideoCard',

  props: {
    id: {
      type: Number,
      required: true
    },

    color: {
      type: String,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    icon: {
      type: String,
      required: true
    },

    playlist: {
      type: Array as PropType<MediaObject[]>,
      required: false,
      default: () => []
    }
  },

  setup(props) {
    const router = useRouter()

    const backgroundColorRGBA = computed(() => {
      return `rgba(${hexToRgb(props.color.substring(1))}, 0.6125)`
    })

    const finishedActivities = computed(() => {
      return props.playlist.filter(mediaObject => Boolean(mediaObject.meta?.watched || mediaObject.meta?.viewed?.completed))
    })

    const total = computed(() => {
      return props.playlist.length ?? 1
    })

    const progress = computed(() => {
      return (finishedActivities.value.length / total.value) * 100
    })

    function goToLibraryCategoryPage() {
      router.push({
        name: 'app-library-category-activityTypeId',
        params: {
          activityTypeId: props.id.toString()
        }
      })
    }

    return {
      backgroundColorRGBA,
      finishedActivities,
      progress,
      goToLibraryCategoryPage
    }
  }
})
</script>

<style lang="scss" scoped>
.category-video-card {
  display: flex;
  flex-direction: column;
  min-width: 135px;
  padding: 12px;
  color: #606060 !important;

  @media screen and (min-width: 1264px) {
    width: auto;
    flex-direction: row;
    padding: 16px;
  }

  .left-column {
    width: 100%;
    order: 1;
    @media screen and (min-width: 1264px) {
      order: 0;
      width: 70%;
      padding-right: 8px;
    }
  }

  .right-column {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    order: 0;
    text-align: center;
    @media screen and (min-width: 1264px) {
      width: 37%;
      order: 1;
    }
  }

  .title-text {
    font-size: 14px;
    font-weight: 700;
    line-height: 1.5;
    @media screen and (min-width: 1264px) {
      font-size: 18px;
    }
  }

  .description-text {
    font-size: 9px;
    font-weight: 400;
    line-height: 1.5;
    @media screen and (min-width: 1264px) {
      font-size: 15px;
    }
  }

  .progress {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;

    .progress-icon {
      aspect-ratio: 1;
      width: 9px;
      max-width: 9px;

      @media screen and (min-width: 1264px) {
        width: 15px;
        max-width: 15px;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center center;
      }
    }

    .progress-text {
      font-size: 9px;
      font-weight: 700;
      line-height: 1.5;
      @media screen and (min-width: 1264px) {
        font-size: 15px;
      }
    }

    .progress-bar {
      width: auto;
      flex-grow: 1;
      flex-shrink: 0;
    }
  }

  .icon-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 68px;
    aspect-ratio: 1;
    background-color: #ffffff;
    border: 4px solid var(--borderColor);
    border-radius: 50%;
    box-shadow: 8px 8px 24px 0px #00000040;
    transition: transform 250ms ease-in-out;

    &-scaled {
      transform: scale(1.125);
      z-index: 1;
    }

    @media screen and (min-width: 1264px) {
      width: 112px;
    }

    img {
      width: 30px;
      height: 30px;
      object-fit: contain;
      object-position: center center;
      @media screen and (min-width: 1264px) {
        width: 45px;
        height: 45px;
      }
    }

    .start-text {
      font-size: 10px;
      font-weight: 700;
      line-height: 1.5;
      @media screen and (min-width: 1264px) {
        font-size: 15px;
      }
    }
  }
}
</style>
