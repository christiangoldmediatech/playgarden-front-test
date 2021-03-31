<template>
  <chart ref="bar-chart" :graph="getFormatGraph" :autoresize="resize" />
</template>

<script>
import Chart from '@/components/echart/Chart.vue'
export default {
  name: 'BarChart',
  components: {
    Chart
  },
  props: {
    barData: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  data () {
    return {
      resize: true
    }
  },
  computed: {
    getFormatGraph () {
      return {
        xAxis: {
          type: 'category',
          data: (this.barData.xAxios) ? this.barData.xAxios : []
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: (this.barData.data) ? this.barData.data : [],
          type: 'bar'
        }]
      }
    }
  }
}
</script>

<style>
/**
 * The default size is 600px×400px, for responsive charts
 * you may need to set percentage values as follows (also
 * don't forget to provide a size for the container).
 */
.echarts {
  width: 100%;
  max-width: 500px !important;
}
</style>
