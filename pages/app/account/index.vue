<template>
  <v-row class="mt-md-0 mt-n9" no-gutters>
    <v-col cols="12" md="6">
      <div class="image">
        <img
          alt="Montessori Nutrition Lesson"
          src="@/assets/svg/montessori-nutrition-lesson.svg"
        >
      </div>

      <v-col class="mb-12 mt-3 px-12" cols="12">
        <underlined-title text="Account Settings" />

        <p>
          Welcome back {{ userInfo.fullName }}! Here you can manage everything
          related to your account.
        </p>

        <v-btn
          block
          class="hidden-sm-and-down"
          color="accent"
          text
          :to="{ name: 'auth-logout' }"
        >
          LOG OUT
        </v-btn>
      </v-col>
    </v-col>

    <v-col class="px-12" cols="12" md="6">
      <!--        <user-profile-form-->
      <!--          :loading="loading"-->
      <!--          :user="userInfo"-->
      <!--          @set-loading-state="setLoadingState"-->
      <!--        />-->

      <!--        <membership-form :loading="loading" />-->

      <!--        <caregivers-form :loading="loading" />-->
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

// import CaregiversForm from '@/components/forms/account/CaregiversForm'
// import UserProfileForm from '@/components/forms/account/UserProfileForm'
// import MembershipForm from '@/components/forms/account/MembershipForm'

export default {
  name: 'Index',

  components: {
    // CaregiversForm,
    // MembershipForm,
    // UserProfileForm
  },

  data: () => ({
    loading: false
  }),

  computed: mapGetters('auth', { userInfo: 'getUserInfo' }),

  methods: {
    setLoadingState (state) {
      this.loading = state
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
    max-width: 100%;
  }
}
</style>
