<template>
  <v-main class="main-music-wrapper">
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
import { mapGetters, mapActions, mapState } from 'vuex'

import MusicPlayer from '@/components/app/music/MusicPlayer.vue'
import MusicSongList from '@/components/app/music/MusicSongList.vue'

const PAGE_MOBILE_BREAKPOINT = 1264

export default {
  name: 'Index',

  components: {
    MusicPlayer,
    MusicSongList
  },

  data () {
    return {
      mobileBreakpoint: PAGE_MOBILE_BREAKPOINT,
      selectedChildId: null,
      playList: [],
      currentSong: {},
      favoritesDictionary: {},
      showOnlyFavorites: false,
      isPlayerMaximizedOnMobile: false
    }
  },

  computed: {
    ...mapState('music', {
      songsByCurriculumType: state => state.musicLibraries.filter(curriculumType => curriculumType.musicLibrary.length > 0)
    }),

    ...mapGetters({ currentChild: 'getCurrentChild' }),

    ...mapGetters('music', {
      allSongs: 'allSongsWithCurriculumType'
    }),

    ...mapState('notifications', ['isTrialExpiringRibbonVisible']),

    /**
     * Return 'allSongs' with props `isFavorite` and `favoriteId` that can be used
     * to show if the song is favorite or not and to update its status in child components.
     *
     * This computed property also filters out non favorite songs when `showOnlyFavorites` is true
     */
    allSongsWithFavorites () {
      return this.allSongs.reduce((prev, song) => {
        const favorite = this.favoritesDictionary[song.id]

        if (this.showOnlyFavorites && !favorite) {
          return prev
        } else if (!favorite) {
          return [...prev, song]
        }

        return [
          ...prev,
          {
            ...song,
            // custom properties
            isFavorite: true,
            favoriteId: favorite.id
          }
        ]
      }, [])
    },

    /**
     * Return 'songsByCurriculumType' with props `isFavorite` and `favoriteId` that can be used
     * to show if the song is favorite or not and to update its status in child components.
     *
     * This computed property also filters out non favorite songs when `showOnlyFavorites` is true
     */
    songsByCurriculumTypeWithFavorites () {
      return this.songsByCurriculumType.map(curriculumType => ({
        ...curriculumType,
        musicLibrary: curriculumType.musicLibrary.reduce((prev, song) => {
          const favorite = this.favoritesDictionary[song.id]

          if (this.showOnlyFavorites && !favorite) {
            return prev
          } else if (!favorite) {
            return [...prev, song]
          }

          return [
            ...prev,
            {
              ...song,
              // custom properties
              isFavorite: true,
              favoriteId: favorite.id
            }
          ]
        }, [])
      }))
    },

    isPlayerShowing () {
      return this.playList.length > 0
    },

    isMobile () {
      return this.$vuetify.breakpoint.width <= this.mobileBreakpoint
    },

    id () {
      return this.$route.query.id ? parseInt(this.$route.query.id) : null
    },

    playerWidth () {
      if (this.isMobile) {
        return '100%'
      } else if (this.isPlayerShowing) {
        return '450'
      } else {
        return 0
      }
    },

    playerHeight () {
      if (!this.isMobile || this.isPlayerMaximizedOnMobile) {
        return '100%'
      } else if (this.isPlayerShowing && !this.isPlayerMaximizedOnMobile) {
        return '135'
      } else {
        return 0
      }
    },

    pageContainerClasses () {
      return { mobile: this.isMobile, playing: this.isPlayerShowing }
    },

    playerCardStyle () {
      return {
        padding: this.isPlayerShowing && !(this.isPlayerMaximizedOnMobile && this.isMobile) ? '16px' : '0px',
        transition: '0.3s ease',
        position: 'absolute',
        left: 0,
        top: this.isMobile ? 'unset' : 0,
        'z-index': 99,
        bottom: this.isMobile && this.isTrialExpiringRibbonVisible && !this.isPlayerMaximizedOnMobile
          ? '107px'
          : this.isMobile
            ? '0px'
            : undefined
      }
    }
  },

  watch: {
    id (val) {
      if (val) {
        this.getAndSetFavorites()
      }
    }
  },

  async created () {
    if (!this.id && this.currentChild.length) {
      this.$router.push({ name: this.$route.name, query: { id: this.currentChild[0].id } })
    }

    await this.getMusicLibrariesByCurriculumType()
    await this.getAndSetFavorites()
  },

  methods: {
    ...mapActions('music', ['getMusicLibrariesByCurriculumType', 'getFavoriteMusicForChild', 'setFavoriteMusicForChild', 'removeFavoriteMusic']),

    async getAndSetFavorites () {
      const favorites = await this.getFavoriteMusicForChild(this.id)

      const favoritesDictionary = {}
      for (const favorite of favorites) {
        const songId = favorite && favorite.music ? favorite.music.id : undefined

        if (!songId) {
          return
        }

        favoritesDictionary[songId] = { songId, id: favorite.id }
      }

      this.favoritesDictionary = { ...favoritesDictionary }

      this.updateCurrentSongData()
    },

    addSongToPlaylist (song) {
      if (this.$refs.musicPlayer) {
        this.$refs.musicPlayer.addSongToPlaylist(song)
        this.playList.push(song)
      }
    },

    createNewPlaylist (playList) {
      this.$refs.musicPlayer.createNewPlaylist(playList)
      this.playList = playList
    },

    async handleFavorite (song) {
      try {
        if (song.isFavorite) {
          await this.removeFavoriteMusic(song.favoriteId)
          this.$snotify.success('Song removed from favorites')
        } else {
          await this.setFavoriteMusicForChild({ childId: this.id, musicId: song.id })
          this.$snotify.success('Song added to favorites')
        }

        await this.getAndSetFavorites()
      } catch (error) {
        this.$snotify.error(error.message)
      }
    },

    updateCurrentSongData () {
      const resolvedCurrentSong = Object.keys(this.currentSong || {}).length
        ? { ...this.currentSong }
        : undefined

      if (!resolvedCurrentSong) {
        return
      }

      const favorite = this.favoritesDictionary[resolvedCurrentSong.id]
      if (this.$refs.musicPlayer) {
        this.$refs.musicPlayer.refreshSongData({
          ...resolvedCurrentSong,
          isFavorite: !!favorite,
          favoriteId: favorite ? favorite.id : undefined
        })
      }
    },

    handlePlayerClick ($event) {
      if (!this.isMobile || this.isPlayerMaximizedOnMobile) {
        return
      }

      this.isPlayerMaximizedOnMobile = true
    },

    handlePlayerMinimize () {
      this.isPlayerMaximizedOnMobile = false
    }
  }
}
</script>

<style lang="scss" scoped>
.main-music-wrapper {
  max-height: 100vh;
  height: 100%;
}

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
