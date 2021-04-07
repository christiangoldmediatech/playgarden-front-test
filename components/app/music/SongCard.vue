<template>
  <v-card
    v-bind="$attrs"
    height="70"
    rounded
    elevation="1"
    v-on="$listeners"
  >
    <v-row no-gutters class="fill-height px-6" justify="space-between" align="center">
      <!-- Song thumbnail and description -->
      <v-col cols="auto">
        <v-row no-gutters class="fill-height" justify="start" align="center">
          <v-col cols="auto">
            <figure class="song-thumbnail">
              <img :src="thumbnail" :alt="description">
            </figure>
          </v-col>
          <v-col cols="auto">
            <span class="ml-6 song-description font-weight-bold">{{ description }}</span>
          </v-col>
        </v-row>
      </v-col>

      <!-- Song author/name -->
      <v-col cols="auto">
        <v-row no-gutters class="fill-height" justify="center" align="center">
          <v-col cols="auto">
            <span class="ml-6 song-name">{{ name }}</span>
          </v-col>
        </v-row>
      </v-col>

      <!-- Actions -->
      <v-col cols="auto">
        <v-row no-gutters class="fill-height" justify="end" align="center">
          <v-col cols="auto">
            <v-btn text>
              <v-icon>
                mdi-dots-horizontal
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
    }
  }
}
</script>

<style lang="scss" scoped>
.song {
  &-thumbnail {
    height: 60px;
    width: 80px;
    & img {
      height: 100%;
      width: 100%;
    }
  }

  &-description {
    color: var(--v-accent-base);
  }

  &-name {
    color: #606060;
  }
}
</style>
