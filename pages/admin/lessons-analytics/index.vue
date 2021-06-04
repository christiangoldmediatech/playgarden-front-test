<template>
  <v-main class="bkg">
    <v-container fluid fill-height>
      <dashboard />
    </v-container>
  </v-main>
</template>

<script>
import Dashboard from '@/components/admin/lessons-analytics/Dashboard.vue'
export default {
  name: 'Index',

  components: {
    Dashboard
  },

  layout: 'admin',

  data: () => ({
    previewMode: false
  })
}
</script>
