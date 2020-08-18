import { mapGetters, mapActions } from 'vuex'

export default {
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
  methods: {
    ...mapActions('video', ['getAllFavorites', 'addFavorite', 'deleteFavorite']),

    setFavorite () {
      this.loading = true
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
              videoId: this.activity.id
            })
          )
        })
      }

      Promise.all(stack).then(() => {
        this.getAllFavorites().then(() => {
          this.loading = false
        })
      })
    }
  }
}
