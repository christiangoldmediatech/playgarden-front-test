<template>
  <v-main v-if="isRegistrationComplete" class="pt-5 pt-md-16 mt-0 mt-md-5" data-test-id="music-content">
    <unlock-prompt
      v-show="false"
      v-if="hasPlayAndLearnPlan && !loading"
      title="MUSIC"
      desc="Unlock the full music library"
      img="music.svg"
      :padding="150"
    />

    <pg-loading :loading="loading" fullscreen>
      <v-container fluid class="pa-0">
        <horizontal-ribbon-card :is-minimized.sync="isTopRibbonMinimized">
          <v-row no-gutters class="pg-pt-20 ml-md-10 mr-md-6 mx-4 mt-4">
            <v-col cols="12" md="3" align-self="center">
              <child-select
                v-if="id"
                hide-details
                :value="id"
                :management-button="false"
                @input="id = $event"
              />
            </v-col>
            <v-col
              cols="12"
              md="9"
              align-self="center"
              class="px-2 mt-2 mt-md-0 d-none d-sm-flex carousel-wrapper"
            >
              <music-carousel-letter
                :is-full-width="true"
                :value="selectedLetterId"
                :disabled-letters="disabledLetters"
                @select="selectLetter"
              />
            </v-col>
            <v-col cols="12" class="mt-4">
              <new-compact-music-player @favorite="handleFavorite" />
            </v-col>
          </v-row>
        </horizontal-ribbon-card>
        <v-expand-transition>
          <new-music-player
            ref="musicPlayer"
            v-intersect="onIntersect"
            class="!pg-hidden"
            @favorite="handleFavorite"
          />
        </v-expand-transition>
        <div class="pg-h-[21rem] md:pg-h-80" />
        <music-song-list
          id="music-song-list"
          :show-only-favorites="showOnlyFavorites"
          :mobile="isMobile"
          :all-songs="allSongsWithFavorites"
          :songs-by-curriculum-type="songsByCurriculumTypeWithFavorites"
          :selected-letter-id="selectedLetterId"
          class="mx-auto music-song-list"
          @addSong="addSongToPlaylist"
          @newPlayList="createNewPlaylist"
          @favorite="handleFavorite"
          @showFavorites="showOnlyFavorites = !showOnlyFavorites"
          @select-letter="selectLetter"
        />
      </v-container>
    </pg-loading>
  </v-main>
</template>

<script lang="ts">
// @ts-ignore
import debounce from 'lodash/debounce'

import MusicSongList from '@/components/app/music/MusicSongList.vue'
import NewMusicPlayer from '@/components/app/music/NewMusicPlayer.vue'
import NewCompactMusicPlayer from '@/components/app/music/NewCompactMusicPlayer.vue'
import HorizontalRibbonCard from '@/components/ui/cards/HorizontalCardRibbon.vue'
import ChildSelect from '@/components/app/ChildSelect.vue'
import MusicCarouselLetter from '@/components/app/music/MusicLetterCarousel.vue'
import UnlockPrompt from '@/components/app/all-done/UnlockPrompt.vue'

import {
  useMusic,
  useToastHelper,
  useVuetifyHelper,
  useAppEventBusHelper,
  useGtmHelper,
  useAuth,
  useChildRoute
} from '@/composables'
import {
  onMounted,
  ref,
  computed,
  useRoute,
  watch,
  onUnmounted,
  useStore,
  useRouter,
  defineComponent
} from '@nuxtjs/composition-api'
import {
  MusicLibrary,
  APP_EVENTS,
  TAG_MANAGER_EVENTS,
  TypedStore
} from '@/models'

const PAGE_MOBILE_BREAKPOINT = 1264
const MOBILE_PLAYER_HEIGHT = 135

