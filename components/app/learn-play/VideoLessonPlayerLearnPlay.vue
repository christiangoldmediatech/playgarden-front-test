<template>
  <div class="video-lesson-player">
    <v-row no-gutters>
      <v-col cols="12" md="8" class="pr-10">
        <div class="mb-3">
          <span class="title-dashboard">
            Video Lessons
          </span>
        </div>

        <div id="learn-play-player" class="mb-5 learn-play-video">
          <pg-video-player
            v-if="videos.length > 0"
            class="library-inline-player"
            :control-config="{ favorite: false }"
            inline
            auto-track-change
            @ready="
              onPlayerReady({ player: $event, videos: videos })
            "
            @on-play="saveStartProgress"
            @on-pause="sendOnPauseAnalytics"
            @on-skip="sendOnSkipAnalytics"
            @on-under-30="sendOnUnder30Analytics"
            @on-ended="saveEndProgress"
          >
            <template #inline-play-icon="{ firstPlay }">
              <div
                class="player-preview-container"
                :class="{
                  'player-preview-container-shown': showPreview
                }"
                @mouseenter="scaleUp"
                @mouseleave="scaleDown"
                @click="handlePlay(firstPlay)"
              >
                <img
                  class="player-preview-icon"
                  :class="{
                    'player-preview-icon-scaled': scaleIcon
                  }"
                  src="@/assets/svg/library/library-play-icon-green.svg"
                >
                <div class="player-preview-text">
                  <div class="justify-center player-text-top-part">
                    <div class="player-preview-title">
                      {{ title }}
                    </div>
                  </div>
                  <div class="player-preview-author">
                    {{ author }}
                  </div>
                </div>
              </div>
            </template>
          </pg-video-player>
          <v-card v-else width="100%">
            <v-skeleton-loader type="card" />
          </v-card>
        </div>
      </v-col>

      <v-col cols="12" md="4">
        <div class="mb-3">
          <span class="title-dashboard">More like this</span>
        </div>
        <videos-scroll
          v-if="videos.length > 0"
          :learn-play-videos="videos"
          :height="playerHeight"
          @change-video-track="changeVideoTrack"
        />
        <v-card v-else width="100%">
          <v-skeleton-loader type="list-item-avatar-two-line" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import PgVideoPlayer from '@gold-media-tech/pg-video-player'
import VideosScroll from '@/components/app/learn-play/VideosScroll.vue'
import { PlayerInstance, PlayerInstanceEvent } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { defineComponent, onMounted, onUnmounted, ref, useStore } from '@nuxtjs/composition-api'
import {
  useLearnPlayV2,
  useCommonPlayerFunctions,
  useChild,
  useVideoAnalytics,
  useActivityAnalytics
} from '@/composables'
import { PlayAndLearnVideo, TypedStore, Video } from '@/models'

