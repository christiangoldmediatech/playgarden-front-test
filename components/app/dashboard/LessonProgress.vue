<template>
  <v-card
    class="dashboard-progress"
    :style="{
      '--lp-bar-1': dashboardProgressBar1Percentage,
      '--lp-bar-2': dashboardProgressBar2Percentage,
      '--lp-bar-radius': dashboardProgressBarRadius,
      '--lp-bar-border-type': dashboardProgressBorderType
    }"
  >
    <div class="dashboard-progress-bar-1" />

    <div class="dashboard-progress-icon">
      <img
        src="@/assets/png/dashboard/lesson-section-progress.png"
        size="20px"
      >
    </div>

    <div
      data-test-id="lesson-progress-message"
      class="dashboard-progress-title"
    >
      {{ lessonProgressMessage }}
    </div>

    <!-- Lesson completed medal -->
    <div v-if="isProgressCompleted" class="dashboard-progress-tasks">
      <img
        data-test-id="lesson-progress-medal"
        class="dashboard-progress-tasks-image"
        src="@/assets/png/dashboard/progress-medal.png"
      >
    </div>

    <!-- Counter for worksheets completed -->
    <div v-else-if="isWorksheetProgress" class="dashboard-progress-tasks">
      <div
        data-test-id="lesson-progress-worksheets"
        class="dashboard-progress-tasks-remaining"
      >
        {{ `${totalCompletedWorksheets}/${totalWorksheets}` }}
      </div>
      <div class="dashboard-progress-tasks-text">
        Worksheets
      </div>
    </div>

    <div class="dashboard-progress-bar-2" />
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    progress: {
      type: Number,
      default: 0
    },

    isWorksheetProgress: {
      type: Boolean,
      default: false
    },

    totalCompletedWorksheets: {
      type: Number,
      default: 0
    },

    totalWorksheets: {
      type: Number,
      default: 0
    }
  },

  setup (props) {
    const isProgressCompleted = computed(() => props.progress === 100)

    const lessonProgressMessage = computed(() =>
      isProgressCompleted.value
        ? 'You won a puzzle piece'
        : 'Win a puzzle piece!'
    )

    const dashboardProgressBar1Percentage = computed(() => `${props.progress}%`)

    // we do not want any difference in bar distance at 0% or above 95%. At 0% only the second one will be visible
    // and above 95% the second bar will overflow.
    const barsDifference = computed(() =>
      props.progress > 95 || props.progress === 0 ? 0 : 5
    )

    const dashboardProgressBar2Percentage = computed(
      () => `${props.progress + barsDifference.value}%`
    )

    // we want the bottom bar to have a soft top border unless they have the same width.
    const dashboardProgressBarRadius = computed(() =>
      props.progress <= 95 ? '8px' : undefined
    )

    const dashboardProgressBorderType = computed(() =>
      props.progress === 0
        ? '0px 3px 8px rgba(0, 0, 0, 0.15)'
        : 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)'
    )

    return {
      dashboardProgressBar1Percentage,
      dashboardProgressBar2Percentage,
      dashboardProgressBarRadius,
      dashboardProgressBorderType,
      lessonProgressMessage,
      isProgressCompleted
    }
  }
})
</script>

<style lang="scss" scoped>
.dashboard-progress {
  position: relative;
  margin: 16px 12px;
  height: 42px;
  box-shadow: var(--lp-bar-border-type) !important;
  border-radius: 8px !important;

  &-icon {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(10%, -35%);
    z-index: 1;
  }

  &-title {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(25%, -50%);
    z-index: 1;
    text-shadow: 1px 1px rgba(255, 255, 255, 0.75);
    color: #707070;
    font-weight: bold;
    font-size: 18px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  &-tasks {
    position: absolute;
    top: 50%;
    right: 3%;
    transform: translate(0%, -50%);
    z-index: 1;
    letter-spacing: 1.5px;
    color: #707070;

    &-remaining {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
    }

    &-text {
      font-size: 12px;
    }
  }

  &-bar-1 {
    position: absolute;
    top: 0;
    height: 50%;
    width: var(--lp-bar-1);
    background-color: var(--v-accent-base);
  }

  &-bar-2 {
    position: absolute;
    top: 50%;
    height: 50%;
    width: var(--lp-bar-2);
    background-color: var(--v-accent-base);
    border-top-right-radius: var(--lp-bar-radius) !important;
  }
}

@media (max-width: $breakpoint-xs) {
  .dashboard-progress {
    &-title {
      font-size: 12px;
    }

    &-tasks {
      &-image {
        height: 20px;
      }

      &-remaining {
        font-size: 12px;
      }

      &-text {
        font-size: 9px;
      }
    }
  }
}
</style>