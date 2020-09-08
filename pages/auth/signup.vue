<template>
  <v-row
    v-if="inInvitationProcess || isUserLoggedIn"
    class="flex-column-reverse flex-md-row"
    justify="center"
    no-gutters
  >
    <v-col class="px-12" cols="12" md="8">
      <p class="text-center text-md-left">
        <span class="font-weight-bold text-h5">
          PARENT'S INFORMATION
        </span>
      </p>

      <signup-form
        :in-invitation-process="inInvitationProcess"
        :loading="loading"
        @click:submit="onSubmit"
      />
    </v-col>

    <v-col class="px-12" cols="12" md="4">
      <p class="text-center text-md-left">
        <span class="font-weight-bold text-h5">
          MEMBERSHIP
        </span>

        <br>

        <small>
          Complete the registration and choose the plan that best suits you, to
          start your learning experience!
        </small>
      </p>

      <template v-if="!inInvitationProcess">
        <p>
          <span class="font-weight-bold">
            Get one week FREE trial
          </span>
        </p>

        <p>
          <small>You can cancel at any time from your account settings</small>
        </p>
      </template>
    </v-col>
  </v-row>

  <v-row v-else align="center" justify="center" no-gutters>
    <v-col cols="11" md="6">
      <div class="image">
        <img alt="Smiling Girl Picture" src="@/assets/svg/girl-smiling.svg">
      </div>
    </v-col>

    <v-col cols="12" md="6">
      <div class="form mx-auto px-4">
        <div class="my-5 my-md-0 text-center text-md-left">
          <underlined-title text="Sign Up now!" />
        </div>

        <p>
          Ready to start learning at home? Enter your email to create your
          account and start your membership today.
        </p>

        <signup-email-form :loading="loading" @click:submit="onSubmit" />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import SignupEmailForm from '@/components/forms/auth/SignupEmailForm'
import SignupForm from '@/components/forms/auth/SignupForm'

export default {
  name: 'Signup',

  components: {
    SignupEmailForm,
    SignupForm
  },

  data: vm => ({
    loading: false,
    inInvitationProcess: (() => {
      const { query } = vm.$route

      return Boolean(
        query.process === 'invitation' &&
          (query.email || query.phone) &&
          query.token
      )
    })(),
    token: vm.$route.query.token
  }),

  computed: mapGetters('auth', ['getUserInfo', 'isUserLoggedIn']),

  methods: {
    ...mapActions('auth/signup', {
      newParent: 'signupEmail',
      completeParentRegister: 'signupToken'
    }),

    ...mapActions('caregiver', { newCaregiver: 'signup' }),

    async onSubmit (data) {
      try {
        const isUserLoggedIn = this.isUserLoggedIn
        this.loading = true

        await this.registerProcess(
          this.inInvitationProcess ? { data, token: this.token } : data
        )

        this.$snotify.success('Welcome to Playgarden Prep!')

        if (this.inInvitationProcess) {
          await this.$router.push({ name: 'app-dashboard' })
        } else if (isUserLoggedIn) {
          await this.$router.push({
            name: 'app-children-register',
            query: { process: 'signup', step: '2' }
          })
        }
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    async registerProcess (data) {
      if (this.isUserLoggedIn) {
        return await this.completeParentRegister(data)
      }

      return this.inInvitationProcess
        ? await this.newCaregiver(data)
        : await this.newParent(data)
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
    max-width: 90%;
  }
}
.form {
  max-width: 500px;
}
</style>
