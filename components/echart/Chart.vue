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
    },
    openModal: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  methods: {
    sendData (data) {
      data.openModal = this.openModal
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
