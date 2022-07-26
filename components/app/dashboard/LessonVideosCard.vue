<template>
  <div :class="{ 'dashboard-content-card': $vuetify.breakpoint.mdAndUp, 'pg-h-full': $vuetify.breakpoint.smOnly }" class="pg-h-3/4">
    <v-card class="d-flex flex-column dashboard-content-card" height="100%">
      <template v-if="currentVideoLesson">
        <div
          class="d-flex justify-center align-center clickable dashboard-video-thumbnail flex-grow-1 flex-shrink-0"
          :style="{ '--videoThumbnailUrl': `url(${currentVideoLesson.poster})` }"
          @click.stop="playVideo"
        >
          <v-hover v-slot="{ hover }">
            <img
              :class="['play-icon no-background', { 'scaled-play-icon': hover }]"
              src="@/assets/svg/play-button-icon.svg"
              width="100%"
            >
          </v-hover>
        </div>
        <v-list class="lesson-video-card">
          <v-list-item>
            <v-list-item-avatar tile>
              <v-img
                :src="currentVideoLesson.meta.activityType.icon"
                contain
              />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>
                <span class="dashboard-item-activity-type">
                  {{ currentVideoLesson.meta.activityType.name }}
                </span>
                <span class="dashboard-item-name">
                  with {{ currentVideoLesson.title }}
                </span>
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ currentVideoLesson.description }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <slot />
          </v-list-item>
        </v-list>
      </template>
    </v-card>
    <lesson-puzzle-pieces v-if="$vuetify.breakpoint.smAndDown" />
    <lesson-video-player />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, useStore, useRoute } from '@nuxtjs/composition-api'
import { APP_EVENTS, TypedStore } from '@/models'

import LessonVideoPlayer from '@/components/app/dashboard/LessonVideoPlayer.vue'
import LessonPuzzlePieces from '@/components/app/dashboard/LessonPuzzlePieces.vue'
import { isArray } from 'lodash'
import { useNuxtHelper } from '@/composables'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'

export default defineComponent({
  name: 'LessonVideosCard',

  components: {
    LessonVideoPlayer,
    LessonPuzzlePieces
  },

  setup() {
    const route = useRoute()
    const store = useStore<TypedStore>()
    const nuxt = useNuxtHelper()

    const getLesson = computed(() => {
      return store.getters['admin/curriculum/getLesson']
    })

    const videoId = computed(() => {
      const value = route.value.query.id
      const id = value && !isArray(value) ? value : '0'
      return parseInt(id)
    })

    const videos = computed(() => {
      const unfilteredVideos = getLesson.value.videos ?? []
      return unfilteredVideos.filter((video: any) => {
        return Boolean(video.videoUrl.HLS)
      })
    })

    const playlist = computed<MediaObject[]>(() => {
      return videos.value.map(({ activityType, name, description, videoUrl, thumbnail, id, viewed }: any) => {
        return {
          title: activityType.name,
          description,
          poster: thumbnail,
          src: {
            url: videoUrl.HLS,
            type: 'application/x-mpegURL'
          },
          meta: {
            videoId: id,
            author: `with ${name}`,
            videoType: 'VIDEO LESSONS:',
            videoIcon: activityType.icon ?? undefined,
            activityType,
            viewed
          }
        }
      })
    })

    const currentVideoLessonIndex = computed(() => {
      return playlist.value.findIndex((mediaObject) => {
        return mediaObject.meta?.videoId === videoId.value
      })
    })

    const currentVideoLesson = computed(() => {
      return playlist.value[currentVideoLessonIndex.value]
    })

    function playVideo() {
      nuxt.$emit(APP_EVENTS.DASHBOARD_VIDEO_LESSON_VIDEO_CLICKED, videoId.value)
      nuxt.$emit('open-lesson-video-player', { playlist: playlist.value, index: currentVideoLessonIndex.value })
    }

    return {
      currentVideoLesson,
      playVideo
    }
  }
})
</script>

<style lang="scss">
@import '~assets/scss/lesson-video-card.scss';
</style>
