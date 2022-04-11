<template>
  <library-layout :loading="isLoadingInitialData" title="Favorites" back-btn>
    <v-row align="stretch">
      <v-col
        v-for="(mediaObject, playlistIndex) in playlist"
        :key="`favorite-video-${mediaObject.meta.videoId}`"
        cols="6"
        lg="4"
      >
        <letter-video-card
          v-bind="{ mediaObject }"
          @play="handlePlayVideo(playlistIndex)"
        />
      </v-col>
    </v-row>
    <library-standard-player id="favoritesPlayer" v-bind="{ playlist, customPlayerEvents }" @ready="onPlayerReady" />
  </library-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, useStore, ref } from '@nuxtjs/composition-api'
import { useLibraryFavorites, useFavorites, useNuxtHelper, useLibraryFavoritesCallbacks, useChild } from '@/composables'
import { TypedStore } from '@/models'
import LibraryLayout from '@/components/app/library/LibraryLayout.vue'
import LibraryStandardPlayer from '@/components/app/library/LibraryStandardPlayer.vue'
import LetterVideoCard from '@/components/app/library/LetterVideoCard.vue'
import { PlayerInstance } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'

export default defineComponent({
  name: 'LibraryFavoritesPage',

  components: {
    LibraryLayout,
    LibraryStandardPlayer,
    LetterVideoCard
  },

  setup() {
    const nuxt = useNuxtHelper()
    const store = useStore<TypedStore>()
    const { currentChildren } = useChild({ store })
    const { libraryFavoritePlaylist, getLibraryFavoriteActivities } = useLibraryFavorites()
    const { favoriteVideoIds, curatePlaylist } = useFavorites()

    const playlist = computed(() => {
      const resultingList = curatePlaylist(libraryFavoritePlaylist.value, favoriteVideoIds.value)
      return resultingList
    })

    // load playlist
    const isLoadingInitialData = ref(true)
    onMounted(async () => {
      isLoadingInitialData.value = true
      await getLibraryFavoriteActivities()
      isLoadingInitialData.value = false
    })

    function handlePlayVideo(index: number): void {
      nuxt.$emit('favoritesPlayer-play-track', index)
    }

    const customPlayerEvents = ref<any>(undefined)
    function onPlayerReady(player: PlayerInstance) {
      function afterOnEnded(): void {
        player.goToNextTrack()
      }
      const { playerEvents } = useLibraryFavoritesCallbacks({ children: currentChildren, afterOnEnded })
      customPlayerEvents.value = playerEvents
    }

    return {
      isLoadingInitialData,
      libraryFavoritePlaylist,
      playlist,
      favoriteVideoIds,
      customPlayerEvents,
      onPlayerReady,
      handlePlayVideo
    }
  }
})
</script>
