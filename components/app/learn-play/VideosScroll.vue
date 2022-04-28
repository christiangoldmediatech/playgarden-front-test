<template>
  <v-row>
    <v-row class="mx-3">
      <v-col v-if="!$vuetify.breakpoint.smAndDown" cols="1">
        <v-btn
          text
          class="mt-5"
        >
          <v-img
            :src="require('@/assets/png/arrow-left.png')"
            max-width="15px"
          />
        </v-btn>
      </v-col>
      <v-col cols="12" md="10" class="pr-8">
        <div class="cursor video-scroll">
          <div v-for="(video, index) in videosLearnPlay" :key="index" class="card-video">
            <v-avatar class="mx-3" tile size="80" @click="currentVideo(video)">
              <v-img
                :src="require('@/assets/png/play-min.png')"
                class="play-main"
                width="26px"
                height="28px"
              />
              <img class="play-view" :src="video.thumbnail">
            </v-avatar>
          </div>
        </div>
      </v-col>
      <v-col v-if="!$vuetify.breakpoint.smAndDown" cols="1" class="ml-n6">
        <v-btn
          text
          class="ml-n6 mt-5"
        >
          <v-img
            :src="require('@/assets/png/arrow-right.png')"
            max-width="15px"
          />
        </v-btn>
      </v-col>
    </v-row>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from '@nuxtjs/composition-api'
import { useVideos } from '@/composables/videos'
import { Video } from '@/models'

export default defineComponent({
  name: 'VideosScroll',
  props: {
    learnPlay: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const loading = ref(false)

    const videosLearnPlay = computed(() => {
      return (props.learnPlay && props.learnPlay.videos.length > 0) ? props.learnPlay.videos : []
    })

    const currentVideo = (video: Video) => {
      emit('changeVideoTrack', video)
    }

    return {
      loading,
      currentVideo,
      videosLearnPlay
    }
  }
})
</script>

<style scoped>
.cursor {
  cursor: pointer !important;
}

.video-scroll {
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
}

.card-video {
    display: inline-block;
}

.play-main{
  position:absolute;
  z-index: 503;
}
.play-view {
   position:absolute;
   z-index: 500;
}
</style>
