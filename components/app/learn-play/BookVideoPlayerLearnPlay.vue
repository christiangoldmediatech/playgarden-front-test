<template>
  <div>
    <div v-if="loading || getRelatedBooks.length > 0" class="mb-4 d-flex align-center">
      <span class="title-dashboard">
        This week's recommended books
      </span>
    </div>

    <p v-if="getBook" class="book-text">
      {{ getBook.description }}
    </p>

    <template v-if="getRelatedBooks.length > 0">
      <div class="learn-play-video mb-4">
        <pg-video-player
          v-if="currentBookVideo.videoUrl && currentBookVideo.videoUrl.HLS"
          :control-config="{ favorite: false }"
          inline
          @ready="onPlayerReady({ player: $event, video: currentBookVideo })"
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
                <div class="player-text-top-part justify-center">
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
        <v-card class="px-5">
          <v-row align="center" justify="start">
            <v-col cols="2">
              <v-img :src="currentBookVideo.thumbnail" contain width="100" />
            </v-col>
            <v-col cols="7">
              <div class="mb-2">
                Book:
              </div>
              <span class="title-dashboard">{{ currentBookVideo.name }}</span>
            </v-col>
            <v-col v-if="amzLink " cols="3">
              <div class="mb-2">
                Buy now on:
              </div>
              <v-btn color="#B2E68D" block @click="goToLink">
                <img src="@/assets/svg/amazon.svg" />
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </template>
    <template v-if="loading">
      <v-card class="mb-4" width="100%">
        <v-skeleton-loader type="card" />
      </v-card>
      <span class="title-dashboard">
        Books of the week
      </span>
      <v-card class="mt-2">
        <v-row class="mx-2 my-2">
          <v-col v-for="n in 3" :key="`book-load-item-${n}`" cols="4">
            <v-skeleton-loader type="image" />
          </v-col>
        </v-row>
      </v-card>
    </template>
    <div v-if="getRelatedBooks.length > 0" class="mt-8">
      <span class="title-dashboard">
        Books of the week
      </span>
      <div class="mt-6">
        <BooksScroll
          :learn-play="getRelatedBooks"
          @change-video-track="changeVideoTrack"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useStore } from '@nuxtjs/composition-api'
import {
  useLearnPlayV2,
  useCommonPlayerFunctions,
  useChild,
  useVideoAnalytics,
  useActivityAnalytics
} from '@/composables'
// @ts-ignore
import PgVideoPlayer from '@gold-media-tech/pg-video-player'
import { PlayerInstance, PlayerInstanceEvent } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { Book, TypedStore } from '@/models'
import BooksScroll from './BooksScroll.vue'

export default defineComponent({
  name: 'BookVideoPlayerLearnPlay',

  components: {
    PgVideoPlayer,
    BooksScroll
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
    const amzLink = ref<string | undefined>('')

    // Player functions
    function onPlayerReady(payload: { player: PlayerInstance; video: any }) {
      const { video } = payload
      player.value = payload.player
      title.value = video.name as string
      author.value = video.description as string
      amzLink.value = learnPlayV2.computedProps.getBook.value?.link
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
            author: video.description,
            videoId: video.id
          }
        }
      ])
    }

    function changeVideoTrack(book: Book) {
      const { video }: {video: any} = book

      if (!player.value) {
        return
      }

      learnPlayV2.newVideo.value = video

      title.value = video.name as string
      author.value = video.description as string
      amzLink.value = book.link
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
        const bookProgress = {
          id: learnPlayV2.computedProps.getBook.value?.id,
          started: true,
          completed: finish
        }
        const { id } = learnPlayV2.learnPlayData.value
        const data = {
          books: [bookProgress]
        }
        return { playAndLearnId: id, childId, data }
      }
    }

    const goToLink = () => {
      if (amzLink.value) {
        window.open(amzLink.value, '_blank')
      }
    }

    return {
      onPlayerReady,
      changeVideoTrack,
      saveStartProgress,
      saveEndProgress,
      goToLink,
      ...commonPlayerFunctions,
      currentBookVideo: learnPlayV2.computedProps.currentBookVideo,
      getBook: learnPlayV2.computedProps.getBook,
      getRelatedBooks: learnPlayV2.computedProps.getRelatedBooks,
      loading: learnPlayV2.loadingPlayAndLearnBooks,
      title,
      author,
      amzLink,
      sendOnPauseAnalytics,
      sendOnSkipAnalytics,
      sendOnUnder30Analytics
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/library/library-inline-player.scss';

.book-text {
  font-weight: 400;
  font-size: 14px;
  color: #606060;
  text-align: justify;
  @media screen and (min-width: 1264px) {
    font-size: 16px;
  }
}

.book-images-container {
  display: flex;

  @media screen and (min-width: 1264px) {
    width: 100%;
    flex-wrap: nowrap;
    &.book-images-container-overflowed {
      overflow-x: auto;
      overflow-y: hidden;
    }
  }
}

.book-cover {
  object-fit: contain;
  object-position: center center;
}
</style>
