<template>
  <chart ref="bar-chart" :style="getChartDimensions" :graph="getFormatGraph" :autoresize="resize" />
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
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    openModal: {
      type: Boolean,
      required: false,
      default: true
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
        tooltip: {
          trigger: 'item',
          formatter: 'Letter <br/>{b} : {c}'
        },
        xAxis: {
          type: 'category',
          data: (this.barData.letters) ? this.barData.letters : []
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: (this.barData.data) ? this.barData.data : [],
          type: 'bar'
        }],
        color: ['#F89838', '#925A22', '#fc8452', '#68C453', '#78C383', '#9a60b4', '#ee6666', '#3ba272', '#ea7ccc']
      }
    },
    getChartDimensions () {
      return {
        height: `${this.height} !important`,
        width: `${this.width} !important`
      }
    }
  }
}
</script>
