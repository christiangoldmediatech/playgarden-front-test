<template>
  <!-- Music Player View -->
  <div
    class="music-player"
    :style="{
      '--mp-background-image': `url(${currentSong ? currentSong.thumbnail : ''})`
    }"
  >
    <div class="controls">
      <!-- Title And Favorite Icon -->
      <div v-if="currentSong" class="d-flex flex-column">
        <div v-if="currentSong.description" class="d-flex justify-center justify-md-start">
          <span
            class="accent--text text-h5 text-md-h4 font-weight-black"
          >
            {{ currentSong.description }}
          </span>
        </div>
        <div class="white--text font-weight-bold text-body-1 text-md-h6 text-center text-md-left">
          {{ currentSong.name }}
        </div>
      </div>
      <!-- Slider -->
      <div class="progress">
        <v-slider
          readonly
          height="20"
          color="warning lighten-1"
          track-color="grey lighten-2"
          class="slider"
          :min="0"
          :max="100"
          :disabled="isPlayerDisabled"
          :value="currentSongPlayedPercentage"
        />
        <span class="played-time pl-2">
          {{ currentSongPlayedTime }}
        </span>
        <span class="missing-time pr-2">
          {{ currentSongMissingTime }}
        </span>
      </div>

      <pg-audio-player ref="audioPlayer">
        <!-- Music Player Actions -->
        <template
          #actions="{
            play,
            pause,
            next,
            previous
          }"
        >
          <v-row v-if="currentSong" no-gutters justify="center">
            <v-spacer />
            <div class="text-center align-self-center">
              <!-- Previous Song Button -->
              <v-btn
                icon
                height="32"
                width="32"
                :disabled="isPlayerDisabled"
                @click.stop="previous"
              >
                <v-icon color="white" size="32">
                  mdi-skip-backward
                </v-icon>
              </v-btn>
            </div>

            <div class="text-center align-self-center">
              <!-- Pause/Play Song Button -->
              <v-btn
                v-if="!isPlaying"
                icon
                height="50"
                width="50"
                :disabled="isPlayerDisabled"
                @click.stop="play"
              >
                <v-icon color="white" size="50">
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
                <v-icon color="white" size="50">
                  mdi-pause-circle-outline
                </v-icon>
              </v-btn>
            </div>

            <div class="text-center align-self-center">
              <!-- Next Song Button -->
              <v-btn
                icon
                height="32"
                width="32"
                :disabled="isPlayerDisabled"
                @click.stop="next"
              >
                <v-icon color="white" size="32">
                  mdi-skip-forward
                </v-icon>
              </v-btn>
            </div>

            <v-spacer />

            <v-col
              v-if="currentSong.description"
              cols="auto"
              align-self="center"
              class="text-center"
            >
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
            </v-col>
          </v-row>
        </template>
      </pg-audio-player>
    </div>
  </div>
</template>

<script lang="ts">
import { useNuxtHelper, useMusic } from '@/composables'
import { MusicLibrary } from '@/models'
import { defineComponent, onMounted, ref, nextTick, computed, onUnmounted } from '@nuxtjs/composition-api'
import MusicQueue from '@/components/app/music/MusicQueue.vue'

export default defineComponent({
  name: 'MusicPlayerLearnPlay',
  components: {
    MusicQueue
  },

  setup () {
    const nuxt = useNuxtHelper()
    const audioPlayer = ref<any>(null)
    const {
      currentSong,
      currentSongMissingTime,
      currentSongPlayedPercentage,
      currentSongPlayedTime,
      isPlaying,
      removeSongFromPlaylist
    } = useMusic()

    const refreshSongData = (song: MusicLibrary) => {
      if (!audioPlayer.value) {
        return
      }
      audioPlayer.value.refreshSongData(song)
    }

    const addSongToPlaylist = (song: MusicLibrary) => {
      if (!audioPlayer.value) {
        return
      }

      audioPlayer.value.addSong(song)
    }

    const createNewPlaylist = async (incomingPlaylist: MusicLibrary[]) => {
      if (!audioPlayer.value) {
        return
      }

      audioPlayer.value.pause()
      audioPlayer.value.setPlaylist(incomingPlaylist)
      await nextTick()
    }

    const handleChangedSong = async (song: MusicLibrary) => {
      if (song) {
        currentSong.value = song
        refreshSongData(song)
        await playSong(0)
      }
    }

    const isPlayerDisabled = computed(() => !currentSong.value || !currentSong.value?.description)

    const playSong = async (playlistIndex: number) => {
      if (!audioPlayer.value) {
        return
      }

      audioPlayer.value.pause()
      audioPlayer.value.selectSongByIndex(playlistIndex)
      await nextTick()
      await audioPlayer.value.play()
    }

    const removeSong = (playlistIndex: number) => {
      if (!audioPlayer.value) {
        return
      }

      removeSongFromPlaylist(playlistIndex)
      audioPlayer.value.removeSongByIndex(playlistIndex)
    }

    onMounted(() => {
      nuxt.$on('change-song', handleChangedSong)
    })

    onUnmounted(() => {
      nuxt.$off('change-song', handleChangedSong)
    })

    return {
      audioPlayer,
      currentSong,
      currentSongMissingTime,
      currentSongPlayedPercentage,
      currentSongPlayedTime,
      isPlaying,
      isPlayerDisabled,
      addSongToPlaylist,
      createNewPlaylist,
      playSong,
      removeSong,
      refreshSongData
    }
  }
})
</script>

<style lang="scss" scoped>
.music-player {
  position: relative;
  display: flex;
  justify-content: center;
  height: 328px !important;
  width: 100% !important;
  background-image: linear-gradient(0deg, #4D4D4D 3.02%, rgba(77, 77, 77, 0) 67%), var(--mp-background-image);
  background-size: cover;
  background-position: center center;

  & .controls {
    position: absolute;
    bottom: 5%;
    width: 80%;
  }

  & .progress {
    position: relative;
    height: 60px;

    & .slider {
      height: 20px;
      min-height: 20px;
    }

    & .played-time {
      color: white;
      position: absolute;
      left: 0;
      bottom: 0;
      font-size: 14px;
    }

    & .missing-time {
      color: white;
      position: absolute;
      right: 0;
      bottom: 0;
      font-size: 14px;
    }
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
