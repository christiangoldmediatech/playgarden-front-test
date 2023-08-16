<template>
  <v-card
    class="dashboard-progress"
    :style="{
      '--lp-bar-1': dashboardProgressBar1Percentage,
      '--lp-bar-2': dashboardProgressBar2Percentage,
      '--lp-bar-radius': dashboardProgressBarRadius,
      '--lp-bar-border-width': dashboardProgressBarBorderWidth,
      '--lp-bar-border-type': dashboardProgressBorderType,
      '--lp-text-color': dashboardProgressTextColor
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
        ? 'You earned a puzzle piece'
        : 'Do the worksheet to Win a Puzzle Piece!'
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
    const dashboardProgressBarRadius = computed(() => {
      if (isProgressCompleted.value) {
        return '0'
      }

      return props.progress <= 95 ? '8px' : '0px'
    })

    const dashboardProgressBarBorderWidth = computed(() => props.progress === 0 ? '7px' : '4px')

    const dashboardProgressBorderType = computed(() =>
      props.progress === 0
        ? '0px 3px 8px rgba(0, 0, 0, 0.15)'
        : 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)'
    )

    const dashboardProgressTextColor = computed(() =>
      isProgressCompleted.value ? '#FFFFFF' : '#606060'
    )

    return {
      dashboardProgressBar1Percentage,
      dashboardProgressBar2Percentage,
      dashboardProgressBarRadius,
      dashboardProgressBorderType,
      dashboardProgressBarBorderWidth,
      dashboardProgressTextColor,
      lessonProgressMessage,
      isProgressCompleted
    }
  }
})
</script>

<style lang="scss" scoped>
.dashboard-progress {
  position: relative;
  display: flex;
  align-items: center;
  margin: 16px 12px;
  min-height:61px;
  box-shadow: var(--lp-bar-border-type) !important;
  border: var(--lp-bar-border-width) solid #C3C6FF;
  border-radius: 8px !important;

  &-icon {
    padding-left: 5%;
    padding-right: 5%;
    z-index: 1;
    img {
      margin-bottom: -5px;
    }
  }

  &-title {
    padding-right: 20%;
    z-index: 1;
    text-shadow: 1px 1px rgba(255, 255, 255, 0.75);
    color: var(--lp-text-color);
    font-weight: bold;
    font-size: 16px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    @media screen and (min-width: 768px) {
      font-size: 18px;
    }
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
    background-color:#C4C6FF;
    border-top-right-radius: var(--lp-bar-radius) !important;
    border-top-left-radius: 0 !important;
  }

  &-bar-2 {
    position: absolute;
    top: 50%;
    height: 50%;
    width: var(--lp-bar-2);
    background-color: #C4C6FF;
    border-top-right-radius: var(--lp-bar-radius) !important;
    border-bottom-right-radius: var(--lp-bar-radius) !important;
    border-bottom-left-radius: 0 !important;
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
