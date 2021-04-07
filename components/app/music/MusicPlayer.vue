<template>
  <div class="music-player">
    <v-row no-gutters class="flex-column fill-height">
      <v-col cols="auto">
        <div class="child-selector ml-auto">
          <child-select v-model="selectedChildId" hide-details />
        </div>
      </v-col>
      <v-spacer />
      <v-col>
        <div class="player-wrapper pt-6 px-4">
          <pg-audio-player>
            <template
              v-slot:current="{
                currentSong,
                isLoading,
                currentSongPlayedTime,
                currentSongPlayedPercentage,
                currentSongMissingTime,
              }"
            >
              <figure class="song-thumbnail mx-auto">
                <v-overlay
                  absolute
                  :value="isLoading"
                >
                  <v-progress-circular indeterminate />
                </v-overlay>
                <img :src="currentSong.thumbnail" :alt="currentSong.description">
              </figure>
              <div class="song-details text-center pt-4">
                <p class="song-title mb-2 text-truncate">
                  {{ currentSong.description }}
                </p>
                <p class="song-author mb-2 text-truncate">
                  {{ currentSong.name }}
                </p>
              </div>
              <div class="song-percentage">
                <v-slider
                  readonly
                  height="20"
                  :min="0"
                  track-color="#EBEBEB"
                  :max="100"
                  class="slider"
                  :value="currentSongPlayedPercentage"
                ></v-slider>
                <span class="played-time pl-1">
                  {{ currentSongPlayedTime }}
                </span>
                <span class="missing-time pr-1">
                  {{ currentSongMissingTime }}
                </span>
              </div>
            </template>
            <template
              v-slot:actions="{
                isPlaying,
                play,
                pause,
                next,
                previous
              }">
              <v-row no-gutters>
                <v-col cols="3"></v-col>
                <!-- CENTER BTNS -->
                <v-col cols="6" class="text-center">
                  <!-- PREVIOUS -->
                  <v-btn icon height="32" width="32" @click="previous">
                    <v-icon size="32">
                      mdi-skip-backward
                    </v-icon>
                  </v-btn>
                  <v-btn v-if="!isPlaying" icon height="50" width="50" @click="play">
                    <v-icon size="50">
                      mdi-play
                    </v-icon>
                  </v-btn>
                  <v-btn v-else icon height="50" width="50" @click="pause">
                    <v-icon size="50">
                      mdi-pause-circle-outline
                    </v-icon>
                  </v-btn>
                  <!-- NEXT -->
                  <v-btn icon height="32" width="32" @click="next">
                    <v-icon size="32">
                      mdi-skip-forward
                    </v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="3"></v-col>
              </v-row>
            </template>
          </pg-audio-player>
        </div>
      </v-col>
      <v-spacer />
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import ChildSelect from '@/components/app/ChildSelect.vue'

export default {
  name: 'MusicPlayer',
  components: {
    ChildSelect
  },
  data () {
    return {
      selectedChildId: null
    }
  },
  computed: {
    ...mapGetters({ currentChild: 'getCurrentChild' }),
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
.music-player {
  height: 100%;
  .child-selector {
    max-width: 250px;
  }
}
.song {
  &-thumbnail {
    position: relative;
    width: 95%;
    max-height: 350px;
    img {
      height: 100%;
      width: 100%;
    }
  }
  &-details {
    & .song-title {
      color: var(--v-accent-base);
      font-size: 24px;
      line-height: 24px;
    }
    & .song-author {
      color: var(--v-black-base);
      font-size: 18px;
      line-height: 18px;
    }
  }
  &-percentage {
    position: relative;
    height: 60px;
    & .slider {
      height: 20px;
      min-height: 20px;
    }
    & .played-time {
      color: var(--v-black-base);
      position: absolute;
      left: 0;
      bottom: 0;
      font-size: 14px;
    }
    & .missing-time {
      color: var(--v-black-base);
      position: absolute;
      right: 0;
      bottom: 0;
      font-size: 14px;
    }
  }
}
</style>
