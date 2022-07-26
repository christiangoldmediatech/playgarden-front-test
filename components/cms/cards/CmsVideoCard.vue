<template>
  <div
    v-editable="blok"
    class="card pg-image--cover"
  >
    <CmsVideoPlayer />
    <v-hover v-slot:default="{ hover }">
      <v-card
        :class="['activity-card', { 'scaled': hover }]"
        :elevation="(hover) ? 12 : 2"
      >
        <v-img
          class="card-image clickable"
          :src="blok.thumbnail"
          max-width="100%"
          height="220px"
          @click.stop="playVideo"
        >
          <v-container fill-height fluid>
            <v-row align="center" justify="center">
              <div
                v-if="hover"
                class="play-icon accent rounded-circle d-flex align-center justify-center pa-4"
              >
                <img
                  src="@/assets/svg/play-button.svg"
                  width="50px"
                  height="50px"
                >
              </div>
            </v-row>
          </v-container>
        </v-img>
        <v-list-item>
          <b>{{ blok.title }}</b>
        </v-list-item>
      </v-card>
    </v-hover>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref, useStore } from '@nuxtjs/composition-api'
import { useNuxtHelper } from '@/composables'
import CmsVideoPlayer from '@/components/cms/player/CmsVideoPlayer.vue'

export default defineComponent({
  name: 'CmsVideoCard',

  components: {
    CmsVideoPlayer
  },

  props: {
    blok: {
      type: Object,
      default: () => ({})
    }
  },

  setup (props) {
    // CurrentId does not seem to be used in anything
    // const currentId = ref<null | number>(null)

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
      playVideo
    }
  }
})
</script>

<style lang="scss" scoped>
.activity-card {
  transition: transform 250ms;
}

.card {
  max-width: 275px;
  padding: 0 18px;
  transition: 200ms ease;
}

.card-image {
  width: 260px;
  height: 220px;
}

</style>