export default defineComponent({
  name: 'VideoLessonPlayerLearnPlay',

  components: {
    PgVideoPlayer,
    VideosScroll
  },

  props: {
    previewMode: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const store = useStore()
    const learnPlayV2 = useLearnPlayV2({ store })
    const commonPlayerFunctions = useCommonPlayerFunctions()
    const childStore = useStore<TypedStore>()
    const child = useChild({ store: childStore })
    const { sendPlayerEventVideoAnalytics } = useVideoAnalytics()
    const { sendActivityAnalytics, determineCurrentVideo } = useActivityAnalytics(child.currentChildren)
    const player = ref<PlayerInstance | null>(null)
    const title = ref('')
    const author = ref('')
    const playerHeight = ref(0)
    const resizeOb = ref(new ResizeObserver(function(entries) {
      // since we are observing only a single element, so we access the first element in entries array
      const rect = entries[0].contentRect

      // current height
      const height = rect.height

      playerHeight.value = height
    }))

    function onPlayerReady(payload: {
      player: PlayerInstance
      videos: PlayAndLearnVideo[]
    }) {
      const videos = payload.videos.map(v => ({
        ...v.video,
        name: v.name || v.video.name,
        description: v.description || v.video.description
      }))

      player.value = payload.player
      const playVideoList = learnPlayV2.buildPlayVideoList(videos)
      player.value.loadPlaylist(playVideoList)
      title.value = playVideoList[0].title as string
      author.value = playVideoList[0].meta?.author as string
    }

    function changeVideoTrack(video: Video) {
      if (!player.value) {
        return
      }
      title.value = video.name as string
      author.value = video.description as string
      player.value.loadPlaylist([
        {
          title: video.name,
          poster: video.image,
          description: video.description,
          src: {
            url: video.videoUrl.HLS,
            type: 'application/x-mpegURL'
          },
          meta: {
            videoId: video.id,
            author: video.description
          }
        }
      ])
      player.value.play()
      commonPlayerFunctions.showPreview.value = false
    }

    const saveStartProgress = async (media: any) => {
      if (props.previewMode) {
        return
      }

      sendOnStartAnalytics(media)

      await learnPlayV2.updateProgress(buildDataProgress(media, false))
    }

    const saveEndProgress = async (media: any) => {
      if (props.previewMode) {
        return
      }

      sendOnEndedAnalytics(media)

      await learnPlayV2.updateProgress(buildDataProgress(media, true))
    }

    const sendOnStartAnalytics = (event: PlayerInstanceEvent): void => {
      sendPlayerEventVideoAnalytics({
        children: child.currentChildren, event, status: event.currentTime > 1 ? 'RESUMED' : 'STARTED'
      })

      sendActivityAnalytics({
        duration: event.duration,
        time: event.currentTime,
        video: determineCurrentVideo(event.currentTrack)
      }, true)
    }

    const sendOnPauseAnalytics = (event: PlayerInstanceEvent): void => {
      sendPlayerEventVideoAnalytics({
        children: child.currentChildren, event, status: 'PAUSED'
      })

      sendActivityAnalytics({
        duration: event.duration,
        time: event.currentTime,
        video: determineCurrentVideo(event.currentTrack)
      })
    }

    const sendOnEndedAnalytics = (event: PlayerInstanceEvent): void => {
      sendPlayerEventVideoAnalytics({
        children: child.currentChildren, event, status: 'COMPLETED'
      })

      sendActivityAnalytics({
        duration: event.duration,
        time: event.currentTime,
        video: determineCurrentVideo(event.currentTrack)
      }, false, true)
    }

    const sendOnSkipAnalytics = (event: PlayerInstanceEvent): void => {
      sendPlayerEventVideoAnalytics({
        children: child.currentChildren, event, status: 'SKIPPED'
      })

      sendActivityAnalytics({
        duration: event.duration,
        time: event.currentTime,
        video: determineCurrentVideo(event.currentTrack)
      }, false, true)
    }

    const sendOnUnder30Analytics = (event: PlayerInstanceEvent): void => {
      sendActivityAnalytics({
        duration: event.duration,
        time: event.currentTime,
        video: determineCurrentVideo(event.currentTrack)
      })
    }

    const buildDataProgress = (media: any, finish: boolean) => {
      if (child.currentChildren.value) {
        const childId = child.currentChildren.value[0].id
        const videoProgress = {
          id: media.currentTrack.meta.videoId,
          started: true,
          completed: finish
        }
        const { id } = learnPlayV2.playAndLearnInfo.value
        const data = {
          videos: [videoProgress]
        }
        return { playAndLearnId: id, childId, data }
      }
    }

    const setObserver = () => {
      const element = document.getElementById('learn-play-player')
      if (element) {
        resizeOb.value.observe(element)
      }
    }

    const unsetObserver = () => {
      const element = document.getElementById('learn-play-player')
      if (element) {
        resizeOb.value.unobserve(element)
      }
    }

    onMounted(() => {
      setObserver()
    })

    onUnmounted(() => {
      unsetObserver()
    })

    return {
      videos: learnPlayV2.playAndLearnVideos,
      ...commonPlayerFunctions,
      title,
      author,
      onPlayerReady,
      changeVideoTrack,
      saveStartProgress,
      saveEndProgress,
      playerHeight,
      sendOnPauseAnalytics,
      sendOnSkipAnalytics,
      sendOnUnder30Analytics
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/library/library-inline-player.scss';
</style>
