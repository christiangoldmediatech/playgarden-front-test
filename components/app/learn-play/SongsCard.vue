<template>
  <v-row class="ma-0">
    <v-container fluid class="pa-0">
      <v-expand-transition>
        <music-player-learn-play ref="musicPlayer" @favorite="handleFavorite" />
      </v-expand-transition>
    </v-container>
  </v-row>
</template>

<script lang="ts">
// @ts-ignore
import debounce from 'lodash/debounce'
import {
  useNuxtHelper,
  useMusic,
  useSnotifyHelper,
  useVuetifyHelper,
  useAppEventBusHelper,
  useGtmHelper,
  useAuth,
  useChildRoute,
  useLearnPlayV2
} from '@/composables'
import MusicPlayerLearnPlay from '@/components/app/learn-play/MusicPlayerLearnPlay.vue'

import {
  onMounted,
  ref,
  computed,
  useRoute,
  watch,
  onUnmounted,
  useStore,
  useRouter,
  defineComponent,
  Ref
} from '@nuxtjs/composition-api'
import {
  MusicLibrary,
  APP_EVENTS,
  TAG_MANAGER_EVENTS,
  TypedStore
} from '@/models'

const PAGE_MOBILE_BREAKPOINT = 1464
const MOBILE_PLAYER_HEIGHT = 135

