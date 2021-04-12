<template>
  <v-chart class="chart" :option="graph" />
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
.chart {
  height: 500px;
}
</style>
