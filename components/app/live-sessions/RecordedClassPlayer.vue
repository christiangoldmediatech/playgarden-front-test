<template>
  <pg-video-player
    auto-play
    force-default-poster
    no-auto-track-change
    :is-favorites-loading="isLoadingFavorites"
    @ready="onPlayerReady"
    @on-favorites-clicked="onFavoritesClicked"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeMount,
  useStore
} from '@nuxtjs/composition-api'
import {
  useNuxtHelper,
  useGtmHelper,
  useFavoritesApi,
  useFavorites
} from '@/composables'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import {
  PlayerInstance,
  PlayerInstanceEvent
} from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'

export default defineComponent({
  name: 'RecordedClassPlayer',

  setup() {
    const $nuxt = useNuxtHelper()
    const gtm = useGtmHelper()
    const store = useStore()
    const {
      isLoadingFavorites,
      getAllFavorites,
      curatePlaylist
    } = useFavorites()
    const { handleFavorite } = useFavoritesApi({ gtm, store })
    let playerInstance: PlayerInstance

    // Get favorites
    onBeforeMount(() => {
      // Just get all favorites
      getAllFavorites()
    })

    // Function for setting up player
    function onPlayerReady(player: PlayerInstance) {
      playerInstance = player
    }

    // Function for handling favorites clicked
    async function onFavoritesClicked({ currentTrack }: PlayerInstanceEvent) {
      try {
        if (playerInstance && currentTrack) {
          const videoId = currentTrack?.meta?.videoId as number
          const title = currentTrack?.title as string
          if (videoId) {
            isLoadingFavorites.value = true
            await handleFavorite(videoId, title)
            await getAllFavorites()
            const playlist = curatePlaylist([currentTrack])
            playerInstance.replacePlaylist(playlist)
          }
        }
      } catch (error) {
        return Promise.reject(error)
      } finally {
        isLoadingFavorites.value = false
      }
    }

    // Setup opening message callback
    $nuxt.$on('open-recorded-class-player', (playlist: MediaObject[]) => {
      if (playerInstance) {
        playerInstance.loadPlaylist(playlist)
        playerInstance.open()
        playerInstance.play()
      }
    })

    return {
      isLoadingFavorites,
      onPlayerReady,
      onFavoritesClicked
    }
  }
})
</script>
