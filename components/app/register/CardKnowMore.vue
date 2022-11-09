<template>
  <div>
    <div
      :class="[
        'pg-relative',
        'pg-transition-shadow',
        'pg-flex',
        'pg-flex-col',
        'pg-py-6',
        'pg-px-8',
        'pg-rounded-lg',
        'pg-bg-white',
        'pg-max-w-[500px]',
        'lg:pg-px-10',
        'lg:pg-w-[550px]',
        {
          'pg-shadow-[0px_8px_24px_rgba(0,0,0,0.15)]': isOpen
        }
      ]"
    >
      <!-- ARROW -->
      <div class="pg-absolute pg-right-4 pg-top-4">
        <v-btn icon @click="$emit('input', !value)">
          <v-icon size="42">
            {{ isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
          </v-icon>
        </v-btn>
      </div>

      <!-- TITLE -->
      <div class="pg-text-center pg-mt-4">
        <div
          v-if="isOpen"
          class="pg-text-lg lg:pg-text-2xl pg-font-bold pg-text-pg-grey pg-opacity-80"
          :class="[
            'pg-flex',
            'pg-items-center',
            'lg:pg-items-start',
            'pg-text-lg',
            'lg:pg-text-2xl',
            'pg-font-bold',
            'pg-text-pg-grey',
            'pg-opacity-80'
          ]"
        >
          <img src="@/assets/svg/play-learn/gift-box.svg" class="pg-h-[26px]">
          <span class="pg-ml-1 lg:pg-ml-2">
            Your 15 Day Free Trial Includes:
          </span>
        </div>

        <div
          v-else
          class="pg-text-lg lg:pg-text-2xl pg-font-bold pg-text-pg-grey"
        >
          WANT TO KNOW MORE ABOUT YOUR
          <span class="pg-text-primary">FREE TRIAL</span>?
        </div>
      </div>

      <!-- TRIAL ITEMS -->
      <div
        :class="[
          'pg-mt-4',
          'pg-transition-[max-height]',
          'pg-overflow-hidden',
          'pg-duration-500',
          {
            'pg-max-h-[1000px]': isOpen,
            'pg-max-h-0': isClose
          }
        ]"
      >
        <div
          v-for="item in freeTrialItems"
          :key="item"
          class="pg-flex pg-items-center pg-py-1"
        >
          <img src="@/assets/svg/play-learn/ellipse.svg" class="pg-h-5">
          <span class="pg-ml-2 pg-text-base">
            {{ item }}
          </span>
        </div>

        <div class="pg-text-center pg-text-sm">
          *You can cancel your membership at any time from the Account Settings.
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'CardKnowMore',

  props: {
    value: {
      type: Boolean,
      default: true
    }
  },

  setup(props) {
    const isOpen = computed(() => props.value)
    const isClose = computed(() => !props.value)

    const freeTrialItems = [
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

    return {
      isOpen,
      isClose,
      freeTrialItems
    }
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
