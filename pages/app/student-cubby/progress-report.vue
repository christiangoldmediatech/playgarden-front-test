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
            {{ $t('studentCubby.progressReport.content') }}
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
