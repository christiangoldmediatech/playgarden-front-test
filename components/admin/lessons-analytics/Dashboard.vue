<template>
  <v-container
    :class="{ 'dashboard-container': !$vuetify.breakpoint.smAndDown }"
    fluid
  >
    <v-row>
      <v-col cols="12">
        <videos-lesson />
      </v-col>
      <v-col cols="12">
        <graphics-panel />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GraphicsPanel from '@/components/admin/lessons-analytics/GraphicsPanel.vue'
import VideosLesson from '@/components/admin/lessons-analytics/VideosLesson.vue'
export default {
  name: 'Dashboard',

  components: {
    GraphicsPanel,
    VideosLesson
  },

  layout: 'admin',

  data: () => ({
    lesson: 1,
    childId: 47,
    loading: false
  })
}
</script>
