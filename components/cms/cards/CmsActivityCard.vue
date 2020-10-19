<template>
  <div
    v-editable="blok"
    class="px-2"
  >
    <v-hover v-slot:default="{ hover }">
      <v-card
        :class="['activity-card', { 'scaled': hover && !$vuetify.breakpoint.mobile }]"
        :elevation="(hover) ? 12 : 2"
        width="340"
      >
        <v-img
          class="clickable activity-card-image"
          :src="blok.thumbnail"
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
            <v-list-item-content class="data-video">
              <div class="font-weight-bold left-align">
                <span class="main-title">{{ blok.title }}</span>
              </div>
              <v-list-item-subtitle>
                <span class="activity-description">{{ blok.description }}</span>
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn
                icon
                large
                :loading="favoritesLoading"
                @click.stop="handleFavorites"
              />
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
import FavoritesMixin from '~/mixins/FavoritesMixin'

export default {
  name: 'CmsActivityCard',

  mixins: [FavoritesMixin],

  props: {
    blok: {
      type: Object,
      default: () => ({})
    }
  },

  methods: {
    playVideo () {
      const { title, file, thumbnail, url } = this.blok

      this.$nuxt.$emit('open-cms-video-player' + this._uid, {
        playlist: [{
          activityType: {},
          videoId: 0,
          title,
          poster: thumbnail,
          src: {
            src: file.filename || url,
            type: 'application/x-mpegURL'
          },
          viewed: false
        }],
        index: 0
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.activity-card {
  transition: transform 250ms;
}

.left-align {
  text-align: left;
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

.activity-description {
  white-space: pre-wrap;
  font-weight: 500;
}

.title {
  color: $pg-black;
  font-weight: 600;
}

.data-video {
  min-height: 50px;
}

.main-title {
  font-size: 19px;
}
</style>
