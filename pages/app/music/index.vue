<template>
  <v-main :style="mainWrapperStyle">
    <v-container fluid class="pa-0" :style="pageContainerStyle">
      <v-card
        :style="playerCardStyle"
        :width="playerWidth"
        :height="playerHeight"
        :ripple="false"
        v-on="isMobile && !isPlayerMaximizedOnMobile ? { click: handlePlayerClick } : {}"
      >
        <music-player
          v-show="isPlayerShowing"
          ref="musicPlayer"
          :mobile="isMobile"
          :is-player-maximized-on-mobile="isPlayerMaximizedOnMobile"
          @favorite="handleFavorite"
          @minimize="handlePlayerMinimize"
          @currentSong="currentSong = $event"
        />
      </v-card>
      <music-song-list
        :style="musicSongListStyle"
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

<script>
import { mapGetters, mapState } from 'vuex'
import debounce from 'lodash/debounce'

import MusicPlayer from '@/components/app/music/MusicPlayer.vue'
import MusicSongList from '@/components/app/music/MusicSongList.vue'
import { useMusic } from '@/composables'
import { onMounted, ref, computed, useRoute, watch, onUnmounted } from '@nuxtjs/composition-api'

const PAGE_MOBILE_BREAKPOINT = 1264
const MOBILE_PLAYER_HEIGHT = 135

export default {
  name: 'Index',

  components: {
    MusicPlayer,
    MusicSongList
  },

  setup (_, ctx) {
    const route = useRoute()
    // this references `ref="musicPlayer"` when the component is mounted
    const musicPlayer = ref(null)
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

    const isPlayerMaximizedOnMobile = ref(false)

    const isMobile = computed(() => ctx.root.$vuetify.breakpoint.width <= PAGE_MOBILE_BREAKPOINT)
    const isPlayerShowing = computed(() => playlist.value.length > 0)
    const didScrollToBottom = ref(false)

    const playerWidth = computed(() => {
      return isMobile.value
        ? '100%'
        : isPlayerShowing.value
          ? '450'
          : 0
    })

    const playerHeight = computed(() => {
      return !isMobile.value || isPlayerMaximizedOnMobile.value
        ? '100%'
        : isPlayerShowing.value && !isPlayerMaximizedOnMobile.value
          ? MOBILE_PLAYER_HEIGHT
          : 0
    })

    const mainWrapperStyle = computed(() => {
      return {
        height: '100%',
        'max-height': isMobile.value ? '100vh' : '1000px'
      }
    })

    const pageContainerStyle = computed(() => {
      const isDesktopPlayer = isPlayerShowing.value && !isMobile.value
      const isMobilePlayer = isPlayerShowing.value && isMobile.value

      return {
        height: '100%',
        position: 'relative',
        'padding-left': isDesktopPlayer
          ? '450px !important'
          : isMobilePlayer
            ? '0 !important'
            : undefined
      }
    })

    const musicSongListStyle = computed(() => {
      return {
        overflow: 'scroll',
        height: '100%',
        'padding-bottom': isMobile.value
          ? `${MOBILE_PLAYER_HEIGHT * 2}px !important`
          : undefined
      }
    })

    const handleScroll = () => {
      didScrollToBottom.value = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.scrollHeight - MOBILE_PLAYER_HEIGHT
    }

    const debouncedHandleScroll = debounce(handleScroll, 50)

    const id = computed(() => route.value.query.id
      ? parseInt(route.value.query.id)
      : null
    )
    watch(id, async (val) => {
      if (val) {
        await getAndSetFavorites()
      }
    })

    watch(currentSong, async (val) => {
      await sendCurrentPlayingMusic(val.id, id.value)
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
      await getFavoriteMusicForChild(id.value)
      updateCurrentSongData()
    }

    const addSongToPlaylist = (song) => {
      if (musicPlayer.value) {
        musicPlayer.value.addSongToPlaylist(song)
        playlist.value.push(song)
      }
    }

    const createNewPlaylist = (playList) => {
      if (musicPlayer.value) {
        musicPlayer.value.createNewPlaylist(playList)
        playlist.value = playList
      }
    }

    const handleFavorite = async (song) => {
      try {
        if (song.isFavorite) {
          await removeFavoriteMusic(song.favoriteId)
          ctx.root.$snotify.success('Song removed from favorites')
        } else {
          await setFavoriteMusicForChild(id.value, song.id)
          ctx.root.$snotify.success('Song added to favorites')
        }

        await getAndSetFavorites()
      } catch (error) {
        ctx.root.$snotify.error(error.message)
      }
    }

    const handlePlayerClick = () => {
      if (!isMobile.value || isPlayerMaximizedOnMobile.value) {
        return
      }

      isPlayerMaximizedOnMobile.value = true
    }

    const handlePlayerMinimize = () => {
      isPlayerMaximizedOnMobile.value = false
    }

    return {
      addSongToPlaylist,
      allSongsWithFavorites,
      createNewPlaylist,
      currentSong,
      didScrollToBottom,
      getAndSetFavorites,
      handleFavorite,
      handlePlayerClick,
      handlePlayerMinimize,
      id,
      isMobile,
      isPlayerMaximizedOnMobile,
      isPlayerShowing,
      mainWrapperStyle,
      musicPlayer,
      musicSongListStyle,
      pageContainerStyle,
      playerHeight,
      playerWidth,
      playlist,
      showOnlyFavorites,
      songsByCurriculumTypeWithFavorites
    }
  },

  computed: {
    ...mapGetters({ currentChild: 'getCurrentChild' }),

    ...mapState('notifications', ['isTrialExpiringRibbonVisible']),

    playerCardStyle () {
      const canHidePlayer = this.isMobile && this.didScrollToBottom && !this.isPlayerMaximizedOnMobile

      return {
        padding: this.isPlayerShowing && !(this.isPlayerMaximizedOnMobile && this.isMobile) ? '16px' : '0px',
        transition: '0.3s ease',
        position: this.isMobile && !this.isPlayerMaximizedOnMobile ? 'fixed' : 'absolute',
        left: 0,
        top: this.isMobile ? 'unset' : 0,
        'z-index': 99,
        bottom: '0px',
        visibility: canHidePlayer ? 'hidden' : 'visible'
      }
    }
  },

  created () {
    if (!this.id && this.currentChild.length) {
      this.$router.push({ name: this.$route.name, query: { id: this.currentChild[0].id } })
    }
  }
}
</script>
