<template>
  <span />
</template>

<script>
import { mapActions } from 'vuex'

import { hasLocalStorage } from '@/utils/window'

export default {
  name: 'JwtRecovery',

  layout: 'loading',

  async mounted () {
    if (hasLocalStorage()) {
      await this.restoreAuth()
    }

    if (this.$route.query.redirect) {
      this.$router.push(decodeURIComponent(this.$route.query.redirect))
    } else {
      this.$router.push({ name: 'index' })
    }
  },

  methods: {
    ...mapActions({
      restoreAuth: 'auth/restoreAuthFromSessionStorage'
    })
  },

  head: () => ({
    title: 'Recovering session'
  })
}
</script>

<style scoped>
.logo-img {
  max-width: 200px;
}
</style>
