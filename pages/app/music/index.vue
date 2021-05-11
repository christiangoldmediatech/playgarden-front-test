<template>
  <v-main :style="mainWrapperStyle">
    <v-container fluid class="music-page-container pa-0" :class="pageContainerClasses">
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
        :show-only-favorites="showOnlyFavorites"
        :is-player-showing="isPlayerShowing"
        :mobile="isMobile"
        :all-songs="allSongsWithFavorites"
        :songs-by-curriculum-type="songsByCurriculumTypeWithFavorites"
        class="music-song-list fill-height mx-auto"
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

import MusicPlayer from '@/components/app/music/MusicPlayer.vue'
import MusicSongList from '@/components/app/music/MusicSongList.vue'
import { useMusic } from '@/composables'
import { onMounted, ref, computed, useRoute, watch } from '@nuxtjs/composition-api'

const PAGE_MOBILE_BREAKPOINT = 1264

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
          ? '135'
          : 0
    })

    const pageContainerClasses = computed(() => {
      return { mobile: isMobile.value, playing: isPlayerShowing.value }
    })

    const mainWrapperStyle = computed(() => {
      return {
        height: '100%',
        'max-height': isMobile.value ? '100vh' : '1000px'
      }
    })

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
          await setFavoriteMusicForChild({ childId: id.value, musicId: song.id })
          ctx.root.$snotify.success('Song added to favorites')
        }

        await getAndSetFavorites()
      } catch (error) {
        ctx.root.$snotify.error(error.message)
      }
    }

    const handlePlayerClick = ($event) => {
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
      pageContainerClasses,
      playerHeight,
      playerWidth,
      playlist,
      showOnlyFavorites,
      songsByCurriculumTypeWithFavorites
    }
  },

  computed: {
    ...mapGetters({ currentChild: 'getCurrentChild' }),

    ...mapState('notifications', ['isTrialExpiringRibbonVisible', 'expiringRibbonHeightMobile']),

    playerCardStyle () {
      return {
        padding: this.isPlayerShowing && !(this.isPlayerMaximizedOnMobile && this.isMobile) ? '16px' : '0px',
        transition: '0.3s ease',
        position: 'absolute',
        left: 0,
        top: this.isMobile ? 'unset' : 0,
        'z-index': 99,
        bottom: this.isMobile && this.isTrialExpiringRibbonVisible && !this.isPlayerMaximizedOnMobile
          ? `${this.expiringRibbonHeightMobile}px`
          : this.isMobile
            ? '0px'
            : undefined
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

<style lang="scss" scoped>
.music-page-container {
  height: 100%;
  position: relative;
  &.playing {
    padding-left: 450px !important;
    &.mobile {
      padding-left: 0 !important;
      padding-bottom: 160px !important;
    }
  }
}

.music-song-list {
  overflow: scroll;
}
</style>
