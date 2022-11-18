<template>
  <div class="d-flex rounded-lg item-wrapper mb-2">
    <div>
      <v-img
        :src="playAndLearnVideo.video.thumbnail"
        class="rounded-lg clickable"
        content-class="d-flex align-center justify-center"
        width="131px"
        aspect-ratio="1.129"
        gradient="0deg, #000000 -20.15%, rgba(77, 77, 77, 0) 73.48%"
        @mouseenter="scaleUp"
        @mouseleave="scaleDown"
      >
        <div class="d-flex justify-center">
          <v-img
            class="scalable-icon"
            :class="{ 'scaled-icon': scaleIcon }"
            :src="require('@/assets/png/play-min.png')"
            contain
            max-width="80px"
          />
        </div>
      </v-img>
    </div>
    <div class="d-flex flex-column pa-3">
      <span class="video-title-text">
        {{ playAndLearnVideo.name || playAndLearnVideo.video.name }}
      </span>
      <span class="video-subtitle-text">
        {{
          playAndLearnVideo.description || playAndLearnVideo.video.description
        }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { useIconScale } from '@/composables'
import { PlayAndLearnVideo } from '@/models'

export default defineComponent({
  name: 'VideoScrollItem',

  props: {
    playAndLearnVideo: {
      type: Object as PropType<PlayAndLearnVideo>,
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
.pg-wrapper {
  position: relative;
}

.item-wrapper {
  box-shadow: 0px 5.23457px 15.7037px rgba(0, 0, 0, 0.15);
  background: white;
}

.video-title-text {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: #606060;
}

.video-subtitle-text {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 15px;
  color: #606060;
}

.scalable-icon {
  transition: transform 250ms ease-in-out;

  &.scaled-icon {
    transform: scale(1.25);
  }
}
</style>
