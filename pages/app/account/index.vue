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
      <update-profile :loading="loading" :user="userInfo" />

      <v-dialog
        v-model="passwordModal"
        content-class="white"
        :fullscreen="$vuetify.breakpoint.smAndDown"
        max-width="1000"
        persistent
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            block
            class="mb-6"
            color="accent"
            text
            x-large
            v-on="on"
          >
            EDIT PASSWORD
          </v-btn>
        </template>

        <v-col cols="12">
          <v-row class="pr-3" justify="end">
            <v-btn icon @click.stop="passwordModal = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-row>

          <update-password
            v-if="passwordModal"
            @click:cancel="passwordModal = false"
            @update:success="passwordModal = false"
          />
        </v-col>
      </v-dialog>

      <membership-details :loading="loading" />

      <caregiver-list :loading="loading" />
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

import CaregiverList from '~/components/app/caregiver/CaregiverList'
import MembershipDetails from '~/components/app/payment/MembershipDetails'
import UpdateProfile from '@/components/app/user/UpdateProfile'
import UpdatePassword from '@/components/app/password/UpdatePassword'

export default {
  name: 'Index',

  components: {
    CaregiverList,
    MembershipDetails,
    UpdatePassword,
    UpdateProfile
  },

  data: () => ({
    loading: false,
    passwordModal: false
  }),

  computed: mapGetters('auth', { userInfo: 'getUserInfo' })
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
