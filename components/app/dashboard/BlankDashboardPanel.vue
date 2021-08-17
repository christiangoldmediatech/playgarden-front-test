<template>
  <div class="lesson-panel-container">
    <v-card class="lesson-panel-card pt-0" height="100%">
      <div class="lesson-panel-card-border-top">
        <slot name="panel-toolbar" />
      </div>

      <pg-circle-letter-day :day="day" :letter="letter" />

      <div class="lesson-panel-content pa-3 d-flex align-center">
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
