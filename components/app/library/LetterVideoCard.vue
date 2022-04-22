<template>
  <v-sheet
    class="letter-video-card"
    :class="{
      'letter-video-card-visible': visible,
      'letter-video-card-floating': isFloating,
      'letter-video-card-float-left': left,
      'letter-video-card-float-right': right
    }"
    :style="{
      '--background-color': color
    }"
    rounded="xl"
    elevation="5"
    :height="isFloating ? undefined : '100%'"
    :color="color"
  >
    <v-img
      class="rounded-xl clickable"
      :class="{
        'd-none d-lg-flex': isFloating
      }"
      :src="mediaObject.poster"
      aspect-ratio="1.44"
      content-class="d-flex align-center justify-center"
      @click="handleClick"
      @mouseenter="isHover = true"
      @mouseleave="isHover = false"
    >
      <div
        class="letter-video-card-play-icon"
        :class="{
          'letter-video-card-play-icon-scaled': isHover
        }"
      >
        <img v-if="isFloating" src="@/assets/svg/library/library-play-icon-green.svg">
        <img v-else src="@/assets/svg/library/library-play-icon-orange.svg">
      </div>
    </v-img>

    <div class="pa-3 pb-0 d-flex justify-space-between flex-nowrap">
      <div class="letter-video-card-author">
        {{ mediaObject.meta.author }}
      </div>
    </div>

    <div class="px-3 pb-3 d-flex justify-space-between align-center  flex-nowrap">
      <div class="letter-video-card-title pt-2">
        {{ mediaObject.title }}
      </div>
      <v-btn
        v-if="!isFloating"
        class="d-none d-lg-block"
        color="#FE3F93"
        icon
        :loading="isFavoritesLoading"
        @click="handleFavBtnClick"
      >
        <v-icon v-if="isFavorite">
          mdi-heart
        </v-icon>
        <v-icon v-else>
          mdi-heart-outline
        </v-icon>
      </v-btn>
      <div class="play-icon-slot d-lg-none">
        <slot name="playicon" />
      </div>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed, useStore } from '@nuxtjs/composition-api'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import { useFavoritesApi, useGtmHelper } from '@/composables'
import { TypedStore } from '@/models'

export default defineComponent({
  name: 'LetterVideoCard',

  props: {
    mediaObject: {
      type: Object as PropType<MediaObject>,
      required: true
    },

    color: {
      type: String,
      default: '#FFF8E0'
    },

    left: {
      type: Boolean,
      required: false,
      default: false
    },

    right: {
      type: Boolean,
      required: false,
      default: false
    },

    visible: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  setup(props, { emit }) {
    const isHover = ref(false)
    const isFavorite = computed(() => {
      return Boolean(props.mediaObject.meta?.favorite)
    })

    function handleClick(): void {
      emit('play', props.mediaObject)
    }

    const isFloating = computed(() => {
      return props.left || props.right
    })

    // Handle favorites
    const store = useStore<TypedStore>()
    const gtm = useGtmHelper()
    const isFavoritesLoading = ref(false)
    const { handleFavorite } = useFavoritesApi({ store, gtm })
    async function handleFavBtnClick(): Promise<void> {
      try {
        if (props.mediaObject.meta?.videoId && props.mediaObject.title) {
          isFavoritesLoading.value = true
          await handleFavorite(props.mediaObject.meta?.videoId, props.mediaObject.title)
        }
      } catch (error) {
        Promise.reject(error)
      } finally {
        isFavoritesLoading.value = false
      }
    }

    return {
      handleClick,
      handleFavBtnClick,
      isFavoritesLoading,
      isFloating,
      isFavorite,
      isHover
    }
  }
})
</script>

<style lang="scss" scoped>
.letter-video-card {
  transition: opacity 250ms ease-in-out;
  pointer-events: none;
  opacity: 0;

  &.letter-video-card-visible {
    pointer-events: initial;
    opacity: 1;
  }

  &.letter-video-card-floating {
    position: absolute;
    min-width: 120px;
    max-width: 147px;
    z-index: 100;
    cursor: default !important;

    @media screen and (min-width: 1264px) {
      width: 394px;
      max-width: 394px;
    }

    .play-icon-slot::v-deep {
      margin-left: 12px;
      img {
        transition: transform 250ms ease-in-out;
        &:hover {
          transform: scale(1.25)
        }
      }
    }
  }

  &.letter-video-card-float-left {
    right: 100%;
    bottom: 0;
    margin-right: 15px;
    @media screen and (min-width: 1264px) {
      margin-right: 33px;
    }

    &::before {
      content: " ";
      position: absolute;
      right: -10px;
      bottom: 24px;
      border-top: 10px solid transparent;
      border-left: 10px solid var(--background-color);
      border-bottom: 10px solid transparent;
      border-right: none;
      transform-origin: center left;
      transform: scaleX(1.5);
      filter: drop-shadow(6px 0 0.75rem rgba(0, 0, 0, 0.81));

      @media screen and (min-width: 1264px) {
        right: -22px;
        bottom: 24px;
        border-top: 22px solid transparent;
        border-left: 22px solid var(--background-color);
        border-bottom: 22px solid transparent;
        filter: drop-shadow(12px 0 0.75rem rgba(0, 0, 0, 0.81));
      }
    }

    // invisible area to help prevent premature closing
    @media screen and (min-width: 1264px) {
    &::after {
        content: " ";
        width: 83px;
        height: 60%;
        position: absolute;
        right: -83px;
        bottom: 0;
      }
    }
  }

  &.letter-video-card-float-right {
    left: 100%;
    bottom: 0;

    margin-left: 15px;
    @media screen and (min-width: 1264px) {
      margin-left: 33px;
    }

    &::before {
      content: " ";
      position: absolute;
      left: -10px;
      bottom: 24px;
      border-top: 10px solid transparent;
      border-right: 10px solid var(--background-color);
      border-bottom: 10px solid transparent;
      border-left: none;
      transform-origin: center right;
      transform: scaleX(1.5);
      filter: drop-shadow(-6px 0 0.75rem rgba(0, 0, 0, 0.81));

      @media screen and (min-width: 1264px) {
        left: -22px;
        bottom: 24px;
        border-top: 22px solid transparent;
        border-right: 22px solid var(--background-color);
        border-bottom: 22px solid transparent;
        filter: drop-shadow(-12px 0 0.75rem rgba(0, 0, 0, 0.81));
      }
    }

    // invisible area to help prevent premature closing
    @media screen and (min-width: 1264px) {
    &::after {
        content: " ";
        width: 83px;
        height: 60%;
        position: absolute;
        left: -83px;
        bottom: 0;
      }
    }
  }

  .letter-video-card-play-icon {
    width: 29.4%;
    aspect-ratio: 1;
    transition: transform 250ms ease-in-out;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center center;
    }

    &.letter-video-card-play-icon-scaled {
      transform: scale(1.15);
    }
  }

  .letter-video-card-author {
    color: #606060;
    font-size: 10px;
    font-weight: 600;
    line-height: 1.5;
    @media screen and (min-width: 1264px) {
      font-size: 14px;
    }
  }

  .letter-video-card-title {
    color: #606060;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.5;
    @media screen and (min-width: 1264px) {
      font-size: 16px;
    }
  }
}
</style>
