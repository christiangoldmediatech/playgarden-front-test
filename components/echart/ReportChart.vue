<template>
  <v-chart class="chart-report-children" :option="graph" @click="handleClick" />
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
  },
  methods: {
    handleClick(val) {
      this.$emit('click', val)
    }
  }
})
</script>

<style>
.chart-report-children {
  width: 100% !important;
  min-height: 600px !important;
}
</style>
