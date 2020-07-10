<template>
  <v-row no-gutters>
    <v-col class="hidden-sm-and-down" cols="6">
      <div class="image">
        <img alt="Montessori Nutrition Lesson" src="@/assets/svg/montessori-nutrition-lesson.svg">
      </div>
    </v-col>
    <v-col class="hidden-sm-and-down" cols="1" />
    <v-col class="hidden-sm-and-down" cols="4">
      <user-profile-form :loading="isLoadingForm" :user="loggedUserData" @set-loading-state="setLoadingState" />

      <membership-form :loading="isLoadingForm" />
      <caregivers-form :loading="isLoadingForm" />
    </v-col>
    <v-col class="hidden-sm-and-down" cols="1" />
  </v-row>
</template>

<script>
import UserProfileForm from '@/components/forms/account/UserProfileForm'
import MembershipForm from '@/components/forms/account/MembershipForm'
import CaregiversForm from '@/components/forms/account/CaregiversForm'

export default {
  // middleware: ['redirectToAuthPage'],
  name: 'Index',

  components: {
    UserProfileForm,
    MembershipForm,
    CaregiversForm
  },
  data () {
    return {
      isLoadingForm: false,
      loggedUserData: {},
      errorMessage: ''
    }
  },
  mounted () {
    this.getLoggedUserData()
  },
  methods: {
    setLoadingState (state) {
      this.isLoadingForm = state
      // eslint-disable-next-line no-console
      console.log(this.isLoadingForm)
    },
    async getLoggedUserData () {
      try {
        this.isLoadingForm = true
        const token = this.$store.getters['auth/getAccessToken']
        this.$axios.setToken(token, 'Bearer')

        const { data } = await this.$axios.get(`${process.env.apiBaseUrl}/auth/me`)

        this.loggedUserData = data
      } catch (error) {
        this.handleLoginError(error)
      } finally {
        this.isLoadingForm = false
      }
    },
    handleLoginError (error) {
      // TODO: Remove this alert to a global component
      this.errorMessage = 'Sorry! Error trying to get user data'
      // eslint-disable-next-line
      console.error(error)
    }
  }
}
</script>

<style lang="scss" scoped>
  .image {
    height: 100%;
    max-height: 360px;
    width: 100%;
    display: flex;
    justify-content: left;
    align-content: left;
    img {
      height: 100%;
    }
  }
</style>
