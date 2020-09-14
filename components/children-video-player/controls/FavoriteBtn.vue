<template>
  <div class="control-container d-flex align-start justify-end">
    <!-- TODO: refactor favorites mixin to avoid ugly workarounds -->
    <v-btn
      v-if="activity.id !== null"
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
  </div>
</template>

<script>
import VideoFavoriteMixin from '@/components/app/activities/VideoFavoriteMixin.js'

export default {
  name: 'FavoriteBtn',

  mixins: [VideoFavoriteMixin],

  props: {
    videoId: {
      required: true,
      validator: (val) => {
        return val === null || typeof val === 'number'
      }
    }
  },

  computed: {
    // TODO: refactor favorites mixin to avoid ugly workarounds
    activity () {
      return {
        id: this.videoId
      }
    }
  }
}
</script>
