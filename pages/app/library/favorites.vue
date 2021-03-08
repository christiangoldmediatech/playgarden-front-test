<template>
  <v-main class="pos-relative">
    <v-btn
      class="activity-type-back"
      text
      nuxt
      :to="{ name: 'app-library' }"
    >
      <v-icon left>
        mdi-less-than
      </v-icon>
      Back
    </v-btn>

    <activity-type-header
      :icon="require('@/assets/svg/library/favorites.svg')"
      name="Favorites"
      color="#ff051e"
      @play-all="handlePlayAll"
    />

    <favorites-container
      v-if="favorites.length"
      ref="container"
      v-bind="{ favorites }"
      no-header
      expandable
    />

    <activity-player />
  </v-main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import FavoritesContainer from '@/components/app/library/FavoritesContainer.vue'
import ActivityTypeHeader from '@/components/app/library/ActivityTypeHeader.vue'
import ActivityPlayer from '@/components/app/activities/ActivityPlayer.vue'
import { shuffle } from '@/utils/arrayTools'
import LibraryFunctions from '@/mixins/LibraryFunctions'

export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'ActivityTypeId',

  components: {
    FavoritesContainer,
    ActivityTypeHeader,
    ActivityPlayer
  },

  mixins: [LibraryFunctions],

  data: () => {
    return {
      favorites: []
    }
  },

  computed: {
    ...mapGetters('children', {
      allChildren: 'rows'
    })
  },

  created () {
    this.setChild({
      value: this.allChildren
    })
    this.fetchFavorites()
    this.getAllFavorites()
  },

  methods: {
    ...mapActions('video', ['getAllFavorites']),
    ...mapActions(['setChild']),

    async fetchFavorites () {
      try {
        const data = await this.$axios.$get('/activities')

        if (data.favorites && data.favorites.length) {
          this.favorites = data.favorites.length ? shuffle(data.favorites) : []
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
    },

    handlePlayAll () {
      this.$refs.container.handlePlay(0)
    }
  }
}
</script>

<style lang="scss">
.activity-type-back {
  position: absolute;
  top: 8px;
  left: 8px;
  color: white !important;
  text-transform: none;
  z-index: 5;
}
</style>
