<template>
  <v-col class="pa-0 pr-4 scroll-wrapper" :style="{ 'height': `${height}px` }">
    <div
      v-for="(video, index) in videosLearnPlay"
      :key="`video-scroll-item-${index}`"
    >
      <VideoScrollItem
        :play-and-learn-video="video"
        @click.native="currentVideo(video.video)"
      />
    </div>
  </v-col>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  PropType
} from '@nuxtjs/composition-api'
import { useIconScale } from '@/composables'
import { PlayAndLearn, Video } from '@/models'
import VideoScrollItem from './VideoScrollItem.vue'

export default defineComponent({
  name: 'VideosScroll',

  components: {
    VideoScrollItem
  },

  props: {
    learnPlay: {
      type: Object as PropType<PlayAndLearn>,
      required: true,
      default: () => ({})
    },
    height: {
      type: Number
    }
  },

  setup(props, { emit }) {
    const { scaleIcon, scaleUp, scaleDown } = useIconScale()
    const loading = ref(false)

    const videosLearnPlay = computed(() => {
      return props.learnPlay && props.learnPlay.videos.length > 0
        ? props.learnPlay.videos
        : []
    })

    const currentVideo = (video: Video) => {
      emit('change-video-track', video)
    }

    return {
      loading,
      currentVideo,
      videosLearnPlay,
      scaleIcon,
      scaleUp,
      scaleDown
    }
  }
})
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #F2F2F2;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #68C453;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.scroll-wrapper {
  aspect-ratio: 9/16;
  overflow-y: auto;
}

.video-scroll {
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
