<template>
  <div class="d-flex align-center">
    <!-- Left back arrow -->
    <div v-if="!$vuetify.breakpoint.mobile" class="mr-2">
      <v-btn
        icon
      >
        <v-img
          :src="require('@/assets/png/arrow-left.png')"
          max-width="12px"
        />
      </v-btn>
    </div>

    <div class="d-flex flex-grow-1 flex-nowrap video-scroll">
      <VideoScrollItem v-for="(video, index) in videosLearnPlay" :key="index" v-bind="{ video }" @click.native="currentVideo(video)" />
    </div>

    <!-- Right forward arrow -->
    <div v-if="!$vuetify.breakpoint.mobile" class="ml-2">
      <v-btn
        icon
      >
        <v-img
          :src="require('@/assets/png/arrow-right.png')"
          max-width="12px"
        />
      </v-btn>
    </div>
  </div>
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