export default defineComponent({
  name: 'SongsCard',
  components: {
    MusicPlayerLearnPlay
  },

  props: {
    selectedSong: {
      type: Object,
      required: false,
      default: () => ({})
    },
    previewMode: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const nuxt = useNuxtHelper()
    const vuetify = useVuetifyHelper()
    const snotify = useSnotifyHelper()
    const route = useRoute()
    const router = useRouter()
    const store = useStore<TypedStore>()
    const eventBus = useAppEventBusHelper()
    const gtm = useGtmHelper()
    const learnPlayV2 = useLearnPlayV2({ store })

    // this references `ref="musicPlayer"` when the component is mounted
    const musicPlayer = ref<any>(null)
    const {
      // allSongsWithFavorites,
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

    let childId: Ref<number | null>
    if (props.previewMode) {
      childId = ref(null)
    } else {
      childId = useChildRoute({
        store,
        route,
        router,
        shouldRedirect: true
      }).childId
    }

    const isMobile = computed(
      () => vuetify.breakpoint.width <= PAGE_MOBILE_BREAKPOINT
    )

    const isPlayerShowing = computed(() => playlist.value.length > 0)
    const didScrollToBottom = ref(false)
    // const isIntersectingMusicPlayer = ref(false)

    const handleScroll = () => {
      didScrollToBottom.value =
        document.documentElement.scrollTop + window.innerHeight >=
        document.documentElement.scrollHeight - MOBILE_PLAYER_HEIGHT
    }

    const { userInfo } = useAuth({ store })

    const debouncedHandleScroll = debounce(handleScroll, 50)

    watch(childId, async (val) => {
      if (val) {
        await getAndSetFavorites()
      }
    })

    watch(currentSong, async (val) => {
      if (!val || !childId.value) {
        return
      }

      await sendCurrentPlayingMusic(val.id, childId.value)
    })

    onMounted(async () => {
      if (!props.previewMode) {
        await getMusicLibrariesByCurriculumType()
      }

      await getAndSetFavorites()

      handleEmptyMusicPlayer()

      window.addEventListener('scroll', debouncedHandleScroll)

      // GTM EVENTS
      eventBus.$on(
        APP_EVENTS.MUSIC_ITEM_CLICKED,
        (data: { event: string; topic: string; userId: string }) => {
          gtm.push(data)
        }
      )
      eventBus.$on(
        APP_EVENTS.MUSIC_ITEM_ADD_TO_FAVORITES,
        (data: { event: string; topic: string; userId: string }) => {
          gtm.push(data)
        }
      )
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', debouncedHandleScroll)

      // GTM EVENTS
      eventBus.$off(APP_EVENTS.MUSIC_ITEM_CLICKED)
      eventBus.$off(APP_EVENTS.MUSIC_ITEM_ADD_TO_FAVORITES)
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
      if (!childId.value || props.previewMode) {
        return
      }

      await getFavoriteMusicForChild(childId.value)
      updateCurrentSongData()
    }

    const addSongToPlaylist = (song: MusicLibrary) => {
      // This event does not seem to correspond to what's actually happening
      // eventBus.$emit(APP_EVENTS.MUSIC_ITEM_CLICKED, {
      //   event: TAG_MANAGER_EVENTS.MUSIC_ITEM_CLICKED,
      //   userId: userInfo.value.id,
      //   topic: song.description
      // })
      if (musicPlayer.value) {
        musicPlayer.value.addSongToPlaylist(song)
        playlist.value.push(song)
      }
    }

    const createNewPlaylist = (playList: MusicLibrary[]) => {
      if (musicPlayer.value) {
        musicPlayer.value.createNewPlaylist(playList)
        playlist.value = playList

        // isTopRibbonMinimized.value = true
      }

      if (playList.length > 1 && userInfo.value) {
        eventBus.$emit(APP_EVENTS.MUSIC_ITEM_CLICKED, {
          event: TAG_MANAGER_EVENTS.MUSIC_ITEM_CLICKED,
          userId: userInfo.value.id,
          topic: playList[0].description
        })
      }
    }

    const handleFavorite = async (song: MusicLibrary) => {
      if (props.previewMode) {
        return
      }

      try {
        if (song.isFavorite && song.favoriteId) {
          await removeFavoriteMusic(song.favoriteId)
          snotify.success('Song removed from favorites')
        } else if (childId.value) {
          await setFavoriteMusicForChild(childId.value, song.id)
          eventBus.$emit(APP_EVENTS.MUSIC_ITEM_ADD_TO_FAVORITES, {
            event: TAG_MANAGER_EVENTS.MUSIC_ITEM_ADD_TO_FAVORITES,
            userId: userInfo.value.id,
            topic: song.description
          })
          snotify.success('Song added to favorites')

          // NOTIFY GTM : useGtmHelper()
        }

        await getAndSetFavorites()
      } catch (error: any) {
        snotify.error(error.message)
      }
    }

    const selectedLetterId = ref<number | null>(null)

    const selectLetter = (letterId: number) => {
      selectedLetterId.value =
        selectedLetterId.value === letterId ? null : letterId
    }

    const letters = computed(() => store.getters['admin/curriculum/types'])

    const availableLettersWithSongsIds = computed(() => {
      const availableIds = new Set()
      songsByCurriculumTypeWithFavorites.value.forEach(letter =>
        availableIds.add(letter.id)
      )
      return Array.from(availableIds)
    })

    const disabledLetters = computed(() => {
      const filteredLetters = letters.value
        ?.filter((letter: any) => {
          return !availableLettersWithSongsIds.value.includes(letter.id)
        })
        .map((letter: any) => letter.id)

      return filteredLetters
    })

    // const isTopRibbonMinimized = ref(false)

    /**
     * The music player is always visible, so here we want to show a default
     * song while there is no song selected.
     */
    const handleEmptyMusicPlayer = () => {
      createNewPlaylist(learnPlayV2.computedProps.songs.value)
      // allSongsWithFavorites.value.forEach((song) => {
      //   addSongToPlaylist(song)
      // })
      // if (playlist.value.length === 0 && allSongsWithFavorites.value.length > 0) {
      //   addSongToPlaylist(allSongsWithFavorites.value[0])
      // }
    }

    // const onIntersect = (entries: IntersectionObserverEntry[]) => {
    //   isIntersectingMusicPlayer.value = entries[0].isIntersecting
    // }

    // watch(isIntersectingMusicPlayer, () => {
    //   isTopRibbonMinimized.value = isIntersectingMusicPlayer.value
    // })

    return {
      addSongToPlaylist,
      // allSongsWithFavorites,
      createNewPlaylist,
      currentSong,
      didScrollToBottom,
      getAndSetFavorites,
      handleFavorite,
      id: childId,
      isMobile,
      isPlayerShowing,
      musicPlayer,
      playlist,
      showOnlyFavorites,
      songsByCurriculumTypeWithFavorites,
      selectLetter,
      selectedLetterId,
      // isTopRibbonMinimized,
      disabledLetters
      // onIntersect
    }
  }
})
</script>

<style lang="scss" scoped>
.music-song-list {
  max-width: 1400px;
}
.carousel-wrapper {
  position: relative;
}
</style>
