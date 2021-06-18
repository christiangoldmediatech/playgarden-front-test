<template>
  <v-main>
    <v-container fluid class="pa-0">
      <horizontal-ribbon-card>
        <child-select :value="id" hide-details />
        <music-carousel-letter
          :value="selectedLetterId"
          :disabled-letters="disabledLetters"
          @select="selectLetter"
        />
      </horizontal-ribbon-card>
      <v-expand-transition>
        <new-music-player
          v-show="isPlayerShowing"
          ref="musicPlayer"
          @currentSong="currentSong = $event"
          @favorite="handleFavorite"
        />
      </v-expand-transition>
      <music-song-list
        id="music-song-list"
        :show-only-favorites="showOnlyFavorites"
        :is-player-showing="isPlayerShowing"
        :mobile="isMobile"
        :all-songs="allSongsWithFavorites"
        :songs-by-curriculum-type="songsByCurriculumTypeWithFavorites"
        @addSong="addSongToPlaylist"
        @newPlayList="createNewPlaylist"
        @favorite="handleFavorite"
        @showFavorites="showOnlyFavorites = !showOnlyFavorites"
      />
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
// @ts-ignore
import debounce from 'lodash/debounce'

import MusicSongList from '@/components/app/music/MusicSongList.vue'
import NewMusicPlayer from '@/components/app/music/NewMusicPlayer.vue'
import HorizontalRibbonCard from '@/components/ui/cards/HorizontalCardRibbon.vue'
import ChildSelect from '@/components/app/ChildSelect.vue'
import MusicCarouselLetter from '@/components/app/music/MusicLetterCarousel.vue'

import { useMusic } from '@/composables'
import { onMounted, ref, computed, useRoute, watch, onUnmounted } from '@nuxtjs/composition-api'
import { MusicLibrary } from '@/models'

const PAGE_MOBILE_BREAKPOINT = 1264
const MOBILE_PLAYER_HEIGHT = 135

export default {
  name: 'Index',

  components: {
    MusicSongList,
    NewMusicPlayer,
    HorizontalRibbonCard,
    ChildSelect,
    MusicCarouselLetter
  },

  setup (_, ctx) {
    const route = useRoute()
    // this references `ref="musicPlayer"` when the component is mounted
    const musicPlayer = ref<any>(null)
    const {
      allSongsWithFavorites,
      currentSong,
      favoritesDictionary,
      getFavoriteMusicForChild,
      getMusicLibrariesByCurriculumType,
      playlist,
      removeFavoriteMusic,
      setFavoriteMusicForChild,
      showOnlyFavorites,
      sendCurrentPlayingMusic,
      songsByCurriculumTypeWithFavorites
    } = useMusic()

    const isMobile = computed(() => ctx.root.$vuetify.breakpoint.width <= PAGE_MOBILE_BREAKPOINT)
    const isPlayerShowing = computed(() => playlist.value.length > 0)
    const didScrollToBottom = ref(false)

    const handleScroll = () => {
      didScrollToBottom.value = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.scrollHeight - MOBILE_PLAYER_HEIGHT
    }

    const debouncedHandleScroll = debounce(handleScroll, 50)

    const id = computed(() => typeof route.value.query.id === 'string'
      ? parseInt(route.value.query.id)
      : null
    )
    watch(id, async (val) => {
      if (val) {
        await getAndSetFavorites()
      }
    })

    watch(currentSong, async (val) => {
      if (!val || !id.value) {
        return
      }

      await sendCurrentPlayingMusic(val.id, id.value)
      scrollToSong(val.id)
    })

    onMounted(async () => {
      await getMusicLibrariesByCurriculumType()
      await getAndSetFavorites()

      window.addEventListener('scroll', debouncedHandleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', debouncedHandleScroll)
    })

    const updateCurrentSongData = () => {
      if (!currentSong.value) {
        return
      }

      const resolvedCurrentSong = Object.keys(currentSong.value || {}).length
        ? { ...currentSong.value }
        : undefined

      if (!resolvedCurrentSong) {
        return
      }

      const favorite = favoritesDictionary.value[resolvedCurrentSong.id]

      if (musicPlayer.value) {
        musicPlayer.value.refreshSongData({
          ...resolvedCurrentSong,
          isFavorite: !!favorite,
          favoriteId: favorite ? favorite.id : undefined
        })
      }
    }

    const getAndSetFavorites = async () => {
      if (!id.value) {
        return
      }

      await getFavoriteMusicForChild(id.value)
      updateCurrentSongData()
    }

    const addSongToPlaylist = (song: MusicLibrary) => {
      if (musicPlayer.value) {
        musicPlayer.value.addSongToPlaylist(song)
        playlist.value.push(song)
      }
    }

    const createNewPlaylist = (playList: MusicLibrary[]) => {
      if (musicPlayer.value) {
        musicPlayer.value.createNewPlaylist(playList)
        playlist.value = playList
      }
    }

    const handleFavorite = async (song: MusicLibrary) => {
      try {
        if (song.isFavorite && song.favoriteId) {
          await removeFavoriteMusic(song.favoriteId)
          // @ts-ignore
          ctx.root.$snotify.success('Song removed from favorites')
        } else if (id.value) {
          await setFavoriteMusicForChild(id.value, song.id)
          // @ts-ignore
          ctx.root.$snotify.success('Song added to favorites')
        }

        await getAndSetFavorites()
      } catch (error) {
        // @ts-ignore
        ctx.root.$snotify.error(error.message)
      }
    }

    const scrollToSong = (id: number) => {
      if (isMobile.value) {
        return
      }

      try {
        ctx.root.$vuetify.goTo(`#playlist-song-${id}`, {
          container: '#playlist',
          offset: -63
        })
      } catch (err) {}
    }

    const selectedLetterId = ref<number | undefined>(undefined)

    const selectedLetter = (letterId: number) => {
      selectedLetterId.value = selectedLetterId.value === letterId ? undefined : letterId
    }

    return {
      addSongToPlaylist,
      allSongsWithFavorites,
      createNewPlaylist,
      currentSong,
      didScrollToBottom,
      getAndSetFavorites,
      handleFavorite,
      id,
      isMobile,
      isPlayerShowing,
      musicPlayer,
      playlist,
      showOnlyFavorites,
      songsByCurriculumTypeWithFavorites,
      selectedLetter
    }
  },

  computed: {
    ...mapGetters({ currentChild: 'getCurrentChild' })
  },

  created () {
    // @ts-ignore
    if (!this.id && this.currentChild.length && this.$route.name) {
      this.$router.push({
        name: this.$route.name,
        query: { id: this.currentChild[0].id }
      })
    }
  }
}
</script>
