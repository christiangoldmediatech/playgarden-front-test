<template>
  <v-container
    fluid
  >
    <v-row>
      <dashboard />
    </v-row>
  </v-container>
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
