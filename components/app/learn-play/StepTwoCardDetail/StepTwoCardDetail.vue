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
  name: 'StepTwoCardDetail',

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
      'Video lessons from our Certified Teachers',
      'Do-it-yourself activities, games, and art projects',
      'Snack recipes and how-to videos',
      'Book recommendations with videos to read along',
      'Curated Playlists to supplement learning, or just have fun!',
      'Access to our Library with thousands of video lessons',
      'A Kids Corner, where kids can have fun learning on their own',
      'Weekend Zooms with our Playgarden Prep teachers',
      'Well-being podcasts, blogs, and webinars',
      'Family membership for multiple students and caregivers'
    ]

    return {
      isOpen,
      isClose,
      freeTrialItems
    }
  }
})
</script>
