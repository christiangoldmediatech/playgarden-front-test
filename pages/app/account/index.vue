<template>
  <v-row class="mt-md-6 mt-0" no-gutters>
    <v-col cols="12" md="6">
      <v-row class="flex-column-reverse flex-md-column sticky" no-gutters>
        <div class="mb-3 mt-6 mt-md-0 mx-12 text-center text-md-left">
          <underlined-title text="Account" />

          <p>
            Welcome back {{ userInfo.fullName }}! Here you can manage everything
            related to your account.
          </p>
        </div>

        <v-col class="pb-md-10">
          <v-row
            class="image"
            :class="{ 'image-bar': $vuetify.breakpoint.mdAndUp }"
            no-gutters
          >
            <img
              alt="Montessori Nutrition Lesson"
              class="pr-md-6"
              :src="
                showSetting
                  ? require('@/assets/jpg/Montessori_Nutrition_Lesson.jpg')
                  : require('@/assets/jpg/Test_tube_lesson.jpg')
              "
            >

            <pg-select
              v-if="!isUserCaregiver"
              v-model="showSetting"
              class="hidden-md-and-up show-setting-select white"
              hide-details
              :items="showSettings"
              solo
            />
          </v-row>
        </v-col>

        <div class="hidden-sm-and-down mb-12 mt-6 text-right">
          <v-btn
            color="accent"
            nuxt
            :to="{ name: 'auth-logout' }"
            width="200"
            x-large
          >
            LOG OUT
          </v-btn>
        </div>
      </v-row>
    </v-col>

    <v-col class="px-12" cols="12" md="6">
      <v-row v-if="!isUserCaregiver" class="hidden-sm-and-down">
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
            x-large
            @click="showSetting = value"
          >
            {{ text }}
          </v-btn>
        </v-col>
      </v-row>

      <div v-show="showSetting" class="mt-6">
        <v-row no-gutters>
          <v-col>
            <pg-text-field
              disabled
              label="Email"
              solo
              :value="userInfo.email"
            />

            <pg-text-field
              disabled
              hide-details
              label="Password"
              solo
              suffix="••••••••••"
            />
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

        <!-- Social buttons -->
        <v-row>
          <!-- FACEBOOK -->
          <v-col class="mb-4 mb-md-0 pr-md-4" cols="12" md="6">
            <v-btn block height="45" class="social-btn" @click="facebookSignIn">
              <img
                alt="Facebook"
                class="mr-1"
                src="@/assets/svg/facebook_icon.svg"
              >

              <span class="spanSocialNetwork">Sync with Facebook</span>
            </v-btn>
          </v-col>

          <!-- GOOGLE -->
          <v-col class="mb-6 mb-md-0 pl-md-4" cols="12" md="6">
            <v-btn block height="45" class="social-btn" @click="googleSignIn">
              <img
                alt="Google"
                class="mr-1"
                src="@/assets/svg/google_icon.svg"
              >

              <span class="spanSocialNetwork">Sync with Google</span>
            </v-btn>
          </v-col>
        </v-row>

        <template v-if="!isUserCaregiver">
          <membership-details :loading="loading" />

          <shipping-address-details :loading="loading" />

          <caregiver-list :loading="loading" manageable />

          <manage-caregivers class="my-6" />

          <notification-list :loading="loading" />
        </template>
      </div>

      <child-form v-show="!showSetting" />

      <v-btn
        block
        class="hidden-md-and-up my-6"
        color="accent"
        nuxt
        :to="{ name: 'auth-logout' }"
        x-large
      >
        LOG OUT
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import CaregiverList from '@/components/app/caregiver/CaregiverList'
import ChildForm from '@/components/forms/profile/ChildForm.vue'
import ManageCaregivers from '@/components/app/caregiver/ManageCaregivers'
import MembershipDetails from '@/components/app/payment/MembershipDetails'
import NotificationList from '@/components/app/notifications/NotificationUserList'
import ShippingAddressDetails from '@/components/app/payment/ShippingAddressDetails'
import UpdatePassword from '@/components/app/password/UpdatePassword'

export default {
  name: 'Index',

  components: {
    CaregiverList,
    ChildForm,
    ManageCaregivers,
    MembershipDetails,
    NotificationList,
    ShippingAddressDetails,
    UpdatePassword
  },

  data: () => ({
    loading: false,
    passwordModal: false,
    showSetting: true,
    showSettings: [
      { text: 'ACCOUNT SETTINGS', value: true },
      { text: 'STUDENT PROFILES', value: false }
    ]
  }),

  computed: mapGetters('auth', {
    userInfo: 'getUserInfo',
    isUserCaregiver: 'isUserCaregiver'
  }),

  created () {
    this.showSetting =
      Number(this.$route.query.tab) !== 2 || this.isUserCaregiver
  },

  methods: {
    ...mapActions(['disableAxiosGlobal', 'enableAxiosGlobal']),

    ...mapActions('auth/socialUser', ['authSyncSocial']),

    facebookSignIn () {
      this.syncAccount(
        'FACEBOOK',
        new this.$fireAuthObj.FacebookAuthProvider()
      )
    },

    googleSignIn () {
      this.syncAccount('GOOGLE', new this.$fireAuthObj.GoogleAuthProvider())
    },

    syncAccount (nameSocialNetwork, provider) {
      const fireAuthObj = this.$fireAuthObj()

      fireAuthObj
        .signInWithPopup(provider)
        .then((result) => {
          const profile = { ...result.additionalUserInfo.profile }
          console.log('profile', profile)

          this.syncWithSocialNetwork({
            firstName: profile.given_name || profile.first_name || '',
            lastName: profile.family_name || profile.last_name || '',
            email: profile.email,
            socialNetwork: nameSocialNetwork,
            socialNetworkId: profile.id
          })
        })
        .catch((e) => {
          this.$snotify.error(e.message)
        })
        .finally(() => fireAuthObj.signOut())
    },

    async syncWithSocialNetwork (user) {
      try {
        this.disableAxiosGlobal()

        await this.authSyncSocial(user)

        this.enableAxiosGlobal()
      } catch (e) {
        // await this.onFailLoginSocial(user)
        console.log(e)
      }
    }

  }
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
    height: 250px;
  }
}

.image-bar {
  position: relative;
  z-index: 1;

  &::after {
    border-bottom: 32px solid var(--v-primary-base);
    bottom: -16px;
    content: "";
    position: absolute;
    right: 0;
    width: 1000%;
    z-index: -1;
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
