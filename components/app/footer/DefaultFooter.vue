<template>
  <v-footer class="text-center justify-center pg-app-footer" padless tile>
    <div class="green-line green-line-1" />
    <div class="green-line green-line-2" />

    <v-card flat tile width="100%" max-width="1200">
      <v-card-text class="py-0">
        <v-container fluid py-0>
          <v-row>
            <v-col
              class="text-center text-md-left"
              cols="12"
              sm="6"
              md="4"
            >
              <v-container py-0>
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-img
                      alt="Playgarden Prep's Logo"
                      class="mb-1 mt-0"
                      contain
                      :src="require('~/assets/svg/logo.svg')"
                    />
                  </v-col>
                </v-row>

                <div
                  class="align-center d-flex justify-center justify-md-start"
                >
                  <img
                    alt="Facebook"
                    class="clickable mr-1"
                    src="@/assets/svg/social-media/facebook.svg"
                  >

                  <img
                    alt="Instagram"
                    class="clickable mx-1"
                    src="@/assets/svg/social-media/instagram.svg"
                  >

                  <div
                    class="clickable d-flex justify-center mx-1 social-media-circle"
                  >
                    <img
                      alt="Email"
                      src="@/assets/svg/social-media/email.svg"
                    >
                  </div>

                  <img
                    alt="Twitter"
                    class="clickable mx-1"
                    src="@/assets/svg/social-media/twitter.svg"
                  >
                </div>
              </v-container>
            </v-col>

            <v-col
              class="text-center text-md-left"
              cols="12"
              sm="6"
              md="2"
            >
              <v-container>
                <nuxt-link
                  class="d-block link-text"
                  :to="{ name: 'index' }"
                  v-text="'Playgarden Prep'"
                />

                <nuxt-link
                  class="d-block link-text"
                  :to="{ name: 'terms-conditions' }"
                  v-text="'Terms & Conditions'"
                />

                <nuxt-link
                  class="d-block link-text"
                  :to="{ name: 'privacy-policy' }"
                  v-text="'Privacy Policy'"
                />

                <nuxt-link
                  class="d-block link-text"
                  :to="{ name: 'index' }"
                  v-text="'Help'"
                />
              </v-container>
            </v-col>

            <v-col
              class="text-center"
              cols="12"
              sm="6"
              md="3"
            >
              <p class="font-weight-bold mb-1 mt-0 primary--text text-h5">
                Upper East Side
              </p>

              <p class="font-weight-bold mb-1">
                ues@playgardenprep.com<br>
                212-965-9718
              </p>

              <p>
                1366 Madison Avenue<br>
                New York, NY 10128
              </p>
            </v-col>

            <v-col
              class="text-center"
              cols="12"
              sm="6"
              md="3"
            >
              <p class="font-weight-bold mb-1 mt-0 primary--text text-h5">
                Tribeca
              </p>

              <p class="font-weight-bold mb-1">
                tribeca@playgardenprep.com<br>
                212-965-9717
              </p>

              <p>
                95 Franklin Street<br>
                New York, NY 10013
              </p>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider class="mx-sm-8 mx-md-16" />

      <v-container py-0>
        <v-row>
          <v-col class="text-center" cols="12">
            2020
            <template v-if="new Date().getFullYear() > 2020">
              - {{ new Date().getFullYear() }}
            </template>

            &copy; Playgarden Prep. All rights reserved.
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: 'DefaultFooter'
}
</script>

<style lang="scss" scoped>
.pg-app-footer {
  background-color: $pg-white !important;
  color: $pg-black !important;
}

.link-text {
  color: var(--v-black-base);
}

.social-media-circle {
  width: 47px;
  height: 47px;
  border-radius: 50%;
  background-color: var(--v-primary-base);
}
</style>
