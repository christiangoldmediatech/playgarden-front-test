<template>
  <v-container
    :class="{ 'dashboard-container': !$vuetify.breakpoint.smAndDown }"
    fluid
  >
    <v-row>
      <v-row>
        <v-col cols="12">
          <v-card width="100%">
            <v-card-title>
              Lessons Analytics work
              <v-spacer />
              <v-btn
                class="text-none"
                color="accent darken-1"
                depressed
                nuxt
                small
                @click="goToBack"
              >
                Back
              </v-btn>
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
      <v-col cols="12">
        <graphics-panel />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GraphicsPanel from '@/components/admin/worksheets-analytics/GraphicsPanel.vue'
export default {
  name: 'Dashboard',

  components: {
    GraphicsPanel
  },

  layout: 'admin',

  methods: {
    goToBack () {
      this.$router.push({
        name: 'admin-lessons-analytics',
        query: { lessonId: this.$route.query.lessonId }
      })
    }
  }
}
</script>
