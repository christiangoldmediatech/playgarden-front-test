<template>
  <v-container
    :class="{ 'dashboard-container': !$vuetify.breakpoint.smAndDown }"
    fluid
  >
    <v-row>
      <v-col cols="2">
        panel
      </v-col>
      <v-col cols="10">
        <graphics-panel />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GraphicsPanel from '@/components/admin/lessons-analytics/GraphicsPanel.vue'
export default {
  name: 'Dashboard',

  components: {
    GraphicsPanel
  },

  layout: 'admin',

  data: () => ({
    previewMode: false
  })
}
</script>
