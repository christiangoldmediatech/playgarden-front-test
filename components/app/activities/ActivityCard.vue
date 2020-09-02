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

        <v-list dense>
          <v-list-item>
            <v-list-item-avatar tile>
              <v-img
                :src="icon"
                contain
              />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold text-uppercase">
                {{ categoryName }}
              </v-list-item-title>

              <v-list-item-subtitle>
                {{ activity.name }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn
                icon
                large
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
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </v-hover>
  </v-col>
</template>

<script>
import VideoFavoriteMixin from './VideoFavoriteMixin'

export default {
  name: 'ActivityCard',

  mixins: [VideoFavoriteMixin],

  props: {
    activityId: {
      type: Number,
      required: true
    },
    activity: {
      type: Object,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    categoryName: {
      type: String,
      required: true
    },
    playlist: {
      type: Array,
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
      return this.activity.id
    },

    thumbnail () {
      return this.activity.thumbnail || require('@/assets/jpg/abacus_counting_lesson.jpg')
    }
  },

  methods: {
    playVideo () {
      const index = this.playlist.findIndex(({ activityId }) => activityId === this.activityId)

      if (index !== -1) {
        this.$nuxt.$emit('open-lesson-activity-player', { playlist: this.playlist, index })
      }
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
