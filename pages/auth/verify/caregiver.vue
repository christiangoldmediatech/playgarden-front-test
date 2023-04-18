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
      try {
        const { email, phone } = await this.validateInvitation(this.token)

        await this.$toast.success(
          'Invitation has been verified successfully!'
        )

        setTimeout(
          () =>
            this.$router.push({
              name: 'auth-signup',
              query: { email, phone, process: 'invitation-caregiver', token: this.token }
            }),
          1000
        )
      } catch (e) {
        setTimeout(() => this.$router.push({ name: 'auth-signup' }), 2000)
      }
    }
  }
}
</script>
