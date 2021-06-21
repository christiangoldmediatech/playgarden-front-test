<template>
  <v-main>
    <v-container fluid class="pa-0">
      <horizontal-ribbon-card
        :is-minimized.sync="isTopRibbonMinimized"
      >
        <v-row no-gutters class="ml-10 mr-6 mt-4">
          <v-col cols="12" md="3" align-self="center">
            <child-select
              v-if="id"
              hide-details
              :value="id"
              @input="id = $event"
            />
          </v-col>
          <v-col cols="12" md="9" align-self="center" class="mt-2 mt-md-0">
            <music-carousel-letter
              :value="selectedLetterId"
              :disabled-letters="disabledLetters"
              @select="selectLetter"
            />
          </v-col>
        </v-row>
      </horizontal-ribbon-card>
      <v-expand-transition>
        <new-music-player
          ref="musicPlayer"
          @currentSong="currentSong = $event"
          @favorite="handleFavorite"
        />
      </v-expand-transition>
      <music-song-list
        id="music-song-list"
        :show-only-favorites="showOnlyFavorites"
        :mobile="isMobile"
        :all-songs="allSongsWithFavorites"
        :songs-by-curriculum-type="songsByCurriculumTypeWithFavorites"
        :selected-letter-id="selectedLetterId"
        @addSong="addSongToPlaylist"
        @newPlayList="createNewPlaylist"
        @favorite="handleFavorite"
        @showFavorites="showOnlyFavorites = !showOnlyFavorites"
      />
    </v-container>
  </v-main>
</template>

<script lang="ts">
// @ts-ignore
import debounce from 'lodash/debounce'

import MusicSongList from '@/components/app/music/MusicSongList.vue'
import NewMusicPlayer from '@/components/app/music/NewMusicPlayer.vue'
import HorizontalRibbonCard from '@/components/ui/cards/HorizontalCardRibbon.vue'
import ChildSelect from '@/components/app/ChildSelect.vue'
import MusicCarouselLetter from '@/components/app/music/MusicLetterCarousel.vue'

import { useMusic, useSnotifyHelper, useVuetifyHelper } from '@/composables'
import { onMounted, ref, computed, useRoute, watch, onUnmounted, useStore, useRouter } from '@nuxtjs/composition-api'
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

  setup () {
    const vuetify = useVuetifyHelper()
    const snotify = useSnotifyHelper()
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
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

    const isMobile = computed(() => vuetify.breakpoint.width <= PAGE_MOBILE_BREAKPOINT)
    const isPlayerShowing = computed(() => playlist.value.length > 0)
    const didScrollToBottom = ref(false)

    const handleScroll = () => {
      didScrollToBottom.value = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.scrollHeight - MOBILE_PLAYER_HEIGHT
    }

    const debouncedHandleScroll = debounce(handleScroll, 50)

    const id = ref<number | null>(null)

    const setId = () => {
      if (typeof route.value.query.id !== 'string' && typeof route.value.query.id !== 'number') {
        id.value = null
        return
      }

      id.value = parseInt(route.value.query.id)
    }

    watch(id, async (val) => {
      if (val) {
        await getAndSetFavorites()
        setCurrentChildToRoute(val)
      }
    })

    watch(currentSong, async (val) => {
      if (!val || !id.value) {
        return
      }

      await sendCurrentPlayingMusic(val.id, id.value)
    })

    onMounted(async () => {
      await getMusicLibrariesByCurriculumType()
      await getAndSetFavorites()
      handleCurrentChild()
      setId()

      window.addEventListener('scroll', debouncedHandleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', debouncedHandleScroll)
    })

    const handleCurrentChild = () => {
      const currentChild = computed(() => store.getters.getCurrentChild)

      if (!id.value && currentChild.value?.length) {
        setCurrentChildToRoute(currentChild.value[0].id)
      }
    }

    const setCurrentChildToRoute = (id: number) => {
      if (id && route.value.name) {
        router.push({
          name: route.value.name,
          query: {
            id: `${id}`
          }
        })
      }
    }

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

        isTopRibbonMinimized.value = true
      }
    }

    const handleFavorite = async (song: MusicLibrary) => {
      try {
        if (song.isFavorite && song.favoriteId) {
          await removeFavoriteMusic(song.favoriteId)
          snotify.success('Song removed from favorites')
        } else if (id.value) {
          await setFavoriteMusicForChild(id.value, song.id)
          snotify.success('Song added to favorites')
        }

        await getAndSetFavorites()
      } catch (error) {
        snotify.error(error.message)
      }
    }

    const selectedLetterId = ref<number | null>(null)

    const selectLetter = (letterId: number) => {
      selectedLetterId.value = selectedLetterId.value === letterId ? null : letterId
    }

    const letters = computed(() => store.getters['admin/curriculum/types'])

    const availableLettersWithSongsIds = computed(() => {
      const availableIds = new Set()
      songsByCurriculumTypeWithFavorites.value.forEach(letter => availableIds.add(letter.id))
      return Array.from(availableIds)
    })

    const disabledLetters = computed(() => {
      const filteredLetters = letters.value?.filter((letter: any) => {
        return !availableLettersWithSongsIds.value.includes(letter.id)
      }).map((letter: any) => letter.id)

      return filteredLetters
    })

    const isTopRibbonMinimized = ref(false)

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
      selectLetter,
      selectedLetterId,
      isTopRibbonMinimized,
      disabledLetters
    }
  }
}
</script>
