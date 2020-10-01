<template>
  <div
    v-editable="blok"
    class="card pg-image--cover"
  >
    <cms-video-player />
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

<script>
import CmsVideoPlayer from '@/components/cms/player/CmsVideoPlayer.vue'

export default {
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

  data () {
    return {
      currentId: null
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
