<template>
  <div class="music-player">
    <v-row no-gutters class="flex-column fill-height flex-nowrap">
      <!-- Child Selector -->
      <v-col v-if="!mobile" cols="auto">
        <div class="child-selector ml-auto">
          <child-select v-model="selectedChildId" hide-details />
        </div>
      </v-col>

      <!-- <v-spacer v-if="!mobile" /> -->

      <!-- Player -->
      <v-col>
        <div class="player-wrapper px-4" :class="{ 'pt-6': !mobile }">
          <pg-audio-player ref="audioPlayer" :play-list="playList">
            <!-- Current Song -->
            <template
              v-slot:current="{
                currentSong,
                isLoading,
                currentSongPlayedTime,
                currentSongPlayedPercentage,
                currentSongMissingTime,
                isPlaying,
                play,
                pause,
                next,
                previous
              }"
            >
              <template v-if="!mobile">
                <figure
                  class="song-thumbnail mx-auto"
                  :style="{ 'background-image': `url(${currentSong.thumbnail})` }"
                >
                  <v-overlay
                    absolute
                    :value="isLoading"
                  >
                    <v-progress-circular indeterminate />
                  </v-overlay>
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
                  />
                  <span class="played-time pl-1">
                    {{ currentSongPlayedTime }}
                  </span>
                  <span class="missing-time pr-1">
                    {{ currentSongMissingTime }}
                  </span>
                </div>
              </template>
              <template v-else>
                <v-row no-gutters align="center">
                  <v-col cols="auto">
                    <figure
                      class="song-thumbnail mobile"
                      :style="{ 'background-image': `url(${currentSong.thumbnail})` }"
                    >
                      <v-overlay
                        absolute
                        :value="isLoading"
                      >
                        <v-progress-circular indeterminate />
                      </v-overlay>
                    </figure>
                  </v-col>
                  <v-col>
                    <v-row no-gutters>
                      <!-- CENTER BTNS -->
                      <v-col cols="12" class="text-center">
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
                    </v-row>
                  </v-col>
                  <v-col cols="12">
                    <div class="song-percentage mobile">
                      <v-slider
                        readonly
                        height="10"
                        :min="0"
                        track-color="#EBEBEB"
                        :max="100"
                        class="slider"
                        :value="currentSongPlayedPercentage"
                      />
                      <span class="played-time pl-1">
                        {{ currentSongPlayedTime }}
                      </span>
                      <span class="missing-time pr-1">
                        {{ currentSongMissingTime }}
                      </span>
                    </div>
                  </v-col>
                </v-row>
              </template>
            </template>

            <!-- ACTIONS -->
            <template
              v-slot:actions="{
                isPlaying,
                play,
                pause,
                next,
                previous
              }"
            >
              <v-row v-show="!mobile" no-gutters>
                <v-col cols="3" />
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
                <v-col cols="3" />
              </v-row>
            </template>

            <!-- Playlist -->
            <template
              v-slot:playlist="{
                currentPlaylist,
                currentSongIndex
              }"
            >
              <template v-if="!mobile">
                <div
                  class=" mt-4 pt-2 playlist"
                >
                  <v-row
                    v-for="(song, songIndex) in currentPlaylist"
                    :key="songIndex"
                    no-gutters
                    class="playlist-song py-2 pl-1"
                    :class="{ selected: currentSongIndex === songIndex }"
                  >
                    <v-col cols="auto">
                      <figure
                        class="playlist-song-thumbnail"
                        :style="{ 'background-image': `url(${song.thumbnail})` }"
                      />
                    </v-col>
                    <v-col cols="10">
                      <div class="text-center">
                        <p class="playlist-song-title mb-2 text-truncate">
                          {{ song.description }}
                        </p>
                        <p class="playlist-song-author mb-2 text-truncate">
                          {{ song.name }}
                        </p>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </template>
            </template>
          </pg-audio-player>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import ChildSelect from '@/components/app/ChildSelect.vue'

import { jsonCopy } from '@/utils/objectTools.js'

export default {
  name: 'MusicPlayer',

  components: {
    ChildSelect
  },

  props: {
    mobile: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      selectedChildId: null,
      playList: []
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
  },

  beforeDestroy () {
    if (this.$refs.musicPlayer) {
      this.$refs.musicPlayer.stop()
    }
  },

  methods: {
    addSongToPlaylist (song) {
      this.playList.push(song)
      if (this.$refs.audioPlayer) {
        this.$refs.audioPlayer.addSong(song)
      }
    },

    createNewPlaylist (playlist) {
      this.playList = jsonCopy(playlist)
      if (this.$refs.audioPlayer) {
        this.$refs.audioPlayer.pause()
        this.$refs.audioPlayer.setPlaylist(playlist)
        this.$nextTick(() => {
          this.$refs.audioPlayer.play()
        })
      }
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
    width: 300px;
    height: 300px;
    background-size: contain;
    background-position: center center;
    &.mobile {
      width: 100px;
      height: 100px;
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

    &.mobile {
      height: 20px;
      & .slider {
        height: 10px;
        min-height: 10px;
      }
    }
  }
}
.playlist {
  border-top: 1px solid lightgrey;
  max-height: 250px;
  overflow: scroll;
  &-song {
    &-thumbnail {
      width: 50px;
      height: 50px;
      background-size: contain;
      background-position: center center;
    }
    &-title {
      color: var(--v-accent-base);
      font-size: 16px;
      line-height: 16px;
    }
    &-author {
      color: var(--v-black-base);
      font-size: 14px;
      line-height: 14px;
    }
    &.selected {
      background-color: rgba(lightgrey, 0.2);
    }
  }
}
</style>
