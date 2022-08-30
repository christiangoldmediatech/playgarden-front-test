<template>
  <div>
    <div class="mb-4 d-flex align-center">
      <span class="title-dashboard">
        This week's recommended books
      </span>
    </div>

    <p v-if="getBook" class="book-text">
      {{ getBook.description }}
    </p>

    <template v-if="currentBookVideo.videoUrl && currentBookVideo.videoUrl.HLS">
      <div class="learn-play-video mb-4">
        <pg-video-player
          :control-config="{ favorite: false }"
          inline
          @ready="onPlayerReady({ player: $event, video: currentBookVideo })"
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
      </div>
    </template>
    <template v-else>
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
    <template v-if="getRelatedBooks.length > 0">
      <span class="title-dashboard">
        Books of the week
      </span>
      <v-card class="mt-2">
        <v-row
          class="book-images-container ma-0"
          :class="{
            'book-images-container-overflowed': getRelatedBooks.length > 3
          }"
        >
          <v-col
            v-for="(book, index) in getRelatedBooks"
            :key="`book-item-${index}`"
            cols="12"
            md="4"
          >
            <a :href="book.url" target="_blank">
              <img
                :src="book.image"
                class="book-cover"
                width="100%"
                height="100%"
              >
            </a>
          </v-col>
        </v-row>
      </v-card>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useStore } from '@nuxtjs/composition-api'
import {
  useLearnPlayV2,
  useCommonPlayerFunctions,
  useChild
} from '@/composables'
// @ts-ignore
import PgVideoPlayer from '@gold-media-tech/pg-video-player'
import { PlayerInstance } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { TypedStore } from '@/models'

export default defineComponent({
  name: 'BookVideoPlayerLearnPlay',

  components: {
    PgVideoPlayer
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
    const player = ref<PlayerInstance | null>(null)
    const title = ref('')
    const author = ref('')

    // Player functions
    function onPlayerReady(payload: { player: PlayerInstance; video: any }) {
      const { video } = payload
      player.value = payload.player
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
            author: video.description,
            videoId: video.id
          }
        }
      ])
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
    }

    const saveStartProgress = async (media: any) => {
      if (props.previewMode) {
        return
      }

      await learnPlayV2.updateProgress(buildDataProgress(media, false))
    }

    const saveEndProgress = async (media: any) => {
      if (props.previewMode) {
        return
      }

      await learnPlayV2.updateProgress(buildDataProgress(media, true))
    }

    const buildDataProgress = (media: any, finish: boolean) => {
      if (child.currentChildren.value) {
        const childId = child.currentChildren.value[0].id
        const bookProgress = {
          id: media.currentTrack.meta.videoId,
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

    return {
      onPlayerReady,
      changeVideoTrack,
      saveStartProgress,
      saveEndProgress,
      ...commonPlayerFunctions,
      currentBookVideo: learnPlayV2.computedProps.currentBookVideo,
      getBook: learnPlayV2.computedProps.getBook,
      getRelatedBooks: learnPlayV2.computedProps.getRelatedBooks,
      title,
      author
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
