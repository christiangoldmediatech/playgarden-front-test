<template>
  <span />
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Logout',

  layout: 'loading',

  mounted () {
    this.logout()

    this.$router.push({ name: 'index' })
  },

  methods: mapActions('auth', ['logout']),

  head: () => ({
    title: 'Logging Out'
  })
}
</script>
