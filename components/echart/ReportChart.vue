<template>
  <v-chart class="chart-report-children" :option="graph" auto-resize />
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'ReportChart',
  props: {
    graph: {
      type: Object,
      required: true,
      default: () => {}
    }
  }
})
</script>

<style>
.chart-report-children {
  width: 100% !important;
  min-height: 500px !important;
}
</style>
