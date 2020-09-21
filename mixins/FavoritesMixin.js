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

    favoriteRows () {
      return this.favorites.filter(({ video }) => video.id === this.videoId)
    },

    isFavorite () {
      return (this.favoriteRows.length)
    }
  },

  created () {
    this.getAllFavorites()
  },

  methods: {
    ...mapActions('video', ['getAllFavorites', 'addFavorite', 'deleteFavorite']),

    handleFavorites () {
      if (!this.videoId) {
        return
      }
      this.favoritesLoading = true
      const stack = []

      if (this.isFavorite) {
        this.favoriteRows.forEach(({ id }) => {
          stack.push(
            this.deleteFavorite(id)
          )
        })
      } else {
        this.children.forEach(({ id }) => {
          stack.push(
            this.addFavorite({
              childrenId: id,
              videoId: this.videoId
            })
          )
        })
      }

      Promise.all(stack).then(() => {
        this.getAllFavorites().then(() => {
          this.favoritesLoading = false
        })
      })
    }
  }
}
