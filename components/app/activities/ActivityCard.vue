<template>
  <v-col
    cols="12"
    sm="6"
    md="4"
    class="activiti-card-wrapper"
  >
    <v-hover v-slot:default="{ hover }">
      <v-card
        :class="['activity-card', { 'scaled': hover && !$vuetify.breakpoint.mobile }]"
        :elevation="(hover) ? 12 : 2"
      >
        <v-img
          class="clickable activity-card-image"
          :src="thumbnail"
          max-width="100%"
          :aspect-ratio="18/6"
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
                {{ categoryName }} <span class="with-activity-card">with</span> <span class="subtitle-activity-card">{{ activity.name }}</span>
              </v-list-item-title>

              <v-list-item-subtitle>
                <span>{{ activity.description }}</span>
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn
                icon
                large
                :loading="favoritesLoading"
                @click.stop="handleFavorites"
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
import get from 'lodash/get'
import FavoritesMixin from '@/mixins/FavoritesMixin.js'

export default {
  name: 'ActivityCard',

  mixins: [FavoritesMixin],

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
    playlist: {
      type: Array,
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

  methods: {
    playVideo () {
      const index = this.playlist.findIndex(({ activityId }) => activityId === this.activityId)

      if (index !== -1) {
        this.$nuxt.$emit('open-activity-player', { playlist: this.playlist, index })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.activity-card {
  transition: transform 250ms;
}
.activiti-card-wrapper {
  min-height: 300px;
}

.activity-card-image {
  height: 180px;
}
.scaled {
  transform: scale(1.25);
  z-index: 1;
}
.subtitle-activity-card {
  font-weight: 400 !important;
  color: $pg-black !important;
  text-transform: capitalize !important;
  white-space: pre-wrap;
}
.with-activity-card {
  font-weight: 400 !important;
  color: $pg-black !important;
  text-transform: lowercase !important;
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
