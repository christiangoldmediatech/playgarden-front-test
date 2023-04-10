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
  },

  created () {
    this.getDataFirebase()
  },

  methods: {
    getProviderSignIn (provider) {
      let nameProvider = ''
      switch (provider) {
        case 'google.com':
          nameProvider = 'GOOGLE'
          break
        case 'facebook.com':
          nameProvider = 'FACEBOOK'
          break
      }
      return nameProvider
    },
    getDataFirebase () {
      const fireAuthObj = this.$fireAuthObj()
      fireAuthObj
        .getRedirectResult()
        .then((result) => {
          if (result) {
            if (result.additionalUserInfo) {
              const profile = { ...result.additionalUserInfo.profile }
              this.loginWithSocialNetwork({
                firstName: profile.given_name || profile.first_name || '',
                lastName: profile.family_name || profile.last_name || '',
                email: profile.email,
                socialNetwork: this.getProviderSignIn(result.additionalUserInfo.providerId),
                socialNetworkId: profile.id
              })
            } else {
              this.setSocialNetwork()
            }
          }
        })
        .catch((e) => {
          this.$toast.error(e.message)
        })
        .finally(() => fireAuthObj.signOut())
    },
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
        await this.$router.push({ name: 'app-virtual-preschool' })
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
        this.$toast.error('This email is already on used!')
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
          await this.$router.push({ name: 'app-virtual-preschool' })
        }
      } catch (error) {
        this.errorMessage = 'Sorry! Wrong email or password'
      } finally {
        this.loading = false
      }
    },

    socialSignIn (nameSocialNetwork, provider) {
      const fireAuthObj = this.$fireAuthObj()
      fireAuthObj.signInWithRedirect(provider)
    }
  },

  head: () => ({
    title: 'Auth Social Network Out'
  })
}
</script>
