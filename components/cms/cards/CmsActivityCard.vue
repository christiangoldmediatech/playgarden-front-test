<template>
  <div v-editable="blok" class="px-2">
    <v-hover v-slot:default="{ hover }">
      <v-card
        :class="[
          'activity-card',
          { scaled: hover && !$vuetify.breakpoint.mobile }
        ]"
        :elevation="hover ? 12 : 2"
        width="340"
      >
        <v-img
          class="clickable activity-card-image"
          :src="blok.thumbnail"
          max-width="100%"
          :aspect-ratio="18 / 6"
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
                :loading="isFavoritesLoading"
                @click.stop="onFavoriteClick"
              />
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </v-hover>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref, useStore } from '@nuxtjs/composition-api'
import { useFavoritesApi, useGtmHelper, useNuxtHelper } from '@/composables'

export default defineComponent({
  name: 'CmsActivityCard',

  props: {
    blok: {
      type: Object,
      default: () => ({})
    }
  },

  setup(props) {
    // Favorites
    const store = useStore()
    const gtm = useGtmHelper()
    const isFavoritesLoading = ref(false)
    const { handleFavorite } = useFavoritesApi({ store, gtm, isHandlingFavorites: isFavoritesLoading })

    // Is this finished? Where is the videoId for handling favorites?
    function onFavoriteClick () {
      const { title, videoId } = props.blok
      handleFavorite(videoId, title)
    }

    // PlayVideo
    const nuxt = useNuxtHelper()
    function playVideo() {
      const instance = getCurrentInstance()
      // Do we even need the uid logic? The video player does not use it in any way
      // const uid = instance?.uid
      const { title, file, thumbnail, url } = props.blok

      // nuxt.$emit('open-cms-video-player' + uid, {
      nuxt.$emit('open-cms-video-player', {
        playlist: [
          {
            title,
            poster: thumbnail,
            src: {
              url: file.filename || url,
              type: 'application/x-mpegURL'
            },
            meta: {
              activityType: {},
              videoId: 0, // videoId was always hardcoded to 0. FavoritesHandling will not work
              viewed: false
            }
          }
        ]
      })
    }

    return {
      playVideo,
      isFavoritesLoading,
      onFavoriteClick
    }
  }
})
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
  color: var(--v-primary-base) !important;
  text-transform: capitalize !important;
  white-space: pre-wrap;
}

.with-activity-card {
  font-weight: 400 !important;
  color: var(--v-primary-base) !important;
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
  color: var(--v-primary-base);
  font-weight: 600;
}

.data-video {
  min-height: 50px;
}

.main-title {
  font-size: 19px;
}
</style>
