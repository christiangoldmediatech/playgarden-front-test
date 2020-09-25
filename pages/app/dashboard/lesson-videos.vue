<template>
  <lesson-videos-card>
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
  </lesson-videos-card>
</template>

<script>
import FavoritesMixin from '@/mixins/FavoritesMixin.js'

export default {
  name: 'LessonVideos',

  mixins: [FavoritesMixin],

  computed: {
    videoId () {
      return parseInt(this.$route.query.id)
    }
  },

  created () {
    this.getAllFavorites()
  }
}
</script>
