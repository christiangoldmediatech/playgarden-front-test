<template>
  <PgVideoPlayer
    v-bind="{ isFavoritesLoading }"
    @on-favorites-clicked="onFavoritesClicked"
    @ready="onPlayerReady"
  />
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount, useStore } from '@nuxtjs/composition-api'

// @ts-ignore
import PgVideoPlayer from '@gold-media-tech/pg-video-player'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import { useFavorites, useFavoritesApi, useGtmHelper, useNuxtHelper } from '@/composables'
import { PlayerInstance, PlayerInstanceEvent } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'

export default defineComponent({
  name: 'CmsVideoPlayer',

  components: {
    PgVideoPlayer
  },

  setup() {
    let player: PlayerInstance
    const playlist = ref<MediaObject[]>([])

    function onPlayerReady(instance: PlayerInstance) {
      player = instance
    }

    // Activation Setup
    function openPlayer() {
      player.open()
      player.loadPlaylist(playlist.value)
      player.play()
    }

    const nuxt = useNuxtHelper()
    onBeforeMount(() => {
      nuxt.$on('open-cms-video-player', (params: MediaObject[]) => {
        playlist.value = params
        openPlayer()
      })
    })

    // Favorites
    const store = useStore()
    const gtm = useGtmHelper()
    const isFavoritesLoading = ref(false)
    const { curatePlaylist, favoriteVideoIds } = useFavorites()
    const { handleFavoritesClicked } = useFavoritesApi({ store, gtm, isHandlingFavorites: isFavoritesLoading })

    async function onFavoritesClicked (event: PlayerInstanceEvent) {
      await handleFavoritesClicked(event)
      playlist.value = curatePlaylist(playlist.value, favoriteVideoIds.value)
      player.replacePlaylist(playlist.value)
    }

    return {
      onPlayerReady,
      onFavoritesClicked,
      isFavoritesLoading
    }
  }
})
</script>
