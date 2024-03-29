<template>
  <div class="d-flex flex-column align-center w-100">
    <v-col cols="12" class="pa-0">
      <v-row no-gutters>
        <v-col cols="12">
          <v-row no-gutters>
            <v-col cols="12" md="6" class="pr-0 pr-md-4">
              <span class="d-inline-block account-field-label mb-2">{{ $t('commonWords.firstName') }}</span>
              <pg-text-field
                v-model="form.firstName"
                background-color="#F7F7F7"
                color="#AAAAAA"
                solo
                dense
                flat
                :class="{ 'custom-text-field': isEditing }"
                :readonly="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="6" class="pl-0 pl-md-4">
              <span class="d-inline-block account-field-label mb-2">{{ $t('commonWords.lastName') }}</span>
              <v-text-field
                v-model="form.lastName"
                background-color="#F7F7F7"
                color="#AAAAAA"
                solo
                flat
                :class="{ 'custom-text-field': isEditing }"
                :readonly="!isEditing"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12">
              <span class="d-inline-block account-field-label mb-2">{{ $t('commonWords.emailPlaceholder') }}</span>
              <v-text-field
                v-model="form.email"
                background-color="#F7F7F7"
                color="#AAAAAA"
                solo
                flat
                :class="{ 'custom-text-field': isEditing }"
                :readonly="!isEditing"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <!-- This is just for showing a password field -->
            <v-col cols="12" md="6" class="pr-0 pr-md-4">
              <span class="d-inline-block account-field-label mb-2">{{ $t('commonWords.password') }}</span>
              <v-text-field
                value="*********"
                background-color="#F7F7F7"
                color="#AAAAAA"
                solo
                flat
                :class="{ 'custom-text-field': isEditing }"
                :readonly="true"
              />
            </v-col>
            <v-col cols="12" md="6" class="pl-0 pl-md-4">
              <span class="d-inline-block account-field-label mb-2">{{ $t('commonWords.phoneNumber') }}</span>
              <v-text-field
                v-model="form.phoneNumber"
                background-color="#F7F7F7"
                color="#AAAAAA"
                solo
                flat
                :class="{ 'custom-text-field': isEditing }"
                :readonly="!isEditing"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>

    <template v-if="isEditing">
      <v-btn
        v-if="isEditing"
        x-large
        block
        class="white--text rounded-0"
        color="#AAD579"
        elevation="0"
        :loading="loading"
        @click="saveUserInfo"
      >
        {{ $t('commonWords.save') }}
      </v-btn>

      <v-btn
        x-large
        block
        text
        class="text-decoration-underline"
        color="#F89838"
        @click="isEditing = false"
      >
        {{ $t('commonWords.cancel') }}
      </v-btn>
    </template>

    <pg-dialog
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
          class="white--text rounded-0"
          color="#AAD579"
          elevation="0"
          v-on="on"
        >
          {{ $t('commonWords.changePassword') }}
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
    </pg-dialog>

    <!-- Social buttons before sync -->
    <v-row v-if="!userInfo.socialNetwork && !userInfo.socialNetworkId" no-gutters>
      <!-- FACEBOOK -->
      <v-col cols="12" class="py-4">
        <v-btn block x-large @click="facebookSignIn">
          <img
            alt="Facebook"
            class="mr-1"
            src="@/assets/svg/facebook_icon.svg"
          >

          <span class="text-none font-weight-bold text-caption text-sm-body-2">{{ $t('account.general.syncFacebook') }}</span>
        </v-btn>
      </v-col>

      <!-- GOOGLE -->
      <v-col cols="12">
        <v-btn block x-large @click="googleSignIn">
          <img
            alt="Google"
            class="mr-1"
            src="@/assets/svg/google_icon.svg"
          >

          <span class="text-none font-weight-bold text-caption text-sm-body-2">{{ $t('account.general.syncGoogle') }}</span>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Social buttons after sync -->
    <v-row v-else justify="center" class="my-2">
      <!-- FACEBOOK -->
      <div v-if="userInfo.socialNetwork === 'FACEBOOK'" class="my-2" text>
        <img
          alt="Facebook"
          class="mr-1 mb-n2"
          src="@/assets/svg/facebook_icon.svg"
        >

        <span class="text-none font-weight-bold text-caption text-sm-body-2">{{ $t('account.general.connectedFacebook') }}</span>
      </div>
      <!-- GOOGLE -->
      <div v-if="userInfo.socialNetwork === 'GOOGLE'" class="my-2" text>
        <img
          alt="Google"
          class="mr-1 mb-n2"
          src="@/assets/svg/google_icon.svg"
        >

        <span class="text-none font-weight-bold text-caption text-sm-body-2">{{ $t('account.general.connectedGoogle') }}</span>
      </div>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { TAG_MANAGER_EVENTS } from '@/models'

