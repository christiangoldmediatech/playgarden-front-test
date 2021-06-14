<template>
  <v-container>
    <dashboard />
  </v-container>
</template>

<script>
import Dashboard from '@/components/admin/worksheets-analytics/Dashboard.vue'
export default {
  name: 'Index',

  components: {
    Dashboard
  },

  layout: 'admin'
}
</script>
