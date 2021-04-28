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
        <div :class="playerWrapperClasses">
          <pg-audio-player ref="audioPlayer" :play-list="playList" @currentSong="$emit('currentSong', $event)">
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
              <!-- Desktop or Mobile Maximized -->
              <template v-if="!mobile || isPlayerMaximizedOnMobile">
                <div class="thumbnail-wrapper">
                  <figure
                    class="song-thumbnail mx-auto"
                    :style="songThumbnailCss(currentSong.thumbnail)"
                  >
                    <v-overlay
                      absolute
                      :value="isLoading"
                    >
                      <v-progress-circular indeterminate />
                    </v-overlay>
                  </figure>
                  <!-- Mobile Minimize Icon -->
                  <v-icon
                    v-if="isPlayerMaximizedOnMobile"
                    class="minimize-btn orange lighten-2 white--text"
                    size="32"
                    data-test-id="music-player-minimize-button"
                    @click.stop="$emit('minimize', currentSong)"
                  >
                    mdi-chevron-down
                  </v-icon>
                  <!-- Fav Icon -->
                  <v-icon
                    class="favorite-btn"
                    size="32"
                    data-test-id="music-player-favorite-button"
                    :class="currentSong.isFavorite ? 'pink--text text--lighten-2' : 'grey--text text--lighten-2'"
                    @click.stop="$emit('favorite', currentSong)"
                  >
                    mdi-heart
                  </v-icon>
                </div>
                <!-- Song Name And Description -->
                <div class="song-details text-center pt-4 px-4">
                  <p class="song-title mb-2 text-truncate">
                    {{ currentSong.description }}
                  </p>
                  <p class="song-author mb-2 text-truncate">
                    {{ currentSong.name }}
                  </p>
                </div>
                <!-- Song Progress -->
                <div class="song-percentage" :class="{ 'mx-4': isPlayerMaximizedOnMobile }">
                  <v-slider
                    readonly
                    height="20"
                    :min="0"
                    color="warning lighten-1"
                    track-color="grey lighten-2"
                    :max="100"
                    class="slider"
                    :value="currentSongPlayedPercentage"
                  />
                  <span class="played-time pl-2">
                    {{ currentSongPlayedTime }}
                  </span>
                  <span class="missing-time pr-2">
                    {{ currentSongMissingTime }}
                  </span>
                </div>
              </template>
              <!-- Mobile -->
              <template v-else>
                <v-row no-gutters align="center">
                  <v-col cols="auto">
                    <figure
                      class="song-thumbnail mobile"
                      :style="songThumbnailCss(currentSong.thumbnail)"
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
                        <v-btn icon height="32" width="32" @click.stop="previous">
                          <v-icon color="grey" size="32">
                            mdi-skip-backward
                          </v-icon>
                        </v-btn>
                        <v-btn v-if="!isPlaying" icon height="50" width="50" @click.stop="play">
                          <v-icon color="grey" size="50">
                            mdi-play-circle-outline
                          </v-icon>
                        </v-btn>
                        <v-btn
                          v-else
                          icon
                          height="50"
                          width="50"
                          @click.stop="pause"
                        >
                          <v-icon color="grey" size="50">
                            mdi-pause-circle-outline
                          </v-icon>
                        </v-btn>
                        <!-- NEXT -->
                        <v-btn icon height="32" width="32" @click.stop="next">
                          <v-icon color="grey" size="32">
                            mdi-skip-forward
                          </v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                  <!-- Song Progress -->
                  <v-col cols="12">
                    <div class="song-percentage mobile">
                      <v-slider
                        readonly
                        height="10"
                        :min="0"
                        color="warning lighten-1"
                        track-color="grey lighten-2"
                        :max="100"
                        class="slider"
                        :value="currentSongPlayedPercentage"
                      />
                      <span class="played-time">
                        {{ currentSongPlayedTime }}
                      </span>
                      <span class="missing-time">
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
              <!-- Desktop or Mobile Maximized -->
              <v-row v-show="!mobile || isPlayerMaximizedOnMobile" no-gutters>
                <v-col cols="3" />
                <!-- CENTER BTNS -->
                <v-col cols="6" class="text-center">
                  <!-- PREVIOUS -->
                  <v-btn icon height="32" width="32" @click.stop="previous">
                    <v-icon color="grey" size="32">
                      mdi-skip-backward
                    </v-icon>
                  </v-btn>
                  <v-btn v-if="!isPlaying" icon height="50" width="50" @click.stop="play">
                    <v-icon color="grey" size="50">
                      mdi-play-circle-outline
                    </v-icon>
                  </v-btn>
                  <v-btn
                    v-else
                    icon
                    height="50"
                    width="50"
                    data-test-id="music-player-pause-button"
                    @click.stop="pause"
                  >
                    <v-icon color="grey" size="50">
                      mdi-pause-circle-outline
                    </v-icon>
                  </v-btn>
                  <!-- NEXT -->
                  <v-btn icon height="32" width="32" @click.stop="next">
                    <v-icon color="grey" size="32">
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
              <!-- Desktop -->
              <template v-if="!mobile">
                <div
                  class="playlist mt-4"
                >
                  <v-row
                    v-for="(song, songIndex) in currentPlaylist"
                    :key="songIndex"
                    no-gutters
                    class="playlist-song py-2"
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
                        <p class="playlist-song-title my-2 text-truncate">
                          {{ song.description }}
                        </p>
                        <p class="playlist-song-author my-2 text-truncate">
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
    },
    isPlayerMaximizedOnMobile: {
      type: Boolean,
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
    },

    playerWrapperClasses () {
      return {
        'player-wrapper': true,
        'pt-6': !this.mobile,
        'px-4': !this.isPlayerMaximizedOnMobile
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
    refreshSongData (song) {
      if (this.$refs.audioPlayer) {
        this.$refs.audioPlayer.refreshSongData(song)
      }
    },

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
    },

    songThumbnailCss (imageUrl = '') {
      const styles = {
        'background-image': `url(${imageUrl})`,
        'box-shadow': '0px 8px 24px rgba(0, 0, 0, 0.15)'
      }

      if (!this.isPlayerMaximizedOnMobile) {
        styles['border-radius'] = '8px'
      }

      return styles
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
    width: 100%;
    height: 300px;
    background-size: cover;
    background-position: center center;
    &.mobile {
      width: 100px;
      height: 75px;
    }
  }
  &-details {
    & .song-title {
      color: var(--v-accent-base);
      font-size: 24px;
      line-height: 24px;
      font-weight: 700;
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
  border-top: 1px solid rgb(228, 228, 228);
  max-height: 250px;
  overflow: scroll;
  &-song {
    &-thumbnail {
      width: 50px;
      height: 50px;
      background-size: cover;
      background-position: center center;
    }
    &-title {
      color: var(--v-accent-base);
      font-size: 16px;
      line-height: 16px;
      font-weight: 700;
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
.thumbnail-wrapper {
  position: relative;

  & .favorite-btn {
      position: absolute;
      bottom: 15px;
      right: 20px;
  }

  & .minimize-btn {
    position: absolute;
    opacity: 0.75;
    left: 20px;
    top: 15px;
  }
}
</style>
