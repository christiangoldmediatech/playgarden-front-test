<template>
  <div>
    <v-card-title primary-title>
      <v-btn
        block
        text
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
          <span class="free-trial-info">
            INCLUDES THE PREMIUM + PLAN
          </span>
        </div>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <div>
        <center class="text-pay-information">
          <div :class="{ 'ml-4': !$vuetify.breakpoint.smAndUp }">
            <v-row>
              <span class="font-weight-bold ml-2">That includes:</span>
            </v-row>
            <v-row class="mx-1">
              <ul>
                <li
                  class="register-item text-left"
                >
                  <small class="text-trial">
                    Individualized Daily Lessons plan
                  </small>
                </li>
                <li
                  class="register-item text-left"
                >
                  <small class="text-trial">
                    26 Weeks of 1 hour of video-based preschool per day
                  </small>
                </li>
                <li
                  class="register-item text-left"
                >
                  <small class="text-trial">
                    Hands-on worksheets taught by Certified Teachers
                  </small>
                </li>
                <li
                  class="register-item text-left"
                >
                  <small class="text-trial">
                    Access to a Library with over 1,200 lessons for hour of Eduatainment
                  </small>
                </li>
                <li
                  class="register-item text-left"
                >
                  <small class="text-trial">
                    Progress Reports sent to parents
                  </small>
                </li>
                <li
                  class="register-item text-left"
                >
                  <small class="text-trial">
                    Familiy Membership for multiple students
                  </small>
                </li>
                <li
                  class="register-item text-left"
                >
                  <small class="text-trial">
                    Home deliver of school materials: Backpack, specialized pencils, Workbooks
                  </small>
                </li>
                <li
                  class="register-item text-left"
                >
                  <small class="text-trial">
                    Daily Live Classes with Playgarden Prep teachers
                  </small>
                </li>
                <li
                  class="register-item text-left"
                >
                  <small class="text-trial">
                    Access to special events, such as weekly Cooking Classes
                  </small>
                </li>
                <li
                  class="register-item text-left"
                >
                  <small class="text-trial">
                    Playdates with friends, moderated by our specialist to promote Social Interaction
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
                * your can cancel you membership any <br v-if="!$vuetify.breakpoint.smAndUp" />time from the account settings.
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
  name: 'CardKnowMore',

  data: vm => ({}),

  methods: {
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
  width: 0.6em; /* Also needed for space (tweak if needed) */
  margin-left: -1rem; /* Also needed for space (tweak if needed) */
  margin-top: 10px;
}
.free-trial-info {
  font-size: 18px;
}
.text-trial {
  margin-top: 14px;
  padding-right: 10px;
  font-size: 14px !important;
}
.much-info {
  color: var(--v-accent-base);
}
.list-know {
  height: 100px;
  overflow-y: scroll;
}
.text-header-info {
  font-size: 14px !important;
}
.info-much-more {
  background-color: rgba(248, 152, 56, 0.3) !important;
}
</style>
