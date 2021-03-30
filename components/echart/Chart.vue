<template>
  <v-chart class="chart" :option="graph" />
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { FunnelChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'

use([
  CanvasRenderer,
  PieChart,
  FunnelChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])

export default {
  name: 'Chart',
  components: {
    VChart
  },
  props: {
    graph: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  provide: {
    [THEME_KEY]: 'dark'
  }
}
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
