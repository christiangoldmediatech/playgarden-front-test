<template>
  <section>
    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="12">
            <div class="image">
              <img
                alt="Montessori Nutrition Lesson"
                src="@/assets/svg/montessori-nutrition-lesson.svg"
              >
            </div>
          </v-col>

          <v-col class="mb-12 mt-3" cols="12">
            <underlined-title text="Account Settings" />

            <p>
              Welcome back (Parent’s Name)! Here you can manage everything
              related to your account.
            </p>
          </v-col>

          <v-col class="hidden-sm-and-down" cols="12">
            <v-btn block color="accent" text :to="{ name: 'auth-logout' }">
              LOG OUT
            </v-btn>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="6" px-9>
        <user-profile-form
          :loading="loading"
          :user="userInfo"
          @set-loading-state="setLoadingState"
        />

        <membership-form :loading="loading" />

        <caregivers-form :loading="loading" />
      </v-col>
    </v-row>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

import CaregiversForm from '@/components/forms/account/CaregiversForm'
import UserProfileForm from '@/components/forms/account/UserProfileForm'
import MembershipForm from '@/components/forms/account/MembershipForm'

export default {
  name: 'Index',

  components: {
    CaregiversForm,
    MembershipForm,
    UserProfileForm
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
