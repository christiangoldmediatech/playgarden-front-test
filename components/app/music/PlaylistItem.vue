<template>
  <div>
    <v-card :id="`playlist-item-${song.id}`" class="playlist-item" data-test-id="playlist-item" @click="$emit('play')">
      <v-row no-gutters>
        <!-- THUMBNAIL -->
        <v-col cols="2" align-self="center">
          <v-img class="playlist-item-image" cover :src="song.thumbnail" />
        </v-col>

        <!-- SONG NAME -->
        <v-col
          cols="3"
          sm="4"
          align-self="center"
          class="playlist-item-description"
          data-test-id="playlist-item-song-description"
        >
          {{ song.description }}
        </v-col>

        <!-- SONG AUTHOR -->
        <v-col
          v-if="!isPlaying"
          cols="3"
          sm="4"
          align-self="center"
          class="playlist-item-name"
          data-test-id="playlist-item-song-name"
        >
          {{ song.name }}
        </v-col>

        <!-- SONG PLAYING INDICATOR -->
        <v-col
          v-else
          cols="3"
          sm="4"
          align-self="center"
          class="playlist-item-name"
          data-test-id="playlist-item-playing-tag"
        >
          <span class="playlist-item-playing-tag">{{ $t('music.letterSongs.playing') }}</span>
        </v-col>

        <v-col cols="auto" align-self="center">
          <!-- FAVORITE BUTTON -->
          <v-btn class="mr-n1 mr-md-0" :class="favoriteButtonClasses" icon data-test-id="playlist-item-favorite-button" @click.stop="$emit('favorite')">
            <v-icon>mdi-heart</v-icon>
          </v-btn>

          <!-- REMOVE BUTTON -->
          <v-btn class="ml-n1 ml-md-0 red--text text--lighten-1" icon data-test-id="playlist-item-remove-button" @click.stop="$emit('remove-song')">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import { MusicLibrary } from '@/models'
import { defineComponent, PropType, computed } from '@nuxtjs/composition-api'
export default defineComponent({
  props: {
    song: {
      type: Object as PropType<MusicLibrary>,
      required: true
    },
    isPlaying: {
      type: Boolean,
      default: false
    }
  },

  emits: ['remove-song', 'favorite-toggle', 'play'],

  setup (props) {
    const favoriteButtonClasses = computed(() => props.song?.isFavorite ? 'pink--text text--lighten-2' : '')

    return {
      favoriteButtonClasses
    }
  }
})
</script>

<style lang="scss" scoped>
.playlist-item {
  background: #FFFFFF;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15) !important;
  border-radius: 8px;
  padding: 4px 0px 4px 8px;

  &-image {
    margin-left: 24px;
    border-radius: 8px;
    height: 50px;
    width: 50px;
  }

  &-description {
    margin-left: 6px;
    color: #606060;
    font-weight: bold;
    font-size: 20px;
  }

  &-name {
    color: #CFCFCF;
    font-size: 18px;
  }

  &-playing-tag {
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 1px;
    padding: 5px;
    width: 75px;
    text-align: center;
    margin-top: 5px;
    margin-bottom: 5px;
    color: white;
    background: var(--v-accent-base)
  }
}

@media (max-width: $breakpoint-xs) {
  .playlist-item {
    &-image {
      margin-left: 0px;
      height: 40px;
      width: 40px;
    }

    &-description {
      font-size: 14px;
    }

    &-name {
      font-size: 11px;
    }

    &-playing-tag {
      font-size: 8px;
      padding: 5px;
      margin-top: 5px;
      margin-bottom: 5px;
    }
  }
}
</style>
