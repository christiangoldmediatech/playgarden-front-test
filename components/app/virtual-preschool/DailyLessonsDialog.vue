<template>
  <v-dialog v-model="dialog" width="800" height="400">
    <div class="green-line green-line-1" />
    <div class="green-line green-line-2" />
    <v-card width="800" tile>
      <div class="pg-flex pg-gap-2 pg-relative">
        <!-- Image -->
        <img
          v-if="$vuetify.breakpoint.smAndUp"
          src="@/assets/jpg/daily-lessons-popup.jpg"
          alt="Daily Lessons"
        >

        <!-- Close -->
        <div class="pg-absolute pg-right-1 pg-top-1">
          <v-btn icon large @click="dialog = false">
            <v-icon large>
              mdi-close
            </v-icon>
          </v-btn>
        </div>

        <div
          class="black--text pg-flex pg-flex-col pg-gap-2 pg-justify-center pg-p-6"
        >
          <div
            class="pg-flex pg-flex-col sm:pg-flex-row pg-items-center pg-gap-4"
          >
            <!-- Title -->
            <img src="@/assets/svg/rocket.svg" alt="Daily Lessons">
            <span
              class="pg-text-3xl pg-uppercase pg-font-bold pg-text-center sm:pg-text-left"
            >
              Daily Lessons
            </span>
          </div>
          <p
            class="pg-text-lg pg-leading-7 pg-font-semibold pg-text-center sm:pg-text-left"
          >
            With the Play and learn plan you will only have access to the
            introduction day of the daily lessons.
          </p>

          <!-- Buttons -->
          <v-btn color="primary" :to="{ name: 'app-dashboard' }" nuxt>
            Start intro day
          </v-btn>
          <v-btn
            text
            color="accent"
            class="text-decoration-underline"
            nuxt
            link
            to="/app/payment/plan"
          >
            Upgrade your Plan
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'DailyLessonsDialog',
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit }) {
    const dialog = computed<boolean>({
      get() {
        return props.value
      },
      set(value) {
        emit('input', value)
      }
    })

    return { dialog }
  }
})
</script>
