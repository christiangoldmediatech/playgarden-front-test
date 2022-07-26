<template>
  <div>
    <div class="mb-3">
      <span class="title-dashboard">
        Video Lessons
      </span>
    </div>

    <template v-if="learnPlayData && learnPlayData.videos.length > 0">
      <div class="mb-5 learn-play-video">
        <pg-video-player
          class="library-inline-player"
          :control-config="{ favorite: false }"
          inline
          auto-track-change
          @ready="
            onPlayerReady({ player: $event, videos: learnPlayData.videos })
          "
          @on-play="saveStartProgress"
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
      </div>

      <div class="mb-3">
        <span class="subtitle-dashboard">Next up:</span>
      </div>

      <videos-scroll
        :learn-play="learnPlayData"
        @change-video-track="changeVideoTrack"
      />
    </template>
    <v-card v-else width="100%">
      <v-skeleton-loader type="card" />
    </v-card>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import PgVideoPlayer from '@gold-media-tech/pg-video-player'
import VideosScroll from '@/components/app/learn-play/VideosScroll.vue'
import { PlayerInstance } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { defineComponent, ref, useStore } from '@nuxtjs/composition-api'
import { useLearnPlayV2, useCommonPlayerFunctions, useChild } from '@/composables'
import { PlayAndLearnVideo, TypedStore } from '@/models'

export default defineComponent({
  name: 'VideoLessonPlayerLearnPlay',

  components: {
    PgVideoPlayer,
    VideosScroll
  },

  setup() {
    const store = useStore()
    const learnPlayV2 = useLearnPlayV2({ store })
    const commonPlayerFunctions = useCommonPlayerFunctions()
    const childStore = useStore<TypedStore>()
    const child = useChild({ store: childStore })
    const player = ref<PlayerInstance | null>(null)
    const title = ref('')
    const author = ref('')

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

    function changeVideoTrack(video: any) {
      if (!player.value) {
        return
      }
      title.value = video.name as string
      author.value = video.description as string
      player.value.loadPlaylist([
        {
          title: video.name,
          poster: video.thumbnail,
          description: '',
          src: {
            url: video.videoUrl.HLS,
            type: 'application/x-mpegURL'
          },
          meta: {
            author: video.description
          }
        }
      ])
      player.value.play()
      commonPlayerFunctions.showPreview.value = false
    }

    const saveStartProgress = async (media: any) => {
      await learnPlayV2.updateProgress(buildDataProgress(media, false))
    }

    const saveEndProgress = async (media: any) => {
      await learnPlayV2.updateProgress(buildDataProgress(media, true))
    }

    const buildDataProgress = (media: any, finish: boolean) => {
      if (child.currentChildren.value) {
        const childId = child.currentChildren.value[0].id
        const videoProgress = { id: media.currentTrack.meta.videoId, started: true, completed: finish }
        const { id } = learnPlayV2.learnPlayData.value
        const data = {
          videos: [videoProgress]
        }
        return { playAndLearnId: id, childId, data }
      }
    }

    return {
      learnPlayData: learnPlayV2.learnPlayData,
      ...commonPlayerFunctions,
      title,
      author,
      onPlayerReady,
      changeVideoTrack,
      saveStartProgress,
      saveEndProgress
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/library/library-inline-player.scss';
</style>
