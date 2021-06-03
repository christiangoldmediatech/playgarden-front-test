<template>
  <div>
    <v-card flat>
      <v-card-text>
        <div class="text-center">
          <!-- Section Title and Description -->
          <div v-if="!$vuetify.breakpoint.smAndDown" class="d-flex align-center justify-center">
            <img height="40px" src="@/assets/png/student-cubby/progress.png">
            <span class="ml-4 text-h4 text-md-h3">PROGRESS REPORT</span>
          </div>
          <div class="my-6 text-md-h6 text-body-1">
            Playgarden Prep Online Lessons have been developed to support one or more of the core areas of development.
            After watching a video, doing the worksheet together with an adult, or actively participating in a Live Class, parents will be helping in the development of their child in each of the specific areas.
          </div>
        </div>
        <dashboard />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Dashboard from '@/components/app/progress-report/Dashboard.vue'
export default {
  name: 'ProgressReport',

  components: {
    Dashboard
  }
}
</script>

<style lang="scss" scoped>
.progress-report {
  &-container {
    width: 100%;
  }
}
</style>
