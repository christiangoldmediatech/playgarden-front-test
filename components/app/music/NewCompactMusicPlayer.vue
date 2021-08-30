<template>
  <!-- Music Player View -->
  <pg-audio-player
    ref="audioPlayer"
    :play-list="playlist"
    @currentSong="handleCurrentSong"
  >
    <template
      #current="{
        currentSong,
        currentSongPlayedTime,
        currentSongPlayedPercentage,
        currentSongMissingTime,
        previous,
        play,
        pause,
        isPlaying
      }"
    >
      <v-row no-gutters>
        <v-col cols="3" align-self="center">
          <!-- Title And Description -->
          <div v-if="currentSong.description" class="d-flex flex-column">
            <div class="d-flex justify-center justify-md-start">
              <span
                class="accent--text text-h5 font-weight-black"
              >
                {{ currentSong.description }}
              </span>
            </div>
            <div class="grey--text font-weight-bold text-body-1 text-md-h6 text-center text-md-left">
              {{ currentSong.name }}

              <!-- Favorite Button -->
              <v-icon
                class="ml-3 align-self-center"
                size="32"
                data-test-id="music-player-favorite-button"
                :class="currentSong.isFavorite ? 'pink--text text--lighten-2' : 'grey--text text--lighten-2'"
                @click.stop="$emit('favorite', currentSong)"
              >
                mdi-heart
              </v-icon>
            </div>
          </div>
        </v-col>

        <v-col cols="9">
          <!-- Slider -->
          <div class="music-player-progress">
            <v-slider
              readonly
              height="20"
              color="warning lighten-1"
              track-color="grey lighten-2"
              class="music-player-slider"
              :min="0"
              :max="100"
              :disabled="isPlayerDisabled"
              :value="currentSongPlayedPercentage"
            />
            <span class="music-player-played-time pl-2">
              {{ currentSongPlayedTime }}
            </span>
            <span class="music-player-missing-time pr-2">
              {{ currentSongMissingTime }}
            </span>
          </div>

          <v-row no-gutters justify="center" class="music-player-controls">
            <!-- Previous Song Button -->
            <v-col
              cols="2"
              sm="1"
              align-self="center"
              class="text-center"
            >
              <v-btn
                icon
                height="32"
                width="32"
                :disabled="isPlayerDisabled"
                @click.stop="previous"
              >
                <v-icon color="grey" size="32">
                  mdi-skip-backward
                </v-icon>
              </v-btn>
            </v-col>

            <!-- Pause/Play Song Button -->
            <v-col
              cols="2"
              sm="1"
              align-self="center"
              class="text-center"
            >
              <v-btn
                v-if="!isPlaying"
                icon
                height="50"
                width="50"
                :disabled="isPlayerDisabled"
                @click.stop="play"
              >
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
                :disabled="isPlayerDisabled"
                @click.stop="pause"
              >
                <v-icon color="grey" size="50">
                  mdi-pause-circle-outline
                </v-icon>
              </v-btn>
            </v-col>

            <!-- Next Song Button -->
            <v-col
              cols="2"
              sm="1"
              align-self="center"
              class="text-center"
            >
              <v-btn
                icon
                height="32"
                width="32"
                :disabled="isPlayerDisabled"
                @click.stop="next"
              >
                <v-icon color="grey" size="32">
                  mdi-skip-forward
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </pg-audio-player>
</template>

<script lang="ts">
import { useMusic } from '@/composables'
import { MusicLibrary } from '@/models'
import { defineComponent, ref, nextTick, computed } from '@nuxtjs/composition-api'

export default defineComponent({
  setup (_, { emit }) {
    // this references `ref="audioPlayer"` when the component is mounted
    const audioPlayer = ref<any>(null)
    const {
      currentSong,
      playlist
    } = useMusic()

    const handleCurrentSong = (song: MusicLibrary) => {
      emit('currentSong', song)
    }

    const refreshSongData = (song: MusicLibrary) => {
      if (!audioPlayer.value) {
        return
      }

      audioPlayer.value?.refreshSongData(song)
    }

    const addSongToPlaylist = (song: MusicLibrary) => {
      if (!audioPlayer.value) {
        return
      }

      audioPlayer.value?.addSong(song)
    }

    const createNewPlaylist = async (incomingPlaylist: MusicLibrary[]) => {
      if (!audioPlayer.value) {
        return
      }

      audioPlayer.value?.pause()
      audioPlayer.value?.setPlaylist(incomingPlaylist)
      await nextTick()
      audioPlayer.value?.play()
    }

    const isPlayerDisabled = computed(() => !currentSong.value || !currentSong.value.description)

    const playSong = async (playlistIndex: number) => {
      if (!audioPlayer.value) {
        return
      }

      audioPlayer.value?.pause()
      audioPlayer.value?.selectSongByIndex(playlistIndex)
      await nextTick()
      audioPlayer.value?.play()
    }

    return {
      audioPlayer,
      currentSong,
      isPlayerDisabled,
      playlist,
      addSongToPlaylist,
      createNewPlaylist,
      handleCurrentSong,
      playSong,
      refreshSongData
    }
  }
})
</script>

<style lang="scss" scoped>
.music-player {
  &-progress {
    position: relative;
    height: 60px;
  }

  &-controls {
    margin-top: -18px;
  }

  &-played-time {
    color: grey;
    position: absolute;
    left: 0;
    bottom: 0;
    font-size: 14px;
  }

  &-missing-time {
    color: grey;
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 14px;
  }
}

@media (max-width: $breakpoint-xs) {
  .music-player {
    & .controls {
      width: 90%;
    }
  }
}
</style>
