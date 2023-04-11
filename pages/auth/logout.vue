<template>
  <span />
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Logout',

  layout: 'loading',

  async mounted () {
    await this.logout()

    if (!this.$route.query.returnUrl) {
      await this.$router.push({ name: 'index' })
    } else {
      window.location.replace(this.$route.query.returnUrl)
    }
  },

  methods: mapActions('auth', ['logout']),

  head: () => ({
    title: 'Logging Out'
  })
}
</script>
