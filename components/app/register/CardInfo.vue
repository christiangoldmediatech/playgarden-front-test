<template>
  <div>
    <v-card-title primary-title>
      <v-btn
        block
        text
        @click="changeShowDetail"
      >
        <img
          src="@/assets/png/gift-icon.png"
          class="mr-2"
          width="18px"
        >
        <span class="free-trial-info">
          GET 30 DAYS OF FREE TRIAL
        </span>
        <v-icon v-if="showDetailFreeTrial" class="hidden-md-only hidden-lg-only">
          mdi-menu-down
        </v-icon>
        <v-icon v-else class="hidden-md-only hidden-lg-only">
          mdi-menu-up
        </v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <div v-if="!showDetailFreeTrial" class="text-mdi-monitor">
        <center class="text-pay-information">
          <div>
            <v-row>
              <span class="font-weight-bold ml-2">That includes:</span>
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
            <v-btn
              v-else
              block
              class="mt-8 info-much-more px-8"
            >
              <span class="much-info">
                AND MUCH MORE!!
              </span>
            </v-btn>
            <span
              class="mt-2 text-header-info"
            >
              *You can cancel you membership any time from the account settings.
            </span>
          </v-row>
        </center>
      </div>
    </v-card-text>
  </div>
</template>

<script>

export default {
  name: 'CardInfo',

  data: vm => ({})
}
</script>
