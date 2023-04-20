<template>
  <span />
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Index',
  computed: {
    ...mapGetters('auth', ['isUserLoggedIn', 'isRegistrationComplete']),
    ...mapGetters(['getCurrentChild'])
  },
  created () {
    if (this.isUserLoggedIn) {
      if (this.getCurrentChild?.length > 0) {
        this.$router.push({ name: 'app-virtual-preschool' })
      } else if (this.isRegistrationComplete) {
        this.$router.push({ name: 'app-pick-child' })
      }
    } else if (this.$route.query.redirect) {
      this.$router.push({ name: 'auth-login', query: { redirect: this.$route.query.redirect } })
    } else {
      this.$router.push({ name: 'auth-login' })
    }
  }
}
</script>
