<template>
  <div>
    <v-card-title primary-title>
      <v-btn
        block
        text
        @click="toggleCard"
      >
        <div>
          <img
            src="@/assets/png/gift-icon.png"
            class="mr-2"
            width="18px"
          >
          <span class="free-trial-info">
            YOUR 30 DAY FREE TRIAL
          </span>
          <br />
          <template v-if="!$vuetify.breakpoint.smAndUp">
            <span class="free-trial-info">
              INCLUDES
            </span>
            <v-icon
              class="ml-4">
              mdi-chevron-up
            </v-icon>
            <br />
            <span class="free-trial-info">
              THE PREMIUM + PLAN
            </span>
          </template>
          <template v-else>
            <span class="free-trial-info">
              INCLUDES THE PREMIUM + PLAN
            </span>
          </template>
        </div>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <div class="text-mdi-monitor">
        <center class="text-pay-information">
          <div :class="{ 'ml-4': !$vuetify.breakpoint.smAndUp }">
            <v-row>
              <span class="font-weight-bold ml-2 mt-2">That includes:</span>
            </v-row>
            <v-row>
              <ul>
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
          </div>
          <v-row justify="center">
            <center v-if="$vuetify.breakpoint.smAndUp">
              <v-btn
                block
                class="mt-4 info-much-more"
              >
                <span class="much-info">
                  AND MUCH MORE!!
                </span>
              </v-btn>
            </center>
            <div v-else class="justify-center" :class="{ 'mx-4': !$vuetify.breakpoint.smAndUp }">
              <v-btn
                block
                class="mt-8 info-much-more px-8"
              >
                <span class="much-info">
                  AND MUCH MORE!!
                </span>
              </v-btn>
            </div>
            <div class="mt-2">
              <span
                class="text-header-info"
              >
                * You can cancel your membership any <br v-if="!$vuetify.breakpoint.smAndUp" />time from the account settings.
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
  name: 'CardInfo',

  data: vm => ({}),

  methods: {
    toggleCard () {
      if (!this.$vuetify.breakpoint.smAndUp) {
        this.$emit('toggleCard')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  list-style: none; /* Remove default bullets */
}
ul li::before {
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
}
.text-trial {
  margin-top: 14px;
  font-size: 14px !important;
  position: absolute;
}
.much-info {
  color: var(--v-accent-base);
}
.text-header-info {
  font-size: 14px !important;
}
.info-much-more {
  background-color: rgba(248, 152, 56, 0.3) !important;
}
</style>
