<template>
  <v-row no-gutters justify="center">
    <v-col
      md="4"
      xs="12"
      class="d-flex flex-row-reverse"
    >
      <div class="mr-n5">
        <v-img
          v-if="$vuetify.breakpoint.smAndUp"
          max-width="410"
          :src="require('@/assets/svg/child-inactive.svg')"
        />
      </div>
    </v-col>
    <v-col
      cols="12"
      md="4"
      xs="12"
      class="my-2 mb-4"
    >
      <v-card
        class="full-height"
        :class="{ 'pt-6': $vuetify.breakpoint.smAndUp }"
      >
        <v-card-text>
          <p
            class="font-weight-bold mb-6 pg-letter-spacing text-center text-h5 text-md-left"
          >
            <underlined-title class="text-h6 text-md-h5" text="IT SEEMS THAT YOUR ACCOUNT IS INACTIVE" />
          </p>

          <p class="text-justify mt-6">
            Hi <b>{{ fullName }}</b>,
          </p>

          <p class="text-justify">
            The account linked to this email <b>{{ getEmail }}</b> seems to be deactivated, this may be due to non-payment, or because it was cancelled previously.
            You can activate your account again by clicking on the following button.
          </p>

          <v-row no-gutters class="mt-7" justify="center">
            <v-col class="text-center" cols="12" md="12">
              <v-btn
                class="white--text text-transform-none mb-3"
                color="accent"
                :block="isMobile"
                @click="createMembership"
              >
                <template>
                  Activate account
                </template>
              </v-btn>
            </v-col>
            <v-col class="text-center pb-5 mt-5" cols="12" md="12">
              <v-divider />
            </v-col>
            <v-col class="text-center">
              <v-row :class="(!$vuetify.breakpoint.smAndDown) ? '' : 'no-gutters'">
                <v-col class="text-center">
                  <p>
                    It this is a mistake?
                    <a
                      class="d-block link-text contact accent--text"
                      @click="showContactUsModal"
                    >
                      Contact Us
                    </a>
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

<script lang="ts">
import { useGlobalModal } from '@/composables'
import { defineComponent, useStore } from '@nuxtjs/composition-api'
import { mapGetters } from 'vuex'
import { TypedStore } from '@/models'

export default defineComponent({
  name: 'InactiveSubscription',

  components: {},

  setup () {
    const store = useStore<TypedStore>()
    const { showContactUsModal } = useGlobalModal({ store })

    return {
      showContactUsModal
    }
  },

  data: vm => ({}),

  computed: {
    ...mapGetters('auth', {
      userInfo: 'getUserInfo'
    }),

    fullName () {
      // @ts-ignore
      return this.userInfo.fullName // `${this.userInfo.firstName ?? ''} ${this.userInfo.lastName ?? ''}`.trim()
    },

    getEmail () {
      // @ts-ignore
      return this.userInfo.email // `${this.userInfo.firstName ?? ''} ${this.userInfo.lastName ?? ''}`.trim()
    }
  },

  created () {},

  methods: {
    createMembership () {
      this.$router.push({
        name: 'app-payment',
        params: { mode: 'activate-user' }
      })
    },
    goHelp () {
      this.$router.push({
        name: 'help'
      })
    }
  }
})
</script>

<style>
.contact {
  color: var(--v-accent-base) !important;
  text-decoration: underline !important;
  font-weight: bold !important;
}
</style>
