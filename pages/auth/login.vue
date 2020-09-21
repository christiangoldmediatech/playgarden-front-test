<template>
  <v-row align="center" justify="center" no-gutters>
    <v-col cols="11" md="6">
      <div class="image">
        <img alt="Smiling Girl Picture" src="@/assets/svg/girl-smiling.svg">
      </div>
    </v-col>

    <v-col cols="12" md="6">
      <div class="form mx-auto px-4">
        <div class="my-5 my-md-0 text-center text-md-left">
          <underlined-title text="Welcome back!" />
        </div>

        <login-form :loading="loading" @click:submit="onSubmit" />

        <!-- or -->
        <v-row no-gutters class="my-6">
          <v-col class="hr-line">
            <v-divider />
          </v-col>
          <v-col class="text-center">
            or
          </v-col>
          <v-col class="hr-line">
            <v-divider />
          </v-col>
        </v-row>

        <!-- Social buttons -->
        <v-row no-gutters>
          <!-- FACEBOOK -->
          <v-col
            cols="12"
            md="6"
            :class="{
              'pr-4': $vuetify.breakpoint.mdAndUp,
              'mb-4': $vuetify.breakpoint.smAndDown
            }"
          >
            <v-btn
              block
              height="45"
              class="social-btn"
              @click="facebookSignIn"
            >
              <img
                alt="Facebook"
                class="clickable mr-1"
                src="@/assets/svg/facebook_icon.svg"
              >
              <span class="spanSocialNetwork">Continue with Facebook</span>
            </v-btn>
          </v-col>
          <!-- GOOGLE -->
          <v-col
            cols="12"
            md="6"
            :class="{
              'pl-4': $vuetify.breakpoint.mdAndUp,
              'mb-6': $vuetify.breakpoint.smAndDown
            }"
          >
            <v-btn
              block
              height="45"
              class="social-btn"
              @click="googleSignIn"
            >
              <img
                class="clickable mr-1"
                src="@/assets/svg/google_icon.svg"
              >
              <span class="spanSocialNetwork">Continue with Google</span>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

import LoginForm from '@/components/forms/auth/LoginForm'

export default {
  name: 'Login',

  components: {
    LoginForm
  },

  data () {
    return {
      loading: false,
      errorMessage: '',
      userSocialNetwork: {}
    }
  },

  methods: {
    ...mapActions('auth/login', ['login']),
    ...mapActions('auth/socialUser', ['authLoginSocial']),

    async onSubmit (data) {
      try {
        this.loading = true
        this.errorMessage = ''

        await this.login(data)

        await this.$router.push({ name: 'app-dashboard' })
      } catch (error) {
        this.errorMessage = 'Sorry! Wrong email or password'
      } finally {
        this.loading = false
      }
    },
    googleSignIn () {
      const nameSocialNetwork = 'GOOGLE'
      const provider = new this.$fireAuthObj.GoogleAuthProvider()
      this.$fireAuthObj().signInWithPopup(provider).then((result) => {
        const profile = { ...result.additionalUserInfo.profile }
        this.userSocialNetwork.firstName = profile.given_name
        this.userSocialNetwork.lastName = profile.family_name
        this.userSocialNetwork.email = profile.email
        this.userSocialNetwork.socialNetwork = nameSocialNetwork
        this.userSocialNetwork.socialNetworkId = profile.id
        this.loginWithSocialNetwork(this.userSocialNetwork)
      }).catch((e) => {
        this.$snotify.error(e.message)
      })
    },
    facebookSignIn () {
      const nameSocialNetwork = 'FACEBOOK'
      const provider = new this.$fireAuthObj.FacebookAuthProvider()
      this.$fireAuthObj().signInWithPopup(provider).then((result) => {
        const profile = { ...result.additionalUserInfo.profile }
        this.userSocialNetwork.firstName = profile.first_name
        this.userSocialNetwork.lastName = profile.last_name
        this.userSocialNetwork.email = profile.email
        this.userSocialNetwork.socialNetwork = nameSocialNetwork
        this.userSocialNetwork.socialNetworkId = profile.id
        this.loginWithSocialNetwork(this.userSocialNetwork)
      }).catch((e) => {
        this.$snotify.error(e.message)
      })
    },
    async loginWithSocialNetwork (user) {
      const response = await this.authLoginSocial(user)
      if (response.status === 201) {
        this.$router.push({ name: 'app-dashboard' })
      } else {
        await this.$router.push({
          name: 'auth-signup'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.image {
  max-height: 500px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  img {
    max-width: 90%;
  }
}
.hr-line {
  display: flex;
  justify-content: center;
  align-items: center;
}
.form {
  max-width: 500px;
}
.error-message {
  color: $pg-error;
}
.spanSocialNetwork {
  font-size: 12px;
  line-height: 1.5;
  font-weight: 600;
  text-align: left;
  text-transform: none !important;
  color: #606060;
  text-transform: initial !important;
}
.social-btn {
  background-color: white !important;
}
</style>
