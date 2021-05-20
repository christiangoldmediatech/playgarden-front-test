<template>
  <v-chart class="chart" :option="graph" @click="sendData" />
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
  },
  methods: {
    sendData (data) {
      this.$nuxt.$emit('send-data-chart', data)
    }
  }
})
</script>

<style>
.chart {
  height: 400px;
}
</style>
