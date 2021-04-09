<template>
  <div>
    <!-- <highchart class="content-report chart-style" :options="chartOptions" ref="chart" :update-args="updateArgs" /> -->
    <chart ref="progress-chart" :graph="chartOptions" :autoresize="resize" />
  </div>
</template>

<script>
import Chart from '@/components/echart/Chart.vue'
export default {
  name: 'ChartReport',
  components: {
    Chart
  },
  props: {
    report: {
      type: Object,
      required: true,
      default: () => {}
    }
  },

  data: () => ({
    colorSeries: [
      {
        data: [],
        type: 'scatter',
        markArea: {
          itemStyle: {
            normal: {
              color: 'rgba(248, 152, 56, 0.25)'
            }
          },
          data: [
            [{ yAxis: 0 }, { yAxis: 20 }]
          ]
        }
      },
      {
        data: [],
        type: 'scatter',
        markArea: {
          itemStyle: {
            normal: {
              color: 'rgba(220, 231, 181, 0.25)'
            }
          },
          data: [
            [{ yAxis: 20 }, { yAxis: 80 }]
          ]
        }
      },
      {
        data: [],
        type: 'scatter',
        markArea: {
          itemStyle: {
            normal: {
              color: 'rgba(196, 217, 171, 0.5)'
            }
          },
          data: [
            [{ yAxis: 80 }, { yAxis: 100 }]
          ]
        }
      }
    ]
  }),

  computed: {
    updateArgs () {
      return [true, true, { duration: 1000 }]
    },
    getDataImage () {
      return (this.report.dataImage) ? this.report.dataImage : []
    },
    getCategories () {
      return (this.report.categories) ? this.report.categories : []
    },
    getSeries () {
      return (this.report.dataSerie) ? {
        symbolSize: 50,
        data: this.report.dataSerie,
        type: 'scatter'
      } : {}
    },
    getFontSize () {
      return (this.$vuetify.breakpoint.xs) ? '32px' : '34px'
    },
    getIconSize () {
      return (this.$vuetify.breakpoint.xs) ? '45' : '60'
    },
    chartOptions () {
      // const that = this
      return {
        yAxis: {
          min: 0,
          max: 100
        },
        xAxis: {
          type: 'category',
          data: this.getCategories
        },
        series: [this.getSeries, ...this.colorSeries]
      }
    }
  },

  watch: {},

  created () {},

  methods: {
    pointClick (event) {
      this.$nuxt.$emit('detail-progress-report', event)
    }
  }
}
</script>

<style>
.chart-style {
  max-height: 900px !important;
}
</style>
