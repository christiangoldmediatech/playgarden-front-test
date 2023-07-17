<template>
  <library-content-section
    :titles="{
      columnA: 'Recommended for you',
      columnB: 'More Lessons for You'
    }"
    @scroll:last-reached="handleLastReached"
  >
    <template #columnA>
      <pg-video-player
        id="libraryInlinePlayer"
        class="library-inline-player"
        inline
        v-bind="{ isFavoritesLoading }"
        @ready="onPlayerReady"
        @on-favorites-clicked="handleFavoritesClicked"
        @on-fullscreen-change="handleFullscreenChange"
        v-on="playerEvents"
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
              <div class="player-text-top-part">
                <div v-if="icon" class="player-preview-activity-icon" :style="{ '--border-color': color }">
                  <img :src="icon">
                </div>
                <div>
                  <div class="player-preview-vow">
                    Video of the week
                  </div>
                  <div class="player-preview-title">
                    {{ title }}
                  </div>
                </div>
              </div>
              <div class="player-preview-author">
                With {{ author }}
              </div>
            </div>
          </div>
        </template>
        <patch-earned-dialog-composition-api
          v-if="patchData.icon && patchData.category"
          v-model="showPatchEarnedDialog"
          v-bind="patchData"
          attach="#libraryInlinePlayer"
          @next-video="getVideosAfterClosingPatchEarned"
          @return="closeAll"
        />
      </pg-video-player>
    </template>
    <template #columnB>
      <library-video-card
        v-for="(mediaObject, index) in additionalVideos"
        :key="`additional-video-${mediaObject.meta.videoId}`"
        :class="{
          'mr-2 mr-lg-0 mb-lg-2': !isLastIndex(index, additionalVideos)
        }"
        v-bind="{ mediaObject }"
        @play="handleVideoCardPlay"
      />
      <div class="loading-more mt-4" :class="{ 'ml-4': columnIsHorizontal }">
        <v-progress-circular
          v-if="isLoadingMore"
          color="accent"
          indeterminate
          size="64"
          width="6"
        />
      </div>
    </template>
  </library-content-section>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, nextTick, useStore, watch } from '@nuxtjs/composition-api'
import { useLibraryV2, useFavorites, useFavoritesApi, useGtmHelper, useChild, useInlineLibraryPlayerCallbacks, usePatch, useVuetifyHelper } from '@/composables'
import { getHexNonTransparentColor } from '@/utils/colorTools'
import { isLastIndex } from '@/utils/array.util'
import { KidsCorner, TypedStore } from '@/models'

// @ts-ignore
import PgVideoPlayer from '@gold-media-tech/pg-video-player'
import { PlayerInstance } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import LibraryContentSection from '@/components/app/library/LibraryContentSection.vue'
import LibraryVideoCard from '@/components/app/library/LibraryVideoCard.vue'
import PatchEarnedDialogCompositionApi from '@/components/app/PatchEarnedDialogCompositionApi.vue'
import { useKidsCorner } from '@/composables/kids-corner'
import { debounce } from 'lodash'

