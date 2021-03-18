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

    this.$router.push({ name: 'index' })
  },

  methods: mapActions('auth', ['logout']),

  head: () => ({
    title: 'Logging Out'
  })
}
</script>
