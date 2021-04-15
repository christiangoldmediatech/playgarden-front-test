<template>
  <v-main class="main-music-wrapper">
    <v-container fluid class="music-page-container pa-0" :class="{ 'mobile': isMobile, 'playing': isPlayerShowing }">
      <v-card class="player-card" :width="playerWidth" :height="playerHeight" :class="{ 'mobile': isMobile, 'pa-4': isPlayerShowing }">
        <music-player v-show="isPlayerShowing" ref="musicPlayer" :mobile="isMobile" />
      </v-card>
      <music-song-list
        :is-player-showing="isPlayerShowing"
        :mobile="isMobile"
        :all-songs="allSongs"
        :songs-by-curriculum-type="songsByCurriculumType"
        class="music-song-list fill-height mx-auto"
        @addSong="addSongToPlaylist"
        @newPlayList="createNewPlaylist"
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
      playList: []
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
      if (!this.isMobile) {
        return '100%'
      } else if (this.isPlayerShowing) {
        return '160'
      } else {
        return 0
      }
    }
  },

  watch: {
    selectedChildId (id) {
      if (id) {
        this.$router.push({ name: this.$route.name, query: { id } })
      }
    }
  },

  async created () {
    if (this.id) {
      this.selectedChildId = parseInt(this.id)
    } else if (this.currentChild.length) {
      this.selectedChildId = this.currentChild[0].id
    }
    await this.getMusicLibrariesByCurriculumType()
  },

  methods: {
    ...mapActions('music', ['getMusicLibrariesByCurriculumType']),

    addSongToPlaylist (song) {
      if (this.$refs.musicPlayer) {
        this.$refs.musicPlayer.addSongToPlaylist(song)
        this.playList.push(song)
      }
    },

    createNewPlaylist (playList) {
      this.$refs.musicPlayer.createNewPlaylist(playList)
      this.playList = playList
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

.player-card {
  transition: 0.1s ease;
  position: absolute;
  left: 0;
  top: 0;
  &.mobile {
    bottom: 0;
    top: unset;
  }
}

.music-song-list {
  overflow: scroll;
  max-width: 1200px;
}
</style>
