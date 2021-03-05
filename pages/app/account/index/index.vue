<template>
  <v-row no-gutters>
    <v-col cols="12" md="6">
      <div class="pg-title--uppercase pb-8">
        General Info
      </div>
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
      <v-row v-if="!userInfo.socialNetwork && !userInfo.socialNetworkId" class="mb-10">
        <!-- FACEBOOK -->
        <v-col class="mb-4 mb-md-0" cols="12">
          <v-btn block height="45" class="social-sync" @click="facebookSignIn">
            <img
              alt="Facebook"
              class="mr-1"
              src="@/assets/svg/facebook_icon.svg"
            >

            <span class="text-transform-none">Sync your Facebook Account</span>
          </v-btn>
        </v-col>

        <!-- GOOGLE -->
        <v-col class="mb-4 mb-md-0" cols="12">
          <v-btn block height="45" class="social-sync" @click="googleSignIn">
            <img
              alt="Google"
              class="mr-1"
              src="@/assets/svg/google_icon.svg"
            >

            <span class="text-transform-none">Sync your Google Account</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-else justify="center" class="mb-8">
        <!-- FACEBOOK -->
        <v-btn v-if="userInfo.socialNetwork === 'FACEBOOK'" block height="45" class="social-sync" text>
          <img
            alt="Facebook"
            class="mr-1"
            src="@/assets/svg/facebook_icon.svg"
          >

          <span class="text-transform-none">Your account is synced with Facebook</span>
        </v-btn>
        <!-- GOOGLE -->
        <v-btn v-if="userInfo.socialNetwork === 'GOOGLE'" block height="45" class="social-sync" text>
          <img
            alt="Google"
            class="mr-1"
            src="@/assets/svg/google_icon.svg"
          >

          <span class="text-transform-none">Your account is synced with Google</span>
        </v-btn>
      </v-row>

      <v-btn
        color="accent"
        nuxt
        :to="{ name: 'auth-logout' }"
        width="200"
        x-large
      >
        LOG OUT
      </v-btn>
    </v-col>

    <v-col v-if="!isUserCaregiver" class="px-12" cols="12" md="6">
      <div class="pg-title--uppercase pb-8">
        Shipping Address
      </div>
      <shipping-address-details />
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import ShippingAddressDetails from '@/components/app/payment/ShippingAddressDetails'
import UpdatePassword from '@/components/app/password/UpdatePassword'

export default {
  name: 'Index',

  components: {
    ShippingAddressDetails,
    UpdatePassword
  },

  data: () => ({
    btns: [
      { text: 'General' },
      { text: 'Student Profile' },
      { text: 'Membership' },
      { text: 'Caregivers' },
      { text: 'Notification' }
    ],
    passwordModal: false
  }),

  computed: mapGetters('auth', {
    userInfo: 'getUserInfo',
    isUserCaregiver: 'isUserCaregiver'
  }),

  methods: {
    ...mapActions('auth', ['fetchUserInfo']),

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
        if (this.userInfo.email === user.email) {
          await this.fetchUserInfo()
          this.$snotify.success('The account has been successfully synchronized with the social network.')
        }
      } catch (e) {
        this.$snotify.error(e.message)
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.social-sync {
  text-transform: capitalize !important;
  font-size: 14px !important;
}
</style>
