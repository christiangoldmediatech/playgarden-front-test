import { mapGetters, mapActions } from 'vuex'

export default {
  data: () => {
    return {
      favoritesLoading: false
    }
  },

  computed: {
    ...mapGetters({ children: 'getCurrentChild' }),
    ...mapGetters('video', { favorites: 'getRows' }),

    // favoriteRows () {
    //   return this.favorites.filter(({ video }) => video.id === this.videoId)
    // },

    favoriteVideo () {
      return this.favorites.find(({ video }) => video.id === this.videoId)
    },

    isFavorite () {
      return Boolean(this.favoriteVideo)
    }
  },

  methods: {
    ...mapActions('video', ['getAllFavorites', 'addFavorite', 'deleteFavorite']),

    async handleFavorites () {
      try {
        if (!this.videoId) {
          return
        }

        this.favoritesLoading = true

        if (this.isFavorite) {
          await this.deleteFavorite(this.favoriteVideo.id)
        } else {
          await this.addFavorite({ videoId: this.videoId })
        }

        this.$nuxt.$emit('library-update-favorites')

        await this.getAllFavorites()
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      } finally {
        this.favoritesLoading = false
      }
    }
  }
}
