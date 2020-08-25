<template>
  <v-col
    cols="12"
    sm="6"
    md="3"
  >
    <v-hover v-slot:default="{ hover }">
      <v-card
        :class="['activity-card', { 'scaled': hover }]"
        :elevation="(hover) ? 12 : 2"
      >
        <v-img
          class="clickable"
          :src="thumbnail"
          max-width="100%"
          :aspect-ratio="16/9"
          @click.stop="playVideo"
        >
          <v-container fill-height fluid>
            <v-row align="center" justify="center">
              <div
                v-if="hover"
                class="play-icon accent rounded-circle d-flex align-center justify-center"
              >
                <img
                  src="@/assets/svg/play-button.svg"
                  class="ml-1"
                  width="50%"
                >
              </div>
            </v-row>
          </v-container>
        </v-img>

        <v-card-actions>
          <div class="ml-2">
            <span class="font-weight-bold">
              {{ video.name }}
            </span>
          </div>

          <v-spacer />

          <v-btn
            icon
            :loading="loading"
            @click.stop="setFavorite"
          >
            <v-icon color="#F5737F">
              <template v-if="isFavorite">
                mdi-heart
              </template>
              <template v-else>
                mdi-heart-outline
              </template>
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-hover>
  </v-col>
</template>

<script>
import VideoFavoriteMixin from './VideoFavoriteMixin'

export default {
  name: 'VideoCard',

  mixins: [VideoFavoriteMixin],

  props: {
    video: {
      type: Object,
      required: true
    }
  },

  data: () => {
    return {
      loading: false
    }
  },

  computed: {
    videoId () {
      return this.video.id
    },

    thumbnail () {
      return this.video.thumbnail || require('@/assets/jpg/abacus_counting_lesson.jpg')
    }
  },

  methods: {
    playVideo () {
      this.$nuxt.$emit('play-video', {
        title: this.video.name,
        playlist: [
          {
            file: this.video.videoUrl.HLS,
            image: this.thumbnail
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.activity-card {
  transition: transform 250ms;
}

.scaled {
  transform: scale(1.25);
  z-index: 1;
}

.play-icon {
  width: 75px;
  height: 75px;
}
</style>
