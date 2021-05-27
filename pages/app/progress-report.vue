<template>
  <v-main :class="{ 'fill-height': $vuetify.breakpoint.mdAndUp }">
    <v-container fluid class="progress-report-container ma-0 pa-0" :class="{ 'fill-height': $vuetify.breakpoint.mdAndUp }">
      <dashboard />
    </v-container>
  </v-main>
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
