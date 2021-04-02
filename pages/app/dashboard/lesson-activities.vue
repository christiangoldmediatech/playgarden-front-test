<template>
  <lesson-activities-card>
    <v-list-item-action v-if="showFavorites">
      <v-btn
        icon
        large
        :loading="favoritesLoading"
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
    <lesson-puzzle-pieces v-else v-bind="{ puzzlePiece }" />
  </lesson-activities-card>
</template>

<script>
import { mapState } from 'vuex'
import FavoritesMixin from '@/mixins/FavoritesMixin.js'
import LessonActivitiesCard from '@/components/app/dashboard/LessonActivitiesCard'
import LessonPuzzlePieces from '@/components/app/dashboard/LessonPuzzlePieces.vue'

export default {
  name: 'LessonActivities',

  components: {
    LessonActivitiesCard,
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
