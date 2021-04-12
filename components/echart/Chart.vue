<template>
  <v-chart class="chart" :option="graph" />
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'Chart',
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
  height: 400px;
}
</style>
