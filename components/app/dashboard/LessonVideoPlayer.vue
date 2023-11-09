<template>
  <div class="pg-player-wrapper">
    <PgVideoPlayer
      id="lessonVideoPlayer"
      :control-config="{
        favorite: shouldShowFavorite,
        unlock: toUnlock && puzzlePieceImg !== null
      }"
      :next-unlock-image="puzzlePieceImg"
      :unlock-number="toUnlock"
      :unlock-text="$t('videoPlayer.puzzlePiece')"
      force-default-poster
      v-bind="{
        isFavoritesLoading
      }"
      @ready="onPlayerReady"
      @on-favorites-clicked="onFavoritesClicked"
      v-on="callbacks"
    >
      <template v-if="puzzlePieceImg" #unlock-image>
        <img
          class="puzzle-piece-img"
          :src="puzzlePieceImg"
          @click="onPuzzlePieceClick"
        />
      </template>
      <LessonCompletedDialog
        v-model="isLessonCompleted"
        attach="lessonVideoPlayer"
        @exit="triggerScheduleDialog"
        @return="onLessonCompletedDialogClose"
      />
      <LessonScheduleFinished v-model="isShowingScheduleDialog" :should-advance="lessonData.curriculumType.letter === 'In'" />
      <PuzzleClipPath />
    </PgVideoPlayer>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onBeforeMount,
  useStore,
  useRoute,
  useRouter,
  computed,
  onBeforeUnmount
} from '@nuxtjs/composition-api'

// @ts-ignore
import PgVideoPlayer from '@gold-media-tech/pg-video-player'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import {
  useFavorites,
  useFavoritesApi,
  useGtmHelper,
  useNuxtHelper,
  useLessonVideoPlayerCallbacks,
  useIsLessonCompleted
} from '@/composables'
import {
  PlayerInstance,
  PlayerInstanceEvent
} from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { TypedStore } from '@/models'

import LessonCompletedDialog from '@/components/app/dashboard/LessonCompletedDialog.vue'
import PuzzleClipPath from '@/components/PuzzleClipPath.vue'
import LessonScheduleFinished from '@/components/app/dashboard/worksheets/LessonSceduleFinished.vue'
import { mapGetters } from 'vuex'

type LessonVideoPlayerParams = {
  playlist: MediaObject[]
  index: number
}

export default defineComponent({
  name: 'LessonVideoPlayer',

  components: {
    LessonScheduleFinished,
    PgVideoPlayer,
    LessonCompletedDialog,
    PuzzleClipPath
  },

  computed: {
    ...mapGetters('admin/curriculum', { lessonData: 'getLesson' })
  },

  setup() {
    const store = useStore<TypedStore>()
    const route = useRoute()
    const router = useRouter()
    const nuxt = useNuxtHelper()
    const gtm = useGtmHelper()

    let player: PlayerInstance

    const isShowingScheduleDialog = ref(false)

    // Favorites section
    const isFavoritesLoading = ref(false)
    const { curatePlaylist } = useFavorites()
    const { handleFavoritesClicked } = useFavoritesApi({
      store,
      gtm,
      isHandlingFavorites: isFavoritesLoading
    })

    async function onFavoritesClicked(event: PlayerInstanceEvent) {
      await handleFavoritesClicked(event)
      player.replacePlaylist(curatePlaylist(player.getPlaylist()))
    }

    // Show favorite control when not in admin preview mode
    const shouldShowFavorite = computed(() => {
      const previewMode =
        !store.getters['admin/curriculum/getLesson']?.previewMode ?? true
      return previewMode
    })

    // Get player instance
    const callbacks = ref<any>(undefined)
    const { isLessonCompleted } = useIsLessonCompleted()
    function onPlayerReady(instance: PlayerInstance) {
      player = instance
      const { playerEvents } = useLessonVideoPlayerCallbacks({
        store,
        route,
        router,
        nuxt,
        playerInstance: player
      })
      callbacks.value = playerEvents
    }

    // Setup nuxt event listener for opening player
    onBeforeMount(() => {
      nuxt.$on(
        'open-lesson-video-player',
        (params: LessonVideoPlayerParams) => {
          const curatedPlaylist = curatePlaylist(params.playlist)
          player.loadPlaylist(curatedPlaylist, params.index)
          player.open()
          player.handleFullscreen()
          player.popControls()
          player.play()
        }
      )
    })

    onBeforeUnmount(() => {
      nuxt.$off('open-lesson-video-player')
    })

    // Close player when we close the lesson completed dialog
    function onLessonCompletedDialogClose() {
      isLessonCompleted.value = false
      player.close()
    }

    function triggerScheduleDialog() {
      isLessonCompleted.value = false
      isShowingScheduleDialog.value = true
    }

    // Puzzle piece image
    const puzzlePieceImg = computed(() => {
      const puzzlePiece: any = store.state.children.lesson.puzzlePiece as any
      return puzzlePiece?.puzzle?.image ?? null
    })

    // Videos to watch before unlocking puzzle piece
    const toUnlock = computed(() => {
      const lesson = store.getters['admin/curriculum/getLesson']
      if (lesson) {
        let count = 0
        lesson.videos.forEach((video: any) => {
          count += Number(
            Boolean(video && video.viewed && video.viewed.completed)
          )
        })
        return lesson.videos.length - count
      }
      return 0
    })

    // Skip to next video when clicking on next up puzzle piece image
    function onPuzzlePieceClick() {
      player.skip()
    }

    return {
      isLessonCompleted,
      isFavoritesLoading,
      shouldShowFavorite,
      puzzlePieceImg,
      toUnlock,
      onPuzzlePieceClick,
      onPlayerReady,
      onLessonCompletedDialogClose,
      onFavoritesClicked,
      callbacks,
      isShowingScheduleDialog,
      triggerScheduleDialog
    }
  }
})
</script>

<style lang="scss">
.puzzle-piece-img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: none !important;
  object-position: center center;
  clip-path: url(#myClip);
  cursor: pointer;
}
</style>