export default defineComponent({
  name: 'Index',

  components: {
    MusicSongList,
    NewMusicPlayer,
    NewCompactMusicPlayer,
    HorizontalRibbonCard,
    ChildSelect,
    MusicCarouselLetter,
    UnlockPrompt
  },

  setup() {
    const vuetify = useVuetifyHelper()
    const toast = useToastHelper()
    const route = useRoute()
    const router = useRouter()
    const store = useStore<TypedStore>()
    const eventBus = useAppEventBusHelper()
    const gtm = useGtmHelper()
    const loading = ref(false)

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
    const { childId } = useChildRoute({
      store,
      route,
      router,
      shouldRedirect: true
    })

    const isMobile = computed(
      () => vuetify.breakpoint.width <= PAGE_MOBILE_BREAKPOINT
    )
    const isPlayerShowing = computed(() => playlist.value.length > 0)
    const didScrollToBottom = ref(false)
    const isIntersectingMusicPlayer = ref(false)

    const handleScroll = () => {
      didScrollToBottom.value =
        document.documentElement.scrollTop + window.innerHeight >=
        document.documentElement.scrollHeight - MOBILE_PLAYER_HEIGHT
    }

    const hasPlayAndLearnPlan = computed(() => {
      return store.getters['auth/hasPlayAndLearnPlan']
    })

    const { userInfo } = useAuth({ store })

    const debouncedHandleScroll = debounce(handleScroll, 50)

    const isRegistrationComplete = computed(() => {
      return store.getters['auth/isRegistrationComplete']
    })

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
      if (!isRegistrationComplete.value) {
        router.push({ name: 'app-index' })
      } else {
        loading.value = true
        await getMusicLibrariesByCurriculumType()
        await getAndSetFavorites()
        setTimeout(handleEmptyMusicPlayer)

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

        loading.value = false
      }
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
      if (!childId.value) {
        return
      }

      await getFavoriteMusicForChild(childId.value)
      updateCurrentSongData()
    }

    const addSongToPlaylist = (song: MusicLibrary) => {
      eventBus.$emit(APP_EVENTS.MUSIC_ITEM_CLICKED, {
        event: TAG_MANAGER_EVENTS.MUSIC_ITEM_CLICKED,
        userId: userInfo.value.id,
        topic: song.description
      })
      if (musicPlayer.value) {
        musicPlayer.value.addSongToPlaylist(song)
        playlist.value.push(song)
      }
    }

    const createNewPlaylist = (playList: MusicLibrary[]) => {
      if (musicPlayer.value) {
        musicPlayer.value.createNewPlaylist(playList)
        playlist.value = playList

        isTopRibbonMinimized.value = false
      }

      if (playList.length > 1) {
        eventBus.$emit(APP_EVENTS.MUSIC_ITEM_CLICKED, {
          event: TAG_MANAGER_EVENTS.MUSIC_ITEM_CLICKED,
          userId: userInfo.value.id,
          topic: playList[0].description
        })
      }
    }

    const handleFavorite = async (song: MusicLibrary) => {
      try {
        if (song.isFavorite && song.favoriteId) {
          await removeFavoriteMusic(song.favoriteId)
          toast.success('Song removed from favorites')
        } else if (childId.value) {
          await setFavoriteMusicForChild(childId.value, song.id)
          eventBus.$emit(APP_EVENTS.MUSIC_ITEM_ADD_TO_FAVORITES, {
            event: TAG_MANAGER_EVENTS.MUSIC_ITEM_ADD_TO_FAVORITES,
            userId: userInfo.value.id,
            topic: song.description
          })
          toast.success('Song added to favorites')

          // NOTIFY GTM : useGtmHelper()
        }

        await getAndSetFavorites()
      } catch (error) {
        toast.error((error as Error).message)
      }
    }

    const selectedLetterId = ref<number | null>(null)

    const selectLetter = (letterId: number) => {
      selectedLetterId.value =
        selectedLetterId.value === letterId ? null : letterId
      window.scrollTo(0, 0)
    }

    const letters = computed(() => store.getters['admin/curriculum/types'])

    const availableLettersWithSongsIds = computed(() => {
      const availableIds = new Set()
      songsByCurriculumTypeWithFavorites.value.forEach((letter) =>
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

    const isTopRibbonMinimized = ref(false)

    /**
     * The music player is always visible, so here we want to show a default
     * song while there is no song selected.
     */
    const handleEmptyMusicPlayer = () => {
      if (
        playlist.value.length === 0 &&
        allSongsWithFavorites.value.length > 0
      ) {
        addSongToPlaylist(allSongsWithFavorites.value[0])
      }
    }

    const onIntersect = (entries: IntersectionObserverEntry[]) => {
      isIntersectingMusicPlayer.value = entries[0].isIntersecting
    }

    watch(isIntersectingMusicPlayer, () => {
      isTopRibbonMinimized.value = isIntersectingMusicPlayer.value
    })

    return {
      loading,
      addSongToPlaylist,
      allSongsWithFavorites,
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
      isTopRibbonMinimized,
      disabledLetters,
      onIntersect,
      hasPlayAndLearnPlan,
      isRegistrationComplete
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
