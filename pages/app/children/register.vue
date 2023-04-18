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
          <p class="mt-6 mb-12 text-center text-md-left">
            <small>
              Complete the registration and choose the plan that best suits your family's needs!
            </small>
          </p>

          <p class="mt-6 text-center text-md-left">
            <v-row
              no-gutters
            >
              <v-col cols="1">
                <v-img
                  :src="require('@/assets/png/gift-icon.png')"
                  class="clickable close-btn-playgarden"
                  width="18px"
                />
              </v-col>
              <v-col>
                <span class="font-weight-bold text-uppercase pg-letter-spacing-subtitle">
                  GET 15 DAYS OF FREE TRIAL
                </span>
                <v-row no-gutters>
                  <span class="mt-3 font-weight-bold">That includes:</span>
                </v-row>
                <v-row>
                  <ul>
                    <li
                      class="register-item"
                    >
                      <small class="text-trial">
                        A Daily Learning Schedule
                      </small>
                    </li>
                    <li
                      class="register-item"
                    >
                      <small class="text-trial">
                        Access to over 1,200 lessons
                      </small>
                    </li>
                    <li
                      class="register-item"
                    >
                      <small class="text-trial">
                        Live Classes with Playgarden Prep Teachers
                      </small>
                    </li>
                  </ul>
                </v-row>
              </v-col>
            </v-row>
          </p>

          <p class="mt-10 text-center text-md-left">
            <small>*You can cancel your membership any time from the Account Settings.</small>
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

        this.$toast.success('Child information has been saved!')

        if (this.inSignUpProcess) {
          await this.$router.push({
            name: 'app-payment-plan',
            query: { process: 'signup', step: '3' }
          })
        } else {
          await this.$router.push({ name: 'app-account-index' })
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
  background-color: var(--v-accent-base) !important;
  color: var(--v-white-base) !important;
  height: 19px;
  font-size: 15px;
}

.text-orange-info::v-deep.v-chip .v-chip__content {
  color: var(--v-white-base) !important;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 3.15px;
  line-height: 1.48;
  background-color: var(--v-accent-base) !important;
}

.text-orange-info::v-deep.v-chip--label {
    border-radius: 0px !important;
}

ul {
  list-style: none; /* Remove default bullets */
}

ul li::before {
  content: "●";
  font-size: 28px;
  color: var(--v-accent-base); /* Change the color */
  font-weight: bold; /* If you want it to be bold */
  display: inline-block; /* Needed to add space between the bullet and the text */
  width: 0.7em; /* Also needed for space (tweak if needed) */
  margin-left: -1rem; /* Also needed for space (tweak if needed) */
}

.text-trial {
  margin-top: 11px;
  position: absolute;
}
</style>
