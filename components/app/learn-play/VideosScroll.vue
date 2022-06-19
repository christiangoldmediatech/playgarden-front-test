<template>
  <v-slide-group show-arrows="always">
    <template #prev>
      <v-btn icon>
        <v-img
          :src="require('@/assets/png/arrow-left.png')"
          max-width="12px"
        />
      </v-btn>
    </template>
    <v-slide-item
      v-for="(video, index) in videosLearnPlay"
      :key="`video-scroll-item-${index}`"
    >
      <VideoScrollItem v-bind="{ video }" @click.native="currentVideo(video)" />
    </v-slide-item>
    <template #next>
      <v-btn icon>
        <v-img
          :src="require('@/assets/png/arrow-right.png')"
          max-width="12px"
        />
      </v-btn>
    </template>
  </v-slide-group>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@nuxtjs/composition-api'
import { useIconScale } from '@/composables'
import { Video } from '@/models'
import VideoScrollItem from './VideoScrollItem.vue'

export default defineComponent({
  name: 'VideosScroll',

  components: {
    VideoScrollItem
  },

  props: {
    learnPlay: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },

  setup(props, { emit }) {
    const { scaleIcon, scaleUp, scaleDown } = useIconScale()
    const loading = ref(false)

    const videosLearnPlay = computed(() => {
      return (props.learnPlay && props.learnPlay.videos.length > 0) ? props.learnPlay.videos : []
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
