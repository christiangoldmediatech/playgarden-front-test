<template>
  <v-card
    :id="`song-card-${songId}`"
    v-bind="$attrs"
    min-height="70"
    class="custom-shadow py-1"
    data-test-id="song-card"
    v-on="$listeners"
  >
    <v-row no-gutters class="fill-height px-3" justify="space-between" align="center">
      <!-- Song thumbnail -->
      <v-col cols="auto">
        <v-row no-gutters class="fill-height" justify="start" align="center">
          <v-col cols="auto">
            <figure class="song-thumbnail" :style="{ 'background-image': `url(${thumbnail}` }" />
          </v-col>
        </v-row>
      </v-col>

      <!-- Song author/name -->
      <v-col cols="5">
        <v-row no-gutters class="fill-height" justify="start" align="center">
          <v-col cols="12" md="auto">
            <span class="ml-0 ml-md-6 song-description">{{ description }}</span>
            <div v-if="isSongPlaying(songId)" class="ml-0 ml-md-6 song-playing-tag">
              PLAYING
            </div>
          </v-col>
          <v-col cols="12" class="hidden-md-and-up">
            <span class="song-name">{{ name }}</span>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="4" class="hidden-sm-and-down">
        <v-row no-gutters class="fill-height" justify="start" align="center">
          <v-col cols="auto">
            <span class="ml-6 song-name">{{ name }}</span>
          </v-col>
        </v-row>
      </v-col>

      <!-- Actions -->
      <v-col cols="1">
        <v-row no-gutters class="fill-height" justify="end" align="center">
          <v-btn
            text
            icon
            class="pa-0"
            data-test-id="song-card-favorite-button"
            :class="isFavorite ? 'pink--text text--lighten-2' : 'grey--text'"
            @click.stop="$emit('favorite')"
          >
            <v-icon size="28">
              mdi-heart
            </v-icon>
          </v-btn>
        </v-row>
      </v-col>
      <v-col cols="1">
        <v-row no-gutters class="fill-height" justify="center" align="center">
          <v-tooltip :top="!isMobile" :bottom="isMobile">
            <template #activator="{ on, attrs }">
              <v-icon
                size="28"
                v-bind="attrs"
                v-on="on"
                @click.stop="handleSongAddition"
              >
                mdi-playlist-music-outline
              </v-icon>
            </template>
            {{ isMobile ? 'Added to queue' : 'Add to queue' }}
          </v-tooltip>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { useMusic } from '@/composables'
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'SongCard',

  emits: ['add'],

  props: {
    songId: {
      type: Number,
      required: true
    },

    thumbnail: {
      type: String,
      required: false,
      default: ''
    },

    name: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: false,
      default: ''
    },

    isFavorite: {
      type: Boolean,
      default: false
    }
  },

  setup () {
    const { currentSong } = useMusic()

    const isSongPlaying = (songId) => {
      return songId === currentSong.value.id
    }

    return { isSongPlaying }
  },

  computed: {
    isMobile () {
      return this.$vuetify.breakpoint.mobile
    }
  },

  methods: {
    handleSongAddition ($event) {
      this.$emit('add')

      // blur element after 2 seg so the tooltip can go away
      if ($event && $event.target) {
        setTimeout(() => $event.target.blur(), 2000)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.song {
  &-thumbnail {
    height: 60px;
    width: 60px;
    background-size: cover;
    border-radius: 8px;
    background-position: center center;
  }

  &-description {
    font-weight: 700;
    color: var(--v-accent-base);
  }

  &-name {
    color: var(--v-black-base);
  }

  &-playing-tag {
    background: rgba(248, 152, 56, 0.3);
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 1px;
    padding: 5px;
    width: 75px;
    text-align: center;
    margin-top: 5px;
    margin-bottom: 5px;
  }
}
.custom-shadow {
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15) !important;
  border-radius: 8px !important;
}
.v-tooltip__content {
  background-color: var(--v-black-base) !important;
  font-weight: 500 !important;
  color: white !important;
}
.v-tooltip__content::after {
  content: "";
  position: absolute;
  border-color: transparent transparent transparent transparent;
}
</style>
