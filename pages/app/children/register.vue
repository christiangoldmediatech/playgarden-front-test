<template>
  <section>
    <v-row no-gutters>
      <v-col class="px-12" cols="12" md="8">
        <register-children :loading="loading" @click:submit="onSubmit" />
      </v-col>

      <v-col class="px-12" cols="12" md="4">
        <p>
          <span class="font-weight-bold text-h5">
            CHILD'S INFORMATION
          </span>

          <br>

          <small>
            Complete your registration and membership subscription to start
            enjoying our learning experience!
          </small>
        </p>

        <p>
          Pricing:

          <br>

          <span class="font-weight-bold">
            Pay $0.99 USD a day for first child and $0.20 USD a day per
            additional*
          </span>
        </p>

        <p>*Get a FREE trial for the first week!</p>

        <p>
          <small>You can cancel at any time from your account settings</small>
        </p>
      </v-col>
    </v-row>
  </section>
</template>

<script>
import { mapActions } from 'vuex'

import RegisterChildren from '@/components/forms/children/RegisterForm'

export default {
  name: 'Register',

  components: {
    RegisterChildren
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
    ...mapActions('children', { storeChildren: 'store' }),

    onSubmit (children) {
      this.loading = true

      Promise.all(children.map(child => this.storeChildren(child)))
        .then(() => {
          this.$snotify.success('Children have been stored successfully!')

          this.$router.push({
            name: this.inSignUpProcess
              ? 'app-payment-register'
              : 'app-children'
          })
        })
        .finally(() => (this.loading = false))
    },

    handleRegisterChildrenError (error) {
      this.errorMessage = 'Oops! Error'
      // eslint-disable-next-line
      console.error(error);
    }
  }
}
</script>

<style lang="scss" scoped>
.image {
  height: 100%;
  max-height: 500px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  img {
    height: 100%;
  }
}
</style>
