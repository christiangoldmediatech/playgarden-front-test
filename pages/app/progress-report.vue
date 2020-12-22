<template>
  <v-container
    :class="{ 'lsess-container': !$vuetify.breakpoint.smAndDown }"
    fluid
  >
    <v-card flat class="pt-0 pt-md-3">
      <v-card-text class="text-center pt-0 pt-md-3">
        <underlined-title
          class="text-h5 text-md-h3"
          text="General Progress Report"
        />
      </v-card-text>
      <chart-report />
    </v-card>
  </v-container>
</template>

<script>
import ChartReport from '@/components/app/progress-report/ChartReport.vue'
export default {
  name: 'ProgressReport',

  components: {
    ChartReport
  },

  data: () => ({
    columns: 5
  }),

  computed: {},

  watch: {},

  created () {},

  methods: {}
}
</script>
