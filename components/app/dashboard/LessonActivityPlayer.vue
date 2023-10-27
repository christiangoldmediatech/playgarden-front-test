<template>
  <div class="pg-player-wrapper">
    <PgVideoPlayer
      id="lessonActivityPlayer"
      :control-config="{
        favorite: shouldShowFavorite,
        unlock: (toUnlock && puzzlePieceImg !== null)
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
        <img class="puzzle-piece-img" :src="puzzlePieceImg" @click="onPuzzlePieceClick">
      </template>
      <LessonActivitiesFinishedDialog
        v-model="isLessonActivitiesFinished"
        attach="#lessonActivityPlayer"
        @next-finished="onNextLesson"
      />
      <PuzzleClipPath />
    </PgVideoPlayer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, onBeforeUnmount, ref, useRoute, useRouter, useStore, watch } from '@nuxtjs/composition-api'

// @ts-ignore
import PgVideoPlayer from '@gold-media-tech/pg-video-player'
import { useFavorites, useFavoritesApi, useGtmHelper, useIsLessonActivitiesFinished, useLessonActivitiesPlayerCallbacks, useNuxtHelper } from '@/composables'
import { PlayerInstance, PlayerInstanceEvent } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import PuzzleClipPath from '@/components/PuzzleClipPath.vue'

import LessonActivitiesFinishedDialog from '@/components/app/dashboard/LessonActivitiesFinishedDialog.vue'
import { TypedStore } from '@/models'

type LessonActivityPlayerParams = {
  playlist: MediaObject[],
  index: number
}

export default defineComponent({
  name: 'LessonActivityPlayer',

  components: {
    PgVideoPlayer,
    LessonActivitiesFinishedDialog,
    PuzzleClipPath
  },

  setup() {
    const store = useStore<TypedStore>()
    const route = useRoute()
    const router = useRouter()
    const nuxt = useNuxtHelper()
    const gtm = useGtmHelper()
    let player: PlayerInstance

    // Favorites section
    const isFavoritesLoading = ref(false)
    const { curatePlaylist } = useFavorites()
    const { handleFavoritesClicked } = useFavoritesApi({ store, gtm, isHandlingFavorites: isFavoritesLoading })

    async function onFavoritesClicked(event: PlayerInstanceEvent) {
      await handleFavoritesClicked(event)
      player.replacePlaylist(curatePlaylist(player.getPlaylist()))
    }

    // Show favorite control when not in admin preview mode
    const shouldShowFavorite = computed(() => {
      const previewMode = !store.getters['admin/curriculum/getLesson']?.previewMode ?? true
      return previewMode
    })

    // Get player instance
    const callbacks = ref<any>({})
    const { isLessonActivitiesFinished } = useIsLessonActivitiesFinished()
    watch(isLessonActivitiesFinished, (val) => {
      if (!val) {
        player.close(false)
      }
    })
    function onPlayerReady(instance: PlayerInstance) {
      player = instance
      const { playerEvents } = useLessonActivitiesPlayerCallbacks({ store, route, router, nuxt, playerInstance: player })
      callbacks.value = playerEvents
    }

    onBeforeMount(() => {
      nuxt.$on('open-lesson-activity-player', ({ playlist, index }: LessonActivityPlayerParams) => {
        const curatedPlaylist = curatePlaylist(playlist)
        player.loadPlaylist(curatedPlaylist, index)
        player.open()
        player.handleFullscreen()
        player.popControls()
        player.play()
      })
    })

    onBeforeUnmount(() => {
      nuxt.$off('open-lesson-activity-player')
      isLessonActivitiesFinished.value = false
    })

    // Close player when we close the lesson completed dialog
    function onNextLesson() {
      // player.close()
      isLessonActivitiesFinished.value = false
    }

    // Puzzle piece image
    const puzzlePieceImg = computed(() => {
      const puzzlePiece: any = store.state.children.lesson?.puzzlePiece ?? {} as any
      return puzzlePiece?.puzzle?.image ?? null
    })

    // Videos to watch before unlocking puzzle piece
    const toUnlock = computed(() => {
      const lesson = store.getters['admin/curriculum/getLesson']
      if (lesson) {
        let count = 0
        lesson.lessonsActivities.forEach((lessonActivity: any) => {
          count += Number(Boolean(lessonActivity.activity && lessonActivity.activity.viewed && lessonActivity.activity.viewed.completed))
        })
        return lesson.lessonsActivities.length - count
      }
      return 0
    })

    // Skip to next video when clicking on next up puzzle piece image
    function onPuzzlePieceClick() {
      player.skip()
    }

    return {
      shouldShowFavorite,
      isFavoritesLoading,
      isLessonActivitiesFinished,
      callbacks,
      onFavoritesClicked,
      onNextLesson,
      onPlayerReady,
      puzzlePieceImg,
      toUnlock,
      onPuzzlePieceClick
    }
  }
})
</script>
