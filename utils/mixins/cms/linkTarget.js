export default {
  computed: {
    linkTarget () {
      return this.blok.newTab ? '_blank' : '_self'
    }
  },

  methods: {
    toLink (event) {
      const link = this.blok.link

      if (link.url === '') {
        event.preventDefault()
        const route = this.$router.resolve(link.cached_url.replace('app/', ''))

        window.open(route.href, this.linkTarget)
      }
    }
  }
}
