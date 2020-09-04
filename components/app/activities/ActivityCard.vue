<template>
  <v-col
    cols="12"
    sm="6"
    :md="blok ? '4' : '3'"
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
          <!-- CMS Card -->
          <template v-if="blok">
            <div class="title">
              {{ blok.title }}
            </div>
          </template>
          <!-- Default actions -->
          <template v-else>
            <img
              :src="icon"
              height="48px"
            >
            <div class="ml-2">
              <span>
                {{ categoryName }}
              </span>
              <br>
              <span class="font-weight-bold">
                {{ activity.name }}
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
          </template>
        </v-card-actions>
      </v-card>
    </v-hover>
  </v-col>
</template>

<script>
import get from 'lodash/get'
import VideoFavoriteMixin from './VideoFavoriteMixin'

export default {
  name: 'ActivityCard',

  mixins: [VideoFavoriteMixin],

  props: {
    activityId: {
      type: Number,
      default: undefined
    },
    activity: {
      type: Object,
      default: undefined
    },
    icon: {
      type: String,
      default: undefined
    },
    categoryName: {
      type: String,
      default: undefined
    },
    blok: {
      type: Object,
      default: null
    }
  },

  data: () => {
    return {
      loading: false
    }
  },

  computed: {
    videoId () {
      return this.activity.id
    },

    thumbnail () {
      return get(this.blok, 'thumbnail') || this.activity.thumbnail || require('@/assets/jpg/abacus_counting_lesson.jpg')
    }
  },

  mounted () {
    console.log(this.blok)
  },

  methods: {
    playVideo () {
      console.log(this.activity)

      this.$nuxt.$emit('play-activity', {
        title: get(this.blok, 'title') || this.activity.name,
        playlist: [
          {
            file: get(this.blok, 'file.filename') || this.activity.videoUrl.HLS,
            image: this.thumbnail,
            activityId: get(this.blok, 'file.id') || this.activityId
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

.title {
  color: $pg-black;
  font-weight: 600;
}
</style>
