<template>
  <v-row>
    <v-row class="video-scroll">
      <v-col cols="1">
        <v-btn
          text
          @click="getDataVideos"
        >
          <v-img
            :src="require('@/assets/png/arrow-left.png')"
            max-width="15px"
          />
        </v-btn>
      </v-col>
      <v-col cols="10" class="ml-3">
        <v-row class="cursor">
          <div v-for="(video, index) in videos" :key="index">
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
        </v-row>
      </v-col>
      <v-col cols="1" class="ml-n8">
        <v-btn
          text
          class="ml-n6"
          @click="getDataVideos"
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
import { defineComponent, ref, onMounted } from '@nuxtjs/composition-api'
import { useVideos } from '@/composables/videos'
import { Video } from '@/models'

export default defineComponent({
  name: 'VideosScroll',
  props: {
    lesson: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const loading = ref(false)

    const { videos, getVideos } = useVideos()

    const getDataVideos = async () => {
      await getVideos(props.lesson.id)
    }

    const currentVideo = (video: Video) => {
      emit('changeVideoTrack', video)
    }

    onMounted(() => {
      getDataVideos()
    })

    return {
      loading,
      videos,
      currentVideo,
      getDataVideos
    }
  }
})
</script>

<style scoped>
.video-scroll {
  overflow-x: auto !important;
}
.cursor {
  cursor: pointer !important;
}

.play-main{
  position:absolute;
  z-index: 1003;
}
.play-view {
   position:absolute;
   z-index: 1000;
}
</style>
