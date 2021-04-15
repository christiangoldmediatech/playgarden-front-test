<template>
  <v-row no-gutters>
    <v-col
      cols="12"
      md="6"
      xs="12"
      class="d-flex flex-row-reverse"
    >
      <div class="mr-n5">
        <v-img
          v-if="$vuetify.breakpoint.smAndUp"
          max-width="450"
          :src="require('@/assets/svg/child-inactive.svg')"
        />
      </div>
    </v-col>
    <v-col
      cols="12"
      md="6"
      xs="12"
      class="my-2 mb-5"
    >
      <v-card
        class="full-height"
        :class="{ 'pt-6': $vuetify.breakpoint.smAndUp }"
      >
        <v-card-text>
          <p
            class="font-weight-bold mb-6 pg-letter-spacing text-center text-h5 text-md-left"
          >
            <underlined-title class="text-h6 text-md-h4" text="IT SEEMS THAT YOUR ACCOUNT IS INACTIVE" />
          </p>

          <p class="text-justify text-h6 mt-12">
            Hi, <b>{{ fullName }}</b>
          </p>

          <p class="text-justify text-h6 mt-12">
            The account linked to this email <b>{{ getEmail }}</b> seems to be deactivated, this may be due to non-payment, or its cancellation previously.
            You can activate your account again by clicking on the following button
          </p>

          <v-row class="mt-8" justify="center">
            <v-col class="text-center" cols="12" xs="12" md="4">
              <v-btn
                class="text-transform-none mr-3"
                color="accent"
                dark
                :large="$vuetify.breakpoint.mdAndUp"
                nuxt
                :small="$vuetify.breakpoint.smAndDown"
                @click="createMembership"
              >
                <template>
                  Activate account
                </template>
              </v-btn>
            </v-col>
            <v-col class="text-center">
              <v-row :class="(!$vuetify.breakpoint.smAndDown) ? 'ml-4 mt-n2' : 'no-gutters'">
                <v-col cols="12" sm="12" md="6" class="text-center">
                  <p class="text-h6">
                    It is a mistake?
                  </p>
                </v-col>
                <v-col cols="12" sm="12" md="6" class="text-center">
                  <p class="text-h6" :class="(!$vuetify.breakpoint.smAndDown) ? 'ml-n14' : ''">
                    <nuxt-link
                      class="d-block link-text contact"
                      :to="{ name: 'help' }"
                      v-text="'Contact Us'"
                    />
                  </p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'InactiveSubscription',

  components: {},

  data: vm => ({}),

  computed: {
    ...mapGetters('auth', {
      userInfo: 'getUserInfo'
    }),

    fullName () {
      return this.userInfo.fullName // `${this.userInfo.firstName ?? ''} ${this.userInfo.lastName ?? ''}`.trim()
    },

    getEmail () {
      return this.userInfo.email // `${this.userInfo.firstName ?? ''} ${this.userInfo.lastName ?? ''}`.trim()
    }
  },

  created () {},

  methods: {
    createMembership () {
      this.$router.push({
        name: 'app-payment',
        query: { process: 'signup', step: '2' },
        params: { mode: 'activate-user' }
      })
    },
    goHelp () {
      this.$router.push({
        name: 'help'
      })
    }
  }
}
</script>

<style>
.contact {
  color: var(--v-accent-base) !important;
  text-decoration: underline !important;
  font-weight: bold !important;
}
</style>
