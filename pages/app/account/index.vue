<template>
  <v-row class="mt-md-6 mt-0" no-gutters>
    <v-col cols="12" md="6">
      <v-row class="flex-column-reverse flex-md-column sticky" no-gutters>
        <div class="mb-3 mx-12 text-center text-md-left">
          <underlined-title text="Account" />

          <p>
            Welcome back {{ userInfo.fullName }}! Here you can manage everything
            related to your account.
          </p>
        </div>

        <div class="pb-md-10">
          <div
            class="image"
            :class="{ 'image-bar': $vuetify.breakpoint.mdAndUp }"
          >
            <img
              alt="Montessori Nutrition Lesson"
              :src="
                showSetting
                  ? require('@/assets/svg/montessori-nutrition-lesson.svg')
                  : require('@/assets/png/profile/child-profile-bkg.png')
              "
              class="pr-md-6"
            >

            <v-select
              v-model="showSetting"
              class="hidden-md-and-up show-setting-select white"
              hide-details
              :items="showSettings"
              solo
            />
          </div>
        </div>

        <div class="hidden-sm-and-down mb-12 mt-6 text-right">
          <v-btn color="accent" nuxt :to="{ name: 'auth-logout' }">
            LOG OUT
          </v-btn>
        </div>
      </v-row>
    </v-col>

    <v-col class="px-12" cols="12" md="6">
      <v-row class="hidden-sm-and-down mb-6">
        <v-col
          v-for="({ text, value }, indexSS) in showSettings"
          :key="indexSS"
          cols="12"
          md="6"
        >
          <v-btn
            block
            :color="showSetting === value ? 'primary' : 'grey lighten-5'"
            :disabled="loading"
            @click="showSetting = value"
          >
            {{ text }}
          </v-btn>
        </v-col>
      </v-row>

      <div v-show="showSetting">
        <v-row no-gutters>
          <v-col>
            <v-text-field
              disabled
              label="First name"
              solo
              :value="userInfo.email"
            />

            <v-text-field disabled label="Password" solo suffix="••••••••••" />
          </v-col>
        </v-row>

        <v-dialog
          v-model="passwordModal"
          content-class="white"
          :fullscreen="$vuetify.breakpoint.smAndDown"
          max-width="1000"
          persistent
        >
          <template v-slot:activator="{ on, attrs }">
            <v-row class="mb-6" justify="end" no-gutters>
              <v-btn v-bind="attrs" color="primary" text v-on="on">
                CHANGE PASSWORD
              </v-btn>
            </v-row>
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

        <shipping-address-details :loading="loading" />

        <caregiver-list :loading="loading" />

        <notification-list :loading="loading" />
      </div>

      <child-form v-show="!showSetting" />

      <v-btn
        block
        class="hidden-md-and-up my-6"
        color="accent"
        nuxt
        :to="{ name: 'auth-logout' }"
      >
        LOG OUT
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

import CaregiverList from '@/components/app/caregiver/CaregiverList'
import ChildForm from '@/components/forms/profile/ChildForm.vue'
import MembershipDetails from '@/components/app/payment/MembershipDetails'
import NotificationList from '@/components/app/notifications/NotificationUserList'
import ShippingAddressDetails from '@/components/app/payment/ShippingAddressDetails'
import UpdatePassword from '@/components/app/password/UpdatePassword'

export default {
  name: 'Index',

  components: {
    CaregiverList,
    ChildForm,
    MembershipDetails,
    NotificationList,
    ShippingAddressDetails,
    UpdatePassword
  },

  data: vm => ({
    loading: false,
    passwordModal: false,
    showSetting: Number(vm.$route.query.tab) !== 2,
    showSettings: [
      { text: 'ACCOUNT SETTINGS', value: true },
      { text: 'STUDENT PROFILES', value: false }
    ]
  }),

  computed: mapGetters('auth', { userInfo: 'getUserInfo' })
}
</script>

<style lang="scss" scoped>
.image {
  align-content: center;
  display: flex;
  justify-content: center;
  max-height: 500px;
  min-height: 100px;
  width: 100%;

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

.show-setting-select {
  max-width: 225px;
  position: absolute;
  right: 10px;
  top: 10px;
  width: 100%;
}

.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 100px;
}
</style>
