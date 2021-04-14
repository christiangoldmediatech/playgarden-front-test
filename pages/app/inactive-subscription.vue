<template>
  <v-row>
    <v-col cols="12">
      <v-row>
        <v-col>
          <v-row
            no-glutters
            class="flex-column flex-md-row"
            justify="center"
          >
            <v-col
              cols="12"
              md="6"
            >
              <v-img
                v-if="$vuetify.breakpoint.smAndUp"
                max-width="650"
                :src="require('@/assets/svg/child-inactive.svg')"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
              xs="12"
              class="my-4 pl-5"
            >
              <v-card
                class="full-height pt-12"
              >
                <v-card-text class="pt-12">
                  <p
                    class="font-weight-bold mb-6 pg-letter-spacing text-center text-h5 text-md-left"
                  >
                    <underlined-title class="text-h6 text-md-h4" text="IT SEEMS THAT YOUR ACCOUNT IS INACTIVE" />
                  </p>

                  <p class="text-justify text-h6 mt-12">
                    The account linked to this email <b>user@mail.com</b> seems to be deactivated, this may be due to non-payment, or its cancellation previously.
                    You can activate your account again by clicking on the following button
                  </p>

                  <v-row class="mt-8">
                    <v-col cols="4">
                      <v-btn
                        class="text-transform-none mr-3"
                        color="accent"
                        dark
                        :fab="$vuetify.breakpoint.smAndDown"
                        :large="$vuetify.breakpoint.mdAndUp"
                        nuxt
                        :small="$vuetify.breakpoint.smAndDown"
                      >
                        <template v-if="$vuetify.breakpoint.mdAndUp">
                          Activate account
                        </template>

                        <v-icon v-else>
                          mdi-plus
                        </v-icon>
                      </v-btn>
                    </v-col>
                    <v-col class="ml-4">
                      <p class="mt-2 text-h6">
                        It is a mistake? <span color="accent" class="contact">Contact Us</span>
                      </p>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>

export default {
  name: 'InactiveSubscription',

  components: {},

  data: vm => ({}),

  computed: {},

  created () {},

  methods: {}
}
</script>

<style>
.contact {
  color: var(--v-accent-base) !important;
  text-decoration: underline !important;
  font-weight: bold !important;
}
</style>
