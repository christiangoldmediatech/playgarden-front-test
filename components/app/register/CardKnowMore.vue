<template>
  <div>
    <v-divider class="mb-4" />
    <v-card-title primary-title>
      <v-btn block text @click="toggleCard">
        <div>
          <img src="@/assets/png/gift-icon.png" class="mr-2" width="18px">
          <template v-if="!$vuetify.breakpoint.smAndUp">
            <span class="free-trial-info">
              YOUR 15 DAY FREE TRIAL
            </span>
            <v-icon class="ml-4">
              mdi-chevron-up
            </v-icon>
            <br>
            <span class="free-trial-info">
              INCLUDES THE ONLINE PRESCHOOL PLAN
            </span>
          </template>
          <template v-else>
            <span class="free-trial-info">
              YOUR 15 DAY FREE TRIAL
            </span>
            <br>
            <span class="free-trial-info">
              INCLUDES THE ONLINE PRESCHOOL PLAN
            </span>
            <v-icon class="ml-2">
              mdi-chevron-up
            </v-icon>
          </template>
        </div>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <div>
        <center class="text-pay-information">
          <div :class="{ 'ml-4': !$vuetify.breakpoint.smAndUp }">
            <v-row>
              <span class="font-weight-bold ml-2 mt-4">That includes:</span>
            </v-row>
            <v-row class="mx-1 mb-8">
              <ul class="info-card">
                <li
                  v-for="benefit in benefits"
                  :key="benefit"
                  class="register-item text-left"
                >
                  <small class="text-trial">
                    {{ benefit }}
                  </small>
                </li>
              </ul>
            </v-row>
          </div>
          <v-row justify="center">
            <center v-if="$vuetify.breakpoint.smAndUp">
              <v-alert class="mt-4 info-much-more" color="red orange" dark>
                <span class="much-info">
                  AND MUCH MORE!!
                </span>
              </v-alert>
            </center>
            <div
              v-else
              class="justify-center"
              :class="{ 'mx-4': !$vuetify.breakpoint.smAndUp }"
            >
              <v-alert class="mt-8 info-much-more px-8" color="red orange" dark>
                <span class="much-info">
                  AND MUCH MORE!!
                </span>
              </v-alert>
            </div>
            <div class="mt-2">
              <span class="text-header-info">
                * You can cancel your membership any
                <br v-if="!$vuetify.breakpoint.smAndUp">time from the account
                settings.
              </span>
            </div>
          </v-row>
        </center>
      </div>
    </v-card-text>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

const benefits = [
  'Individualized Daily Lesson plans',
  '26 Weeks of video-based preschool for 45 minutes to 1 hour per day',
  'Hands-on worksheets with guidance from Certified Teachers',
  'Access to our Video Library with over 1,200 lessons, for hours of Edu-tainment!',
  'Access to our Music Library with custom, fun-filled children songs',
  'Access to our Library with thousands of video lessons',
  'Progress Reports sent to parents via email, and available in your Student Cubby',
  'Feedback from REAL teachers',
  'A Kids Corner, where kids can have fun learning on their own',
  'Family Membership for multiple students',
  'UNLIMITED Daily Live Classes',
  'Access to special events, experts, and webinars',
  'Playdates with friends to promote Social Interaction',
  'Home delivery of School Materials: a Playgarden Prep Backpack, specialized pencils, and workbooks as your little one progresses through their Daily Lessons'
]

export default defineComponent({
  name: 'CardKnowMore',

  setup(_, { emit }) {
    function toggleCard() {
      emit('toggleCard')
    }

    return { benefits, toggleCard }
  }
})
</script>

<style lang="scss" scoped>
ul.info-card {
  list-style: none; /* Remove default bullets */
}
ul.info-card li::before {
  content: '●';
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
  font-size: 17px !important;
  font-weight: bold !important;
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
  min-height: 32px !important;
}
</style>
