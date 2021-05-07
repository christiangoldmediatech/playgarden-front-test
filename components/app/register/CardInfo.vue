<template>
  <div>
    <div class="text-center text-button font-weight-bold mb-n4">
      <img
        src="@/assets/png/gift-icon.png"
        class="mr-2"
        width="18px"
      >
      <template>
        <span class="free-trial-info">
          YOUR 30 DAY FREE TRIAL
        </span>
        <br>
        <span class="free-trial-info">
          INCLUDES THE PREMIUM + PLAN
        </span>
      </template>
    </div>
    <v-card-text>
      <div>
        <center>
          <v-row>
            <span class="font-weight-bold ml-2 mt-2">That includes:</span>
          </v-row>
          <v-row>
            <ul class="info-card">
              <li
                class="register-item text-left"
              >
                <small class="text-trial">
                  A Daily Learning Schedule
                </small>
              </li>
              <li
                class="register-item text-left"
              >
                <small class="text-trial">
                  Access to over 1,200 lessons
                </small>
              </li>
              <li
                class="register-item text-left"
              >
                <small class="text-trial">
                  Live Classes with Playgarden Prep Teachers
                </small>
              </li>
              <li
                class="register-item text-left"
              >
                <small class="text-trial">
                  Workbooks delivered to your home
                </small>
              </li>
              <li
                class="register-item text-left"
              >
                <small class="text-trial">
                  Educational Playdates
                </small>
              </li>
            </ul>
          </v-row>
          <v-row justify="center">
            <center v-if="$vuetify.breakpoint.smAndUp">
              <v-alert
                class="mt-4 info-much-more"
                color="red orange"
                dark
              >
                <span class="mp-2 much-info">
                  AND MUCH MORE!!
                </span>
              </v-alert>
            </center>
            <div v-else class="justify-center mx-4 mx-sm-0">
              <v-alert
                class="mt-8 info-much-more px-8"
                color="red orange"
                dark
              >
                <span class="mp-2 much-info">
                  AND MUCH MORE!!
                </span>
              </v-alert>
            </div>
            <div class="mt-2">
              <span
                class="text-header-info"
              >
                * You can cancel your membership any <br class="d-block d-sm-none">time from the account settings.
              </span>
            </div>
          </v-row>
        </center>
      </div>
    </v-card-text>
  </div>
</template>

<script>

export default {
  name: 'CardInfo'
}
</script>

<style lang="scss" scoped>
ul.info-card {
  list-style: none; /* Remove default bullets */
}
ul.info-card li::before {
  content: "●";
  font-size: 24px !important;
  color: var(--v-accent-base); /* Change the color */
  font-weight: bold; /* If you want it to be bold */
  display: inline-block; /* Needed to add space between the bullet and the text */
  width: 0.7em; /* Also needed for space (tweak if needed) */
  margin-left: -1rem; /* Also needed for space (tweak if needed) */
  margin-top: 10px;
}
.free-trial-info {
  font-size: 18px;
  color: #606060;
}
.text-trial {
  margin-top: 14px;
  font-size: 14px !important;
  position: absolute;
}
.much-info {
  color: var(--v-accent-base);
  font-size: 17px !important;;
  font-weight: bold !important;;
}
.text-header-info {
  font-size: 14px !important;
}
.info-much-more {
  background-color: rgba(248, 152, 56, 0.3) !important;
  min-height: 32px !important;
}
</style>
