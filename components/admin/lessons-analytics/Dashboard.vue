<template>
  <v-container
    :class="{ 'dashboard-container': !$vuetify.breakpoint.smAndDown }"
    fluid
  >
    <v-row>
      <v-col cols="2">
        <!-- <dashboard-panel
          v-bind="{ lesson, childId, loading }"
          :next-button="canAdvance"
        /> -->
        panel two
      </v-col>
      <v-col cols="12">
        <graphics-panel />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GraphicsPanel from '@/components/admin/lessons-analytics/GraphicsPanel.vue'
// import DashboardPanel from '@/components/app/dashboard/DashboardPanel.vue'
export default {
  name: 'Dashboard',

  components: {
    GraphicsPanel
    // DashboardPanel
  },

  layout: 'admin',

  data: () => ({
    lesson: 1,
    childId: 47,
    loading: false
  })
}
</script>
