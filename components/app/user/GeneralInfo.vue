<template>
  <div>
    <!-- Editable user info -->
    <div v-if="isEditing">
      <pg-text-field
        v-model="form.firstName"
        label="First Name"
        solo
      />

      <pg-text-field
        v-model="form.lastName"
        label="Last Name"
        solo
      />

      <pg-text-field
        v-model="form.phoneNumber"
        label="Phone number"
        solo
      />
    </div>

    <!-- Readonly user info -->
    <v-row v-else class="grey--text pb-8">
      <v-col cols="6">
        Name
      </v-col>
      <v-col cols="6" class="text-right">
        {{ fullName }}
      </v-col>

      <v-col cols="6">
        Email
      </v-col>
      <v-col cols="6" class="text-right">
        {{ userInfo.email }}
      </v-col>

      <v-col cols="6">
        Password
      </v-col>
      <v-col cols="6" class="text-right">
        ••••••••••
      </v-col>

      <v-col cols="6">
        Phone number
      </v-col>
      <v-col cols="6" class="text-right">
        {{ userInfo.phoneNumber }}
      </v-col>
    </v-row>

    <v-btn
      v-if="isEditing"
      x-large
      block
      class="warning"
      :loading="loading"
      @click="saveUserInfo"
    >
      Save
    </v-btn>

    <v-btn v-else x-large block class="primary" @click="isEditing = true">
      Edit
    </v-btn>

    <v-dialog
      v-if="isEditing"
      v-model="passwordModal"
      content-class="white"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      max-width="1000"
      persistent
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          x-large
          block
          color="primary"
          text
          v-on="on"
        >
          Change Password
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

    <!-- Social buttons before sync -->
    <v-row v-if="!userInfo.socialNetwork && !userInfo.socialNetworkId" no-gutters>
      <!-- FACEBOOK -->
      <v-col cols="12" class="py-4">
        <v-btn block x-large class="social-sync" @click="facebookSignIn">
          <img
            alt="Facebook"
            class="mr-1"
            src="@/assets/svg/facebook_icon.svg"
          >

          <span class="text-transform-none">Sync your Facebook Account</span>
        </v-btn>
      </v-col>

      <!-- GOOGLE -->
      <v-col cols="12">
        <v-btn block x-large class="social-sync" @click="googleSignIn">
          <img
            alt="Google"
            class="mr-1"
            src="@/assets/svg/google_icon.svg"
          >

          <span class="text-transform-none">Sync your Google Account</span>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Social buttons after sync -->
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import UpdatePassword from '@/components/app/password/UpdatePassword'

export default {
  name: 'GeneralInfo',

  components: {
    UpdatePassword
  },

  data: () => ({
    form: {},
    isEditing: false,
    passwordModal: false,
    loading: false
  }),

  computed: {
    ...mapGetters('auth', {
      userInfo: 'getUserInfo',
      isUserCaregiver: 'isUserCaregiver'
    }),
    fullName () {
      return `${this.userInfo.firstName ?? ''} ${this.userInfo.lastName ?? ''}`.trim()
    }
  },

  watch: {
    userInfo: {
      immediate: true,
      deep: true,
      handler () {
        this.form = { ...this.userInfo }
      }
    }
  },

  methods: {
    ...mapActions('auth', ['fetchUserInfo', 'updateUserInfo']),

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
    },

    async saveUserInfo () {
      try {
        this.loading = true

        await this.updateUserInfo({
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          phoneNumber: this.form.phoneNumber
        })
      } finally {
        this.loading = false
        this.isEditing = false
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
