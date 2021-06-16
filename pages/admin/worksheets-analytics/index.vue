<template>
  <v-container>
    <dashboard />
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import Dashboard from '@/components/admin/worksheets-analytics/Dashboard.vue'

export default defineComponent({
  name: 'Index',

  components: {
    Dashboard
  },

  layout: 'admin'
})
</script>
