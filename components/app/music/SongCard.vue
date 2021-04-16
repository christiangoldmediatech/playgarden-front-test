<template>
  <v-card
    v-bind="$attrs"
    height="70"
    rounded
    elevation="1"
    v-on="$listeners"
  >
    <v-row no-gutters class="fill-height px-6" justify="space-between" align="center">
      <!-- Song thumbnail -->
      <v-col cols="auto">
        <v-row no-gutters class="fill-height" justify="start" align="center">
          <v-col cols="auto">
            <figure class="song-thumbnail" :style="{ 'background-image': `url(${thumbnail}` }" />
          </v-col>
        </v-row>
      </v-col>

      <!-- Song author/name -->
      <v-col cols="6" md="5">
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
          <v-col cols="auto">
            <v-btn text icon class="pa-0" :class="isFavorite ? 'pink--text' : 'grey--text'" @click.stop="$emit('favorite')">
              <v-icon>
                mdi-heart
              </v-icon>
            </v-btn>
            <v-btn text icon class="pa-0" @click.stop="$emit('add')">
              <v-icon>
                mdi-playlist-music
              </v-icon>
            </v-btn>
          </v-col>
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
    background-size: contain;
    background-position: center center;
  }

  &-description {
    color: var(--v-accent-base);
  }

  &-name {
    color: #606060;
  }
}
</style>
