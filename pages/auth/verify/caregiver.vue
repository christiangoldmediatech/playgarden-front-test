<template>
  <span />
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Caregiver',

  layout: 'loading',

  data: vm => ({
    token: vm.$route.query.token
  }),

  created () {
    if (this.token) {
      this.onToken()
    }
  },

  methods: {
    ...mapActions('caregiver', ['validateInvitation']),

    async onToken () {
      this.loading = true

      try {
        const { email } = await this.validateInvitation(this.token)

        await this.$snotify.success(
          'Invitation has been verified successfully!'
        )

        setTimeout(
          () =>
            this.$router.push({
              name: 'auth-signup',
              query: { email, process: 'invitation' }
            }),
          1000
        )
      } catch (e) {
        await this.$router.push({ name: 'auth-signup' })
      }
    }
  }
}
</script>
