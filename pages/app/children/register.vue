<template>
  <v-row no-gutters>
    <v-col>
      <v-row no-gutters>
        <v-btn
          v-if="inSignUpProcess"
          color="accent"
          nuxt
          text
          :to="{ name: 'auth-signup', query: { process: 'signup', step: '1' } }"
        >
          <v-icon left>
            mdi-less-than
          </v-icon>

          Back
        </v-btn>
      </v-row>

      <v-row
        class="flex-column-reverse flex-md-row"
        justify="center"
        no-gutters
      >
        <v-col class="px-12" cols="12" md="8">
          <register-form :loading="loading" @click:submit="onSubmit" />
        </v-col>

        <v-col class="px-12" cols="12" md="4">
          <p
            class="font-weight-bold text-h5 pg-letter-spacing text-center text-md-left"
          >
            MEMBERSHIP
          </p>

          <p class="mt-5 text-center text-md-left">
            <small>
              Complete the registration and choose the plan that best suits you,
              to start your learning experience!
            </small>
          </p>

          <p class="text-center text-md-left">
            <v-chip
              color="orange"
              class="text-orange-info"
              label
            >
              Get one week FREE trial
            </v-chip>
          </p>

          <p class="text-center text-md-left">
            <small>You can cancel at any time from your account settings</small>
          </p>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

import RegisterForm from '@/components/forms/children/RegisterForm'

export default {
  name: 'Register',

  components: {
    RegisterForm
  },

  data: () => ({
    loading: false
  }),

  computed: {
    inSignUpProcess () {
      const { query } = this.$route

      return query.process === 'signup' && query.step === '2'
    }
  },

  methods: {
    ...mapActions('auth', ['fetchUserInfo']),

    ...mapActions('children', {
      storeChildren: 'store',
      updateChild: 'update'
    }),

    async onSubmit (children) {
      this.loading = true

      try {
        await Promise.all(
          children.map(child =>
            child.id
              ? this.updateChild({ id: child.id, params: child })
              : this.storeChildren(child)
          )
        )

        await this.fetchUserInfo()

        this.$snotify.success('Children have been stored successfully!')

        if (this.inSignUpProcess) {
          await this.$router.push({
            name: 'app-payment-plan',
            query: { process: 'signup', step: '3' }
          })
        } else {
          await this.$router.push({ name: 'app-account' })
        }
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.text-orange-info {
  background-color: $pg-orange !important;
  color: $pg-white !important;
  height: 19px;
  font-size: 15px;
}

.text-orange-info::v-deep.v-chip .v-chip__content {
  color: $pg-white !important;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 3.15px;
  line-height: 1.48;
  background-color: $pg-orange !important;
}

.text-orange-info::v-deep.v-chip--label {
    border-radius: 0px !important;
}
</style>
