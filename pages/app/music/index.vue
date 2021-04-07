<template>
  <v-main class="fill-height">
    <v-container fluid class="music-page-container pa-0" :class="{ 'mobile': isMobile, 'playing': isPlayerShowing }">
      <v-card class="player-card" :width="playerWidth" :height="playerHeight" :class="{ 'mobile': isMobile, 'pa-4': isPlayerShowing }">
        <music-player v-show="isPlayerShowing" />
      </v-card>
      <music-song-list :all-songs="allSongs" :songs-by-curriculum-type="songsByCurriculumType" />
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
      isPlayerShowing: true
    }
  },
  computed: {
    ...mapState('music', {
      songsByCurriculumType: state => state.musicLibraries.filter(curriculumType => curriculumType.musicLibrary.length > 0)
    }),
    ...mapGetters({ currentChild: 'getCurrentChild' }),
    ...mapGetters('music', {
      allSongs: 'musicLibrariesByCurriculumType'
    }),
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
    ...mapActions('music', ['getMusicLibrariesByCurriculumType'])
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
.bg-red {
  background-color: rebeccapurple;
}
</style>
