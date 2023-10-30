<template>
  <pg-video-player
    id="videoPathPlayer"
    :control-config="{
      unlock: (patchImg && toUnlock !== null)
    }"
    :unlock-number="toUnlock"
    :unlock-text="$t('videoPlayer.patch')"
    v-bind="{ isFavoritesLoading }"
    @ready="onPlayerReady"
    @on-favorites-clicked="handleFavoritesClicked"
    @on-close="updateList"
    v-on="playerEvents"
  >
    <template v-if="patchImg" #unlock-image>
      <img class="patch-img" :src="patchImg" @click="player.skip">
    </template>
    <patch-earned-dialog-composition-api
      v-if="patchData.icon && patchData.category"
      v-model="showPatchEarnedDialog"
      v-bind="patchData"
      attach="#libraryInlinePlayer"
      @next-video="goToNextVideo"
      @return="closeAll"
    />
  </pg-video-player>
</template>

<script lang="ts">
import { defineComponent, PropType, useStore, ref, computed, watch, onBeforeUnmount } from '@nuxtjs/composition-api'
import { useGtmHelper, useFavorites, useFavoritesApi, usePatch, useLibraryStandardCallbacks, useChild, useNuxtHelper } from '@/composables'
// @ts-ignore
import PgVideoPlayer from '@gold-media-tech/pg-video-player'
import PatchEarnedDialogCompositionApi from '@/components/app/PatchEarnedDialogCompositionApi.vue'
import { PLAYER_EVENTS, PlayerInstance } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import { TypedStore } from '@/models'

export default defineComponent({
  name: 'LibraryVideoPathPlayer',
  computed: {
    PLAYER_EVENTS() {
      return PLAYER_EVENTS
    }
  },

  emits: ['update-library'],

  components: {
    PgVideoPlayer,
    PatchEarnedDialogCompositionApi
  },

  props: {
    playlist: {
      type: Array as PropType<MediaObject[]>,
      required: false,
      default: []
    }
  },

  setup(props, { emit }) {
    // Player and favorites
    const store = useStore()
    const typedStore = useStore<TypedStore>()
    const gtm = useGtmHelper()
    const player = ref<PlayerInstance | null>(null)
    const isFavoritesLoading = ref(false)
    const { favoriteVideoIds, curatePlaylist } = useFavorites()
    const { currentChildren } = useChild({ store: typedStore })
    const { handleFavoritesClicked } = useFavoritesApi({ store, gtm, isHandlingFavorites: isFavoritesLoading })

    // This will result in the list being automatically updated whenever favorites or playlist is updated
    const curatedPlaylist = computed(() => {
      const resultingList = curatePlaylist(props.playlist, favoriteVideoIds.value)
      return resultingList
    })

    watch(curatedPlaylist, () => {
      if (player.value) {
        player.value.replacePlaylist(curatedPlaylist.value)
      }
    })

    // Handle external play command
    const nuxt = useNuxtHelper()
    nuxt.$on('videoPathPlayer-play-track', (index: number) => {
      if (player.value) {
        player.value.loadTrack(index)
        player.value.open()
        player.value.play()
      }
    })

    onBeforeUnmount(() => {
      nuxt.$off('videoPathPlayer-play-track')
    })

    function onPlayerReady(playerInstance: PlayerInstance): void {
      player.value = playerInstance
      player.value.loadPlaylist(curatedPlaylist.value)
    }

    // Patches
    const { patchData, patchEarned, patchImg, toUnlock } = usePatch()
    const showPatchEarnedDialog = ref(false)

    function goToNextVideo(): void {
      if (!player.value) {
        return
      }

      const index = player.value.getCurrentIndex()
      const playlist = player.value.getPlaylist()
      const lastIndex = playlist.length - 1

      if (index < lastIndex) {
        player.value.goToNextTrack()
      } else {
        player.value.pause()
        player.value.loadTrack(0)
        player.value.setStatus('IDLE')
        player.value.play()
      }
    }

    function handlePatchEarnedOnEnded(): void {
      if (player.value && patchEarned.value && patchData.value.icon && patchData.value.category) {
        player.value.pause()
        showPatchEarnedDialog.value = true
        patchEarned.value = false
      } else {
        goToNextVideo()
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

    const { playerEvents } = useLibraryStandardCallbacks({ children: currentChildren, afterOnEnded: handlePatchEarnedOnEnded, goToPreviousTrack })

    function closeAll(): void {
      if (player.value) {
        player.value.close()
      }
    }

    const updateList = () => {
      emit('update-library')
    }

    return {
      player,
      isFavoritesLoading,
      onPlayerReady,
      handleFavoritesClicked,
      showPatchEarnedDialog,
      patchData,
      patchEarned,
      patchImg,
      toUnlock,
      playerEvents,
      goToNextVideo,
      closeAll,
      updateList
    }
  }
})
</script>

<style lang="scss" scoped>
.patch-img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
  object-position: center center;
}
</style>
