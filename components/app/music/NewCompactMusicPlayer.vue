<template>
  <!-- Music Player View -->
  <pg-audio-player>
    <template
      #current="{
        previous,
        play,
        pause,
        next,
      }"
    >
      <v-row no-gutters>
        <v-col v-if="currentSong" sm="5" md="4" lg="3" align-self="center">
          <v-row no-gutters>
            <v-col cols="4" align-self="center">
              <v-img
                :src="currentSong.thumbnail"
                :height="isMobile ? '70px' : '80px'"
                :width="isMobile ? '70px' : '80px'"
                cover
                class="music-player-thumbnail"
                @click="goUp"
              />
            </v-col>

            <v-col cols="6" md="8" align-self="center" class="px-md-2">
              <!-- Title And Description -->
              <div v-if="currentSong.description" class="d-flex flex-column">
                <div
                  class="accent--text text-body-2 text-md-h6 font-weight-black"
                >
                  {{ currentSong.description }}
                </div>
                <div class="grey--text font-weight-bold body-2 body-md-1">
                  <span class="mr-2">{{ currentSong.name }}</span>

                  <!-- Favorite Button -->
                  <v-icon
                    class="align-self-center hidden-xs-only"
                    :size="isMobile ? 20 : 28"
                    data-test-id="music-player-favorite-button"
                    :class="currentSong.isFavorite ? 'pink--text text--lighten-2' : 'grey--text text--lighten-2'"
                    @click.stop="$emit('favorite', currentSong)"
                  >
                    mdi-heart
                  </v-icon>
                </div>
              </div>
            </v-col>

            <v-col cols="2" align-self="center" class="hidden-sm-and-up text-center">
              <v-btn
                icon
                height="42"
                width="42"
                :disabled="isPlayerDisabled"
                @click.stop="next"
              >
                <v-icon color="grey" size="42">
                  mdi-skip-forward
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>

        <v-col sm="7" md="8" lg="9" class="hidden-xs-only">
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
              sm="2"
              md="1"
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
              sm="2"
              md="1"
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
              sm="2"
              md="1"
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
import { useMusic, useVuetifyHelper } from '@/composables'
import { defineComponent } from '@nuxtjs/composition-api'
import { computed } from '@vue/composition-api'

export default defineComponent({
  setup () {
    const vuetify = useVuetifyHelper()

    const {
      currentSong,
      currentSongMissingTime,
      currentSongPlayedPercentage,
      currentSongPlayedTime,
      isPlaying
    } = useMusic()

    const isPlayerDisabled = computed(() => !currentSong.value || !currentSong.value?.description)
    const isMobile = computed(() => vuetify.breakpoint.mobile)

    const goUp = () => {
      try {
        vuetify.goTo(0)
      } catch (error) {}
    }

    return {
      currentSong,
      currentSongMissingTime,
      currentSongPlayedPercentage,
      currentSongPlayedTime,
      isMobile,
      isPlaying,
      isPlayerDisabled,
      goUp
    }
  }
})
</script>

<style lang="scss" scoped>
.music-player {
  &-thumbnail {
    border-radius: 8px;
    cursor: pointer;
  }

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
</style>
