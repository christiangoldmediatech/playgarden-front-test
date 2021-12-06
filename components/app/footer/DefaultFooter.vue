<template>
  <v-footer class="text-center justify-center white" padless tile>
    <div class="green-line green-line-1" />
    <div class="green-line green-line-2" />

    <v-card
      flat
      tile
      class="pt-6 footer-wrapper-card"
    >
      <v-card-text class="py-0">
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <nuxt-link
              :to="{
                name: 'app-virtual-preschool',
              }"
            >
              <v-img
                alt="Playgarden Prep's Logo"
                class="mb-3"
                contain
                :max-width="$vuetify.breakpoint.smAndUp ? '400' : '100%'"
                :src="require('~/assets/svg/logo.svg')"
              />
            </nuxt-link>

            <div class="align-center d-flex justify-center justify-md-start">
              <a target="_blank" href="https://www.facebook.com/Playgarden-Online-108368577679635">
                <img
                  alt="Facebook"
                  class="clickable mr-1"
                  src="@/assets/svg/social-media/facebook.svg"
                >
              </a>

              <a
                target="_blank"
                href="https://www.instagram.com/playgardenprep/"
              >
                <img
                  alt="Instagram"
                  class="clickable mx-1"
                  src="@/assets/svg/social-media/instagram.svg"
                >
              </a>

              <a
                target="_blank"
                href="mailto:online@playgardenprep.com"
                class="clickable d-flex justify-center mx-1 social-media-circle circle-email"
              >
                <img alt="Email" src="@/assets/svg/social-media/email.svg">
              </a>

              <a target="_blank" href="https://twitter.com/playgarden_prep">
                <img
                  alt="Twitter"
                  class="clickable mx-1"
                  src="@/assets/svg/social-media/twitter.svg"
                >
              </a>
            </div>
          </v-col>

          <v-col class="text-center" cols="12" sm="6" md="">
            <v-row
              no-gutters
              justify="center"
              align="start"
              class="footer-ref-links"
            >
              <v-col>
                <a
                  class="d-block link-text mb-1 mt-1"
                  target="_blank"
                  href="https://playgardenprep.com/"
                >Playgarden Prep</a>

                <nuxt-link
                  class="d-block link-text mb-1"
                  :to="{ name: 'terms-conditions' }"
                  v-text="'Terms of Use'"
                />

                <nuxt-link
                  class="d-block link-text mb-1"
                  :to="{ name: 'privacy-policy' }"
                  v-text="'Privacy Policy'"
                />

                <nuxt-link
                  class="d-block link-text mb-2"
                  :to="{ name: 'help' }"
                  v-text="'Help'"
                />
              </v-col>
            </v-row>
          </v-col>

          <v-col class="text-center" cols="12" sm="4" md="">
            <p class="font-weight-bold mb-1 mt-0 primary--text text-h5">
              <span class="info-footer-title">Online School</span>
            </p>

            <p class="text-footer-contact">
              <a href="mailto:hello@playgardenprep.com">hello@playgardenprep.com</a><br>
              <a href="tel:646-504-4716">646-504-4716</a>
            </p>

            <p class="text-footer-contact">
              95 Franklin St,<br>
              New York, NY 10013
            </p>
            <br>
          </v-col>

          <v-col class="text-center" cols="12" sm="4" md="">
            <p class="font-weight-bold mb-1 mt-0 primary--text text-h5">
              <span class="info-footer-title">Upper East Side</span>
            </p>

            <p class="mb-1 mt-2 mt-md-8 text-footer-contact" />

            <p class="text-footer-contact">
              1366 Madison Avenue<br>
              New York, NY 10128
            </p>
            <br>
          </v-col>

          <v-col class="text-center" cols="12" sm="4" md="">
            <p class="font-weight-bold mb-1 mt-0 primary--text text-h5">
              <span class="info-footer-title">
                Tribeca
              </span>
            </p>

            <p class="mb-1 mt-2 mt-md-8 text-footer-contact" />

            <p class="text-footer-contact">
              95 Franklin Street<br>
              New York, NY 10013
            </p>
            <br>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider class="mx-sm-8 mx-md-16" />

      <v-row no-gutters>
        <v-col class="pa-3 text-center text-footer" cols="12">
          2020

          <template v-if="new Date().getFullYear() > 2020">
            - {{ new Date().getFullYear() }}
          </template>

          &copy; Playgarden Prep. All rights reserved.
        </v-col>
      </v-row>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: 'DefaultFooter',

  props: {
    fullWidth: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.footer-wrapper-card {
  width: 100%;
  max-width: 1200px;
  &.full-width {
    max-width: 1600px;
  }
}
.text-footer {
  font-size: 11px;
  font-weight: 300;
}

.link-text {
  color: var(--v-black-base);
}

.social-media-circle {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  margin-top: -5px;
  background-color: var(--v-primary-base);
}

.info-footer-title {
  color: #68C453 !important;
}

.footer-ref-links {
  height: 100%;
}
</style>
