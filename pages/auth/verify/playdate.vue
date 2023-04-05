<template>
  <pg-loading />
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Playdate',

  data: vm => ({
    token: vm.$route.query.token
  }),

  computed: {
    ...mapGetters('auth', ['getUserInfo', 'isUserLoggedIn'])
  },

  created () {
    if (this.token) {
      this.onToken()
    }
  },

  methods: {
    ...mapActions('playdates', ['getPlaydateInvite']),

    async onToken () {
      try {
        const { email, phone, user = {} } = await this.getPlaydateInvite(
          this.token
        )

        if (
          this.isUserLoggedIn &&
          (this.getUserInfo.email === email ||
            this.getUserInfo.email === user.email)
        ) {
          return this.$router.push({ name: 'auth-login' })
        }

        await this.$toast.success(
          'Invitation has been verified successfully!'
        )

        if (this.isUserLoggedIn) {
          this.goTo('app-playdates-join', email, phone)
        } else {
          this.$nuxt.$emit('open-prompt', {
            action: () => {
              this.goTo('auth-signup', email, phone)
            },
            actionText: 'Sign Up',
            close: () => {
              this.goTo('auth-login', email, phone)
            },
            closeText: 'Log In',
            color: 'primary darken-1',
            contentClasses: '',
            dark: true,
            image: 'correct',
            message: 'How do you want continue?',
            warning: 'You need be logged in in order to accept the invitation.'
          })
        }
      } catch (e) {
        setTimeout(() => this.$router.push({ name: 'auth-login' }), 2000)
      }
    },

    goTo (name, email, phone) {
      this.$router.push({
        name,
        query: {
          email,
          phone,
          process: 'invitation-playdate',
          token: this.token
        }
      })
    }
  }
}
</script>
