<template>
  <lesson-videos-card>
    <v-list-item-action>
      <v-btn
        v-if="$vuetify.breakpoint.smAndDown || !puzzlePiece"
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
      <lesson-puzzle-pieces v-else v-bind="{ puzzlePiece }" />
    </v-list-item-action>
  </lesson-videos-card>
</template>

<script>
import { mapState } from 'vuex'
import FavoritesMixin from '@/mixins/FavoritesMixin.js'
import LessonVideosCard from '@/components/app/dashboard/LessonVideosCard.vue'
import LessonPuzzlePieces from '@/components/app/dashboard/LessonPuzzlePieces.vue'

export default {
  name: 'LessonVideos',

  components: {
    LessonVideosCard,
    LessonPuzzlePieces
  },

  mixins: [FavoritesMixin],

  computed: {
    ...mapState('children/lesson', ['puzzlePiece']),

    videoId () {
      return parseInt(this.$route.query.id)
    }
  },

  created () {
    this.getAllFavorites()
  }
}
</script>
