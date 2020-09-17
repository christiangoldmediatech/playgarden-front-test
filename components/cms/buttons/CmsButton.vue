<template>
  <v-btn
    class="button"
    color="primary"
  >
    <a :href="blok.link.url || link" @click="toLink">{{ blok.text || text }}</a>
  </v-btn>
</template>

<script>
export default {
  name: 'CmsButton',

  props: {
    blok: {
      type: Object,
      default: () => ({})
    },
    text: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    }
  },

  methods: {
    toLink (event) {
      const link = this.blok.link

      if (link.url === '') {
        event.preventDefault()
        this.$router.push(link.cached_url.replace('app/', ''))
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.button {
  width: 100%;

  a {
    color: white !important;

    &:visited {
      color: inherit;
    }
  }
}

</style>
