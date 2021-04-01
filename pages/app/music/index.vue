<template>
  <v-main>
    <v-container fluid class="music-page-container pa-0">
      <v-row no-gutters class="fill-height">
        <!-- DESKTOP -->
        <template v-if="!isMobile">
          <v-col cols="auto">
            <v-navigation-drawer permanent hide-overlay :value="playerShowing" :width="playerWidth">
              <v-card class="pa-4 player-card">
                <music-player />
              </v-card>
            </v-navigation-drawer>
          </v-col>
          <v-col>
            <v-card>
              skdjskdj
            </v-card>
          </v-col>
        </template>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { mapGetters } from 'vuex'

import MusicPlayer from '@/components/app/music/MusicPlayer.vue'

export default {
  name: 'Index',
  components: {
    MusicPlayer
  },
  data () {
    return {
      selectedChildId: null,
      playerShowing: true
    }
  },
  computed: {
    ...mapGetters({ currentChild: 'getCurrentChild' }),
    isMobile () {
      return this.$vuetify.breakpoint.smAndDown
    },
    id () {
      return this.$route.query.id ? parseInt(this.$route.query.id) : null
    },
    playerWidth () {
      if (this.playerShowing) {
        return '450'
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
  created () {
    if (this.id) {
      this.selectedChildId = parseInt(this.id)
    } else if (this.currentChild.length) {
      this.selectedChildId = this.currentChild[0].id
    }
  }
}
</script>

<style lang="scss" scoped>
.music-page-container {
  height: calc(100vh - 64px);
}
.player-card {
  height: 100%;
}
</style>
