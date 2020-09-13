<template>
  <div class="dashboard-panel-container">
    <v-card class="dashboard-panel-card pt-0" height="100%">
      <div class="dashboard-panel-card-border-top" />
      <div class="lesson-day-row">
        <div class="lesson-day-outer">
          <div class="lesson-day-inner">
            <div class="lesson-day-circle">
              <span class="lesson-day-letter">
                {{ letter }}
              </span>

              <span class="lesson-day-number">
                DAY {{ day }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-panel-content pa-3 d-flex align-center">
        <div class="font-weight-bold text-center spaced-out">
          <slot />
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'BlankDashboardPanel',

  props: {
    letter: {
      type: String,
      required: true
    },

    day: {
      type: [Number, String],
      required: true
    }
  }
}
</script>

<style scoped>
.spaced-out {
  font-size: 24px !important;
  letter-spacing: 0.15em !important;
}
</style>