import UpdatePassword from '@/components/app/password/UpdatePassword'

export default {
  name: 'GeneralInfo',

  components: {
    UpdatePassword
  },

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    form: {},
    passwordModal: false,
    loading: false
  }),

  computed: {
    ...mapGetters('auth', {
      userInfo: 'getUserInfo',
      isUserCaregiver: 'isUserCaregiver'
    }),

    isEditing: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },

    fullName () {
      return this.userInfo.fullName // `${this.userInfo.firstName ?? ''} ${this.userInfo.lastName ?? ''}`.trim()
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

  created () {
    this.getDataFirebase()
  },

  methods: {
    ...mapActions('auth', ['fetchUserInfo', 'updateUserInfo']),

    ...mapActions(['disableAxiosGlobal', 'enableAxiosGlobal']),

    ...mapActions('auth/socialUser', ['authSyncSocial']),

    getProviderSignIn (provider) {
      let nameProvider = ''
      switch (provider) {
        case 'google.com':
          nameProvider = 'GOOGLE'
          break
        case 'facebook.com':
          nameProvider = 'FACEBOOK'
          break
      }
      return nameProvider
    },

    getDataFirebase () {
      const fireAuthObj = this.$fireAuthObj()
      fireAuthObj
        .getRedirectResult()
        .then((result) => {
          if (result) {
            if (result.additionalUserInfo) {
              const profile = { ...result.additionalUserInfo.profile }
              this.syncWithSocialNetwork({
                firstName: profile.given_name || profile.first_name || '',
                lastName: profile.family_name || profile.last_name || '',
                email: profile.email,
                socialNetwork: this.getProviderSignIn(result.additionalUserInfo.providerId),
                socialNetworkId: profile.id
              })
            }
          }
        })
        .catch((e) => {
          this.$toast.error(e.message)
        })
        .finally(() => fireAuthObj.signOut())
    },

    facebookSignIn () {
      this.syncAccount(
        'FACEBOOK',
        new this.$fireAuthObj.FacebookAuthProvider()
      )
      this.$gtm.push({
        event: TAG_MANAGER_EVENTS.ACCOUNT_SYNC_FACEBOOK,
        userId: this.userInfo.id
      })
    },

    googleSignIn () {
      this.syncAccount('GOOGLE', new this.$fireAuthObj.GoogleAuthProvider())
      this.$gtm.push({
        event: TAG_MANAGER_EVENTS.ACCOUNT_SYNC_GOOGLE,
        userId: this.userInfo.id
      })
    },

    syncAccount (nameSocialNetwork, provider) {
      const fireAuthObj = this.$fireAuthObj()
      fireAuthObj.signInWithRedirect(provider)
    },

    async syncWithSocialNetwork (user) {
      try {
        this.disableAxiosGlobal()
        await this.authSyncSocial(user)
        this.enableAxiosGlobal()
        if (this.userInfo.email === user.email) {
          await this.fetchUserInfo()
          this.$toast.success('The account has been successfully synchronized with the social network.')
        }
      } catch (e) {
        this.$toast.error(e.message)
      }
    },

    async saveUserInfo () {
      try {
        this.loading = true

        await this.updateUserInfo({
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          email: this.form.email,
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
@import '~/assets/scss/app.scss';
@import '~/assets/scss/account.scss';

.text-caption {
  color: var(--v-black-base);
}

::v-deep .v-text-field .v-input__control .v-input__slot input {
  color: #AAAAAA !important;
}
</style>
