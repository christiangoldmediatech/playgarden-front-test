<template>
  <v-row class="mt-md-6 mt-n9" no-gutters>
    <v-col cols="12" md="6">
      <div class="mx-12">
        <underlined-title text="Account" />

        <p>
          Welcome back {{ userInfo.fullName }}! Here you can manage everything
          related to your account.
        </p>
      </div>

      <div v-show="showSetting" class="image">
        <img
          alt="Montessori Nutrition Lesson"
          src="@/assets/svg/montessori-nutrition-lesson.svg"
        >
      </div>

      <div v-show="!showSetting" class="pr-6 image-bar mb-10">
        <v-img
          :src="require('@/assets/png/profile/child-profile-bkg.png')"
          contain
        />
      </div>

      <div class="mb-12 mt-6 text-right">
        <v-btn
          class="px-13 hidden-sm-and-down"
          color="accent"
          nuxt
          :to="{ name: 'auth-logout' }"
        >
          LOG OUT
        </v-btn>
      </div>
    </v-col>

    <v-col class="px-12" cols="12" md="6">
      <v-row class="mb-6">
        <v-col cols="6">
          <v-btn
            block
            :color="showSetting ? 'primary' : 'grey lighten-5'"
            :disabled="loading"
            @click="showSetting = true"
          >
            ACCOUNT SETTINGS
          </v-btn>
        </v-col>

        <v-col cols="6">
          <v-btn
            block
            :color="!showSetting ? 'primary' : 'grey lighten-5'"
            :disabled="loading"
            @click="showSetting = false"
          >
            STUDENT PROFILES
          </v-btn>
        </v-col>
      </v-row>

      <div v-show="showSetting">
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
      </div>

      <child-form v-show="!showSetting" />
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

import CaregiverList from '@/components/app/caregiver/CaregiverList'
import ChildForm from '@/components/forms/profile/ChildForm.vue'
import MembershipDetails from '@/components/app/payment/MembershipDetails'
import UpdatePassword from '@/components/app/password/UpdatePassword'
import UpdateProfile from '@/components/app/user/UpdateProfile'

export default {
  name: 'Index',

  components: {
    CaregiverList,
    ChildForm,
    MembershipDetails,
    UpdatePassword,
    UpdateProfile
  },

  data: () => ({
    loading: false,
    passwordModal: false,
    showSetting: true
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

.image-bar {
  position: relative;
  z-index: 1;
  &::after {
    width: 100%;
    position: absolute;
    bottom: -16px;
    content: "";
    z-index: -1;
    border-bottom: 32px solid var(--v-primary-base);
  }
}
</style>
