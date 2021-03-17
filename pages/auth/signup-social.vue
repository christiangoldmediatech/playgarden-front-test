<template>
  <span />
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'SignupSocial',

  layout: 'loading',

  data: vm => ({
    network: null
  }),

  mounted () {
    this.network = this.$route.query.network
    this.setSocialNetwork()
  },

  methods: {
    setSocialNetwork () {
      switch (this.network) {
        case 'facebook':
          this.facebookSignIn()
          break
        case 'google':
          this.googleSignIn()
          break
      }
    },
    facebookSignIn () {
      this.socialSignIn(
        'FACEBOOK',
        new this.$fireAuthObj.FacebookAuthProvider()
      )
    },

    googleSignIn () {
      this.socialSignIn('GOOGLE', new this.$fireAuthObj.GoogleAuthProvider())
    },

    async loginWithSocialNetwork (user) {
      try {
        this.disableAxiosGlobal()
        await this.authLoginSocial(user)
        this.enableAxiosGlobal()
        await this.$router.push({ name: 'app-dashboard' })
      } catch (e) {
        await this.onFailLoginSocial(user)
      }
    },

    async onFailLoginSocial (user) {
      try {
        this.validateEmail(user)
        await this.$router.push({
          name: 'auth-parent',
          query: { process: 'social-signup', _u: btoa(JSON.stringify(user)) }
        })
      } catch (e) {
        this.$snotify.error('This email is already on used!')
      } finally {
        this.enableAxiosGlobal()
      }
    },
    ...mapActions(['disableAxiosGlobal', 'enableAxiosGlobal']),

    ...mapActions('auth/login', ['login']),

    ...mapActions('auth/signup', {
      validateEmail: 'signupEmail'
    }),

    ...mapActions('auth/socialUser', ['authLoginSocial']),

    async onSubmit (data) {
      try {
        this.loading = true
        this.errorMessage = ''

        await this.login(data)

        if (this.inInvitationProcess) {
          await this.$router.push({
            name: 'app-playdates-join',
            query: this.$route.query
          })
        } else {
          await this.$router.push({ name: 'app-dashboard' })
        }
      } catch (error) {
        this.errorMessage = 'Sorry! Wrong email or password'
      } finally {
        this.loading = false
      }
    },

    socialSignIn (nameSocialNetwork, provider) {
      const fireAuthObj = this.$fireAuthObj()

      fireAuthObj
        .signInWithRedirect(provider)
        .then((result) => {
          const profile = { ...result.additionalUserInfo.profile }
          this.loginWithSocialNetwork({
            firstName: profile.given_name || profile.first_name || '',
            lastName: profile.family_name || profile.last_name || '',
            email: profile.email,
            socialNetwork: nameSocialNetwork,
            socialNetworkId: profile.id
          })
        })
        .catch((e) => {
          this.$router.push({ name: 'auth-parent' })
          this.$snotify.error(e.message)
        })
        .finally(() => fireAuthObj.signOut())
    }
  },

  head: () => ({
    title: 'Auth Social Network Out'
  })
}
</script>
