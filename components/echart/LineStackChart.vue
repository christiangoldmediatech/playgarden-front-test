<template>
  <chart ref="lineStackChartRef" :style="getChartDimensions" :graph="getFormatGraph" :autoresize="resize" :open-modal="openModal" />
</template>

<script>
import Chart from '@/components/echart/Chart.vue'
export default {
  name: 'LineStackChart',
  components: {
    Chart
  },
  props: {
    lineStackData: {
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
        title: {
          text: (this.lineStackData.title) ? this.lineStackData.title : '',
          subtext: (this.lineStackData.subtitle) ? this.lineStackData.subtitle : ''
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          data: (this.lineStackData.legend) ? this.lineStackData.legend : []
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: (this.lineStackData.xAxis) ? this.lineStackData.xAxis : []
        },
        yAxis: {
          type: 'value'
        },
        series: (this.lineStackData.data) ? this.lineStackData.data : [],
        color: ['#78C383', '#F89838', '#925A22', '#68C453', '#ee6666', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
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