export default defineComponent({
  name: 'LibraryInlinePlayer',

  components: {
    PgVideoPlayer,
    LibraryContentSection,
    LibraryVideoCard,
    PatchEarnedDialogCompositionApi
  },

  setup() {
    // Video preview concerns
    const scaleIcon = ref(false)
    const showPreview = ref(true)
    const allowInfiniteScrolling = ref(true)
    const kidsCornerVideos = ref<KidsCorner[]>([])
    const vuetify = useVuetifyHelper()
    const columnIsHorizontal = computed(() => vuetify.breakpoint.mdAndDown)
    function scaleUp() {
      scaleIcon.value = true
    }

    function scaleDown() {
      scaleIcon.value = false
    }

    const { getFilteredKidsCornerVideos, getKidsCornerVideos, getMediaObjectFromVideoData } = useKidsCorner()

    // Video data
    const { recommended, getRecommendedVideosData } = useLibraryV2()
    const currentVideo = computed(() => recommended.value[0])

    // Current video parameters
    const title = computed(() => currentVideo.value?.title ?? '')
    const author = computed(() => currentVideo.value?.meta?.author ?? '')
    const icon = computed(() => currentVideo.value?.meta?.activityType?.icon ?? '')
    const color = computed(() => {
      const hexColor = currentVideo.value?.meta?.activityType?.color ?? ''
      if (hexColor) {
        return getHexNonTransparentColor(hexColor, 0.6125)
      }
      return ''
    })

    // Handle favorites
    const store = useStore()
    const gtm = useGtmHelper()
    const isFavoritesLoading = ref(false)
    const { favoriteVideoIds } = useFavorites()
    const { handleFavoritesClicked } = useFavoritesApi({ store, gtm, isHandlingFavorites: isFavoritesLoading })

    // Player functions and variables
    const { curatePlaylist } = useFavorites()
    const player = ref<PlayerInstance | null>(null)

    const curatedPlaylist = computed(() => {
      const resultingList = curatePlaylist(recommended.value, favoriteVideoIds.value)
      return resultingList
    })

    watch(curatedPlaylist, () => {
      if (player.value) {
        player.value.replacePlaylist(curatedPlaylist.value)
      }
    })

    const additionalVideos = computed(() => {
      const curatedVideos = curatedPlaylist.value.length ? curatedPlaylist.value.slice(1) : []
      const formattedKidsCorner = kidsCornerVideos.value.map(video => getMediaObjectFromVideoData(video))
      return [...curatedVideos, ...formattedKidsCorner]
    })

    // Handle when player is ready
    function onPlayerReady(playerInstance: PlayerInstance) {
      player.value = playerInstance
      player.value.loadPlaylist(curatedPlaylist.value)
    }

    // Handle video play from video preview
    function handlePlay(firstPlay: () => void):void {
      firstPlay()
      showPreview.value = false
    }

    // Handle loading more videos when clicking on video card
    const isLoadingMore = ref(false)
    async function loadMoreVideos(mediaObject: MediaObject): Promise<any> {
      try {
        if (player.value) {
          isLoadingMore.value = true
          if (mediaObject) {
            const basePlaylist = curatePlaylist([mediaObject])
            recommended.value = basePlaylist
            await getRecommendedVideosData(14, basePlaylist[0])
            nextTick(() => {
              const updatedPlaylist = [basePlaylist[0], ...additionalVideos.value]
              recommended.value = updatedPlaylist
              isLoadingMore.value = false
            })
          }
        }
      } catch (error) {
        Promise.reject(error)
        isLoadingMore.value = false
      }
    }

    const handleLastReached = debounce(async () => {
      if (!allowInfiniteScrolling.value) { return }
      if (isLoadingMore.value) { return }

      const videosIds = kidsCornerVideos.value.map(video => video.id)

      isLoadingMore.value = true
      let videos: KidsCorner[] = []
      if (kidsCornerVideos.value.length === 0) {
        const response = (await getKidsCornerVideos(15))
        videos = [response.current, ...response.nextUp]
      } else {
        videos = await getFilteredKidsCornerVideos(videosIds as number[], 15)
      }
      isLoadingMore.value = false

      if (videos.length === 0) {
        allowInfiniteScrolling.value = false
      }

      kidsCornerVideos.value = [...kidsCornerVideos.value, ...videos]
    }, 100)

    async function handleVideoCardPlay(mediaObject: MediaObject): Promise<any> {
      try {
        if (player.value) {
          player.value.pause()
          player.value.loadPlaylist([mediaObject])
          showPreview.value = true
          await loadMoreVideos(mediaObject)
        }
      } catch (error) {
        Promise.reject(error)
        isLoadingMore.value = false
      }
    }

    // Player callbacks
    const typedStore = useStore<TypedStore>()
    const { currentChildren } = useChild({ store: typedStore })

    const showPatchEarnedDialog = ref(false)
    const { patchData, patchEarned } = usePatch()
    function getVideosAfterVideoEnded (mediaObject?: MediaObject) {
      if (!mediaObject || !player.value) {
        return
      }
      if (player.value && patchEarned.value && patchData.value.category && patchData.value.icon) {
        player.value.pause()
        showPatchEarnedDialog.value = true
        patchEarned.value = false
      } else {
        player.value.loadPlaylist([mediaObject])
        player.value.setStatus('IDLE')
        player.value.play()
        loadMoreVideos(mediaObject)
      }
    }

    function goToPreviousTrack(): void {
      if (!player.value) {
        return
      }

      const index = player.value.getCurrentIndex()
      const playlist = player.value.getPlaylist()
      const lastIndex = playlist.length - 1

      if (index > 0) {
        player.value.pause()
        player.value.loadTrack(index - 1)
        player.value.setStatus('IDLE')
        player.value.play()
      } else {
        player.value.pause()
        player.value.loadTrack(lastIndex)
        player.value.setStatus('IDLE')
        player.value.play()
      }
    }

    function getVideosAfterClosingPatchEarned () {
      if (!player.value) {
        return
      }
      const nextTrack = player.value.getNextTrack()

      if (nextTrack) {
        player.value.loadPlaylist([nextTrack])
        player.value.setStatus('IDLE')
        player.value.play()
        loadMoreVideos(nextTrack)
      }
    }

    const isFullscreen = ref(false)

    const handleFullscreenChange = (val: boolean): void => {
      isFullscreen.value = val
      const htmlElem = document.querySelector('html')
      if (htmlElem) {
        htmlElem.style.backgroundColor = val ? '#000000' : '#FFFFFF'
      }
    }

    function closeAll() {
      if (player.value) {
        const nextTrack = player.value.getNextTrack()
        if (nextTrack) {
          if (isFullscreen.value) {
            player.value.handleFullscreen()
          }

          player.value.loadPlaylist([nextTrack])
          loadMoreVideos(nextTrack)
          showPreview.value = true
        }
      }
    }

    const { playerEvents } = useInlineLibraryPlayerCallbacks({
      children: currentChildren,
      getNextVideos: getVideosAfterVideoEnded,
      goToPreviousTrack
    })

    onMounted(async () => {
      await handleLastReached()
    })

    return {
      onPlayerReady,
      scaleIcon,
      showPreview,
      scaleUp,
      scaleDown,
      currentVideo,
      additionalVideos,
      isLastIndex,
      title,
      author,
      icon,
      color,
      handleVideoCardPlay,
      handlePlay,
      isLoadingMore,
      handleFavoritesClicked,
      isFavoritesLoading,
      playerEvents,
      showPatchEarnedDialog,
      patchData,
      patchEarned,
      getVideosAfterClosingPatchEarned,
      handleFullscreenChange,
      closeAll,
      handleLastReached,
      columnIsHorizontal
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/library/library-inline-player.scss';
</style>
