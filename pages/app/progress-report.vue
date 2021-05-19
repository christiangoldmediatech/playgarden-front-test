<template>
  <v-container
    fluid
  >
    <v-row>
      <v-col cols="12">
        <dashboard />
      </v-col>
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
