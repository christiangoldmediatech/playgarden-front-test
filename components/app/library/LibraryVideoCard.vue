<template>
  <v-hover v-slot:default="{ hover }">
    <div class="library-video-card clickable" @click="handlePlay">
      <div v-if="topTitle" class="library-video-title-top">
        {{ mediaObject.title }}
      </div>

      <div class="library-video-card-container">
        <div class="library-video-thumbnail-container">
          <img v-lazyload class="library-video-thumbnail" :data-url="mediaObject.poster">

          <div class="thumbnail-play-icon-wrapper">
            <div class="thumbnail-play-icon" :class="{ 'thumbnail-play-icon-scaled': hover }">
              <img src="@/assets/svg/library/library-play-icon-green.svg">
            </div>
          </div>
        </div>

        <div class="library-video-text">
          <div v-if="!topTitle" class="library-video-title">
            {{ mediaObject.title }}
          </div>

          <div class="library-video-description">
            {{ description }}
          </div>

          <div v-if="hasBeenViewed" class="library-video-viewed">
            {{ $t('videoLibrary.videoCard.viewed') }} <img src="@/assets/svg/library/viewed-icon.svg">
          </div>
        </div>
      </div>
    </div>
  </v-hover>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from '@nuxtjs/composition-api'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import { useLanguageHelper } from '@/composables'

export default defineComponent({
  name: 'LibraryVideoCard',

  props: {
    mediaObject: {
      type: Object as PropType<MediaObject>,
      required: true
    },

    topTitle: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  setup(props, { emit }) {
    const language = useLanguageHelper()
    const hasBeenViewed = computed(() => {
      return Boolean(props.mediaObject.meta?.watched)
    })

    const description = computed(() => {
      return (props.mediaObject.meta?.author) ? `${props.mediaObject.meta.author}` : ''
    })

    function handlePlay() {
      emit('play', props.mediaObject)
    }

    return {
      hasBeenViewed,
      handlePlay,
      description
    }
  }
})
</script>

<style lang="scss" scoped>
.library-video-card {
  min-width: 135px;

  .library-video-title-top {
    font-weight: 600;
    font-size: 16px;
    line-height: 1.5;
    margin-bottom: 6px;

    @media screen and (min-width: 1264px) {
      font-size: 25px;
      margin-bottom: 8px;
    }
  }

  .library-video-card-container {
    display: flex;
    flex-direction: column;
    @media screen and (min-width: 1264px) {
      align-items: stretch;
      flex-direction: row;
    }

    .library-video-thumbnail-container {
      position: relative;
      width: 100%;
      aspect-ratio: 1.72;
      overflow: hidden;

      @media screen and (min-width: 1264px) {
        width: 55%;
      }

      img.library-video-thumbnail {
        vertical-align: top;
        object-fit: cover;
        object-position: center center;
        width: 100%;
        max-width: 100%;
        height: 100%;
        max-height: 100%;
      }

      .thumbnail-play-icon-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .thumbnail-play-icon {
          width: 25%;
          max-width: 25%;
          aspect-ratio: 1.14;
          transition: transform 250ms ease-in-out;

          &.thumbnail-play-icon-scaled {
            transform: scale(1.25);
          }

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            object-position: center center;
          }
        }
      }
    }

    .library-video-text {
      position: relative;
      width: 100%;
      padding: 8px;

      @media screen and (min-width: 1264px) {
        width: 45%;
        max-width: 45%;
        padding-right: 0px;
        padding-bottom: 0px;
        padding-top: 0px;
      }

      .library-video-title {
        font-weight: 600;
        font-size: 9px;
        line-height: 1.5;

        @media screen and (min-width: 1264px) {
          font-size: 15px;
          margin-top: 8px;
          margin-bottom: 8px;
        }
      }

      .library-video-description {
        display: none;
        @media screen and (min-width: 1264px) {
          display: block;
          font-weight: 400;
          font-size: 12px;
          line-height: 1.5;
        }
      }

      .library-video-viewed {
        font-size: 6px;
        font-weight: 400;
        line-height: 1.5;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;

        @media screen and (min-width: 1264px) {
          position: absolute;
          bottom: 0;
          font-size: 10px;
        }

        img {
          width: 8px;
          aspect-ratio: 1;
          object-fit: contain;
          object-position: center center;
          margin-left: 5px;
          @media screen and (min-width: 1264px) {
            width: 13px;
            margin-left: 9px;
          }
        }
      }
    }
  }
}
</style>
