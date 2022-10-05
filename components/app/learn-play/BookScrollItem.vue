<template>
  <div class="mx-1">
    <v-img
      :src="playAndLearnVideo.image"
      class="rounded-lg clickable"
      content-class="d-flex align-end justify-center"
      width="131px"
      aspect-ratio="1.129"
      gradient="0deg, #000000 -20.15%, rgba(77, 77, 77, 0) 73.48%"
      @mouseenter="scaleUp"
      @mouseleave="scaleDown"
    >
      <div class="text-center mb-3">
        <div class="d-flex justify-center mb-2">
          <v-img
            class="scalable-icon"
            :class="{ 'scaled-icon': scaleIcon }"
            :src="require('@/assets/png/play-min.png')"
            contain
            max-width="39px"
          />
        </div>

        <div class="video-title-text">
          {{ playAndLearnVideo.name || playAndLearnVideo.video.name }}
        </div>

        <div class="video-subtitle-text">
          {{
            playAndLearnVideo.description || playAndLearnVideo.video.description
          }}
        </div>
      </div>
    </v-img>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { useIconScale } from '@/composables'
import { Book } from '@/models'

export default defineComponent({
  name: 'BookScrollItem',

  props: {
    playAndLearnVideo: {
      type: Object as PropType<Book>,
      required: true
    }
  },

  setup() {
    const { scaleIcon, scaleUp, scaleDown } = useIconScale()

    return {
      scaleIcon,
      scaleUp,
      scaleDown
    }
  }
})
</script>

  <style lang="scss" scoped>
  .video-title-text {
    font-weight: 700;
    font-size: 10px;
    color: white;
  }

  .video-subtitle-text {
    font-weight: 500;
    font-size: 10px;
    color: white;
  }

  .scalable-icon {
    transition: transform 250ms ease-in-out;

    &.scaled-icon {
      transform: scale(1.25);
    }
  }
  </style>
