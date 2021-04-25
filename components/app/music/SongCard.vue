<template>
  <v-card
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
          <v-btn text icon class="pa-0" @click.stop="$emit('add')">
            <v-icon size="28">
              mdi-playlist-music
            </v-icon>
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: 'SongCard',

  emits: ['add'],

  props: {
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
  }
}
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
}
.custom-shadow {
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15) !important;
  border-radius: 8px !important;
}
</style>
