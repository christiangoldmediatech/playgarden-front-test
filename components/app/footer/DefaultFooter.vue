<template>
  <v-footer class="text-center justify-center pg-app-footer" padless tile>
    <div class="green-line green-line-1" />
    <div class="green-line green-line-2" />

    <v-card flat tile width="100%" max-width="1200" class="card-infoPlaygarden">
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
                <v-row no-gutters class="logo-footer">
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
                  <a href="https://www.facebook.com/Playgardennyc">
                    <img
                      alt="Facebook"
                      class="clickable mr-1"
                      src="@/assets/svg/social-media/facebook.svg"
                    >
                  </a>

                  <a href="https://www.instagram.com/playgardenprep/">
                    <img
                      alt="Instagram"
                      class="clickable mx-1"
                      src="@/assets/svg/social-media/instagram.svg"
                    >
                  </a>

                  <a
                    href="mailto:online@playgardenprep.com"
                    class="clickable d-flex justify-center mx-1 social-media-circle circle-email"
                  >
                    <img
                      alt="Email"
                      src="@/assets/svg/social-media/email.svg"
                    >
                  </a>

                  <a href="https://twitter.com/playgardennyc">
                    <img
                      alt="Twitter"
                      class="clickable mx-1"
                      src="@/assets/svg/social-media/twitter.svg"
                    >
                  </a>
                </div>
              </v-container>
            </v-col>

            <v-col
              class="text-center"
              cols="12"
              sm="6"
              md="2"
            >
              <v-container fluid>
                <v-row>
                  <v-col cols="12">
                    <div class="center-info">
                      <span class="d-block link-text text-footer-contact">Playgarden Prep</span>
                      <span class="d-block link-text text-footer-contact">Terms & Conditions</span>
                      <span class="d-block link-text text-footer-contact">Privacy Policy</span>
                      <span class="d-block link-text text-footer-contact">Help</span>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>

            <v-col
              class="text-center"
              cols="12"
              sm="6"
              md="3"
            >
              <p class="font-weight-bold mb-1 mt-0 primary--text text-h5">
                <span class="info-footer-title">Upper East Side</span>
              </p>

              <p class="mb-1 text-footer-contact">
                ues@playgardenprep.com<br>
                212-965-9718
              </p>

              <p class="text-footer-contact">
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
              <p class="font-weight-bold mb-1 mt-0 primary--text text-h5 titleFooter">
                <span class="info-footer-title">Tribeca</span>
              </p>

              <p class="mb-1 text-footer-contact">
                tribeca@playgardenprep.com<br>
                212-965-9717
              </p>

              <p class="text-footer-contact">
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
          <v-col class="text-center text-footer" cols="12">
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

.text-footer {
  font-size: 11px;
  color: $pg-black !important;
  font-weight: 300;
}

.link-text {
  color: var(--v-black-base);
}

.card-infoPlaygarden {
  margin-top: 37px !important;
}

.logo-footer {
  margin-bottom: 15px !important;
}

.social-media-circle {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  margin-top: -5px;
  background-color: var(--v-primary-base);
}

.info-footer-title {
  color: #8ab591 !important;
}
@media only screen and (max-width: 600px) {
  .center-info {
    width: 50%;
    margin: auto;
  }
}

.center-info {
  text-align: left !important;
}

.text-footer-contact {
  font-weight: 500;
}
</style>
