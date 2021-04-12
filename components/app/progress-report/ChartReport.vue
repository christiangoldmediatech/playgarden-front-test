<template>
  <div>
    <report-chart ref="progress-chart" :graph="chartOptions" />
  </div>
</template>

<script>
import ReportChart from '@/components/echart/ReportChart.vue'
export default {
  name: 'ChartReport',
  components: {
    ReportChart
  },
  props: {
    report: {
      type: Object,
      required: true,
      default: () => {}
    }
  },

  data: () => ({
    load: false
  }),

  computed: {
    getCategories () {
      return (this.report.categories) ? this.report.categories : []
    },
    getSeries () {
      return (this.report.dataSerie) ? {
        symbolSize: this.getIconSize,
        data: this.report.dataSerie,
        type: 'scatter'
      } : {}
    },
    getRotate () {
      return (this.$vuetify.breakpoint.xs) ? 30 : 0
    },
    getRotateYaxios () {
      return (this.$vuetify.breakpoint.xs) ? 45 : 0
    },
    getFontSize () {
      return (this.$vuetify.breakpoint.xs) ? '32px' : '34px'
    },
    getIconSize () {
      return (this.$vuetify.breakpoint.xs) ? '45' : '60'
    },
    chartOptions () {
      return {
        tooltip: {
          trigger: 'item',
          formatter (params) {
            let text = (params.data.value !== undefined) ? `Data: <b> ${params.data.value} </b> <br />` : 'Progress Report'
            if (params.data.value !== undefined) {
              if (params.data.value <= 20) {
                text += `Progressing: ${params.data.progressing} <br />`
              } else if (params.data.value > 20 && params.data.value <= 80) {
                text += `Age Appropriate: ${params.data.ageAppropiate} <br />`
              } else {
                text += `Area of Strength: ${params.data.areaStrenght}`
              }
            }
            return text
          }
        },
        grid: {
          show: false
        },
        xAxis: {
          type: 'category',
          data: this.getCategories,
          axisLabel: {
            interval: -1,
            rotate: this.getRotate
          }
        },
        yAxis: {
          min: 0,
          max: 100,
          splitLine: {
            show: false
          },
          axisLabel: {
            formatter: '{value} %',
            rotate: this.getRotateYaxios
          }
        },
        series: [{
          symbolSize: 50,
          data: this.report.dataSerie,
          type: 'scatter',
          markArea: {
            label: {
              show: true
            },
            itemStyle: {
              normal: {
                color: 'rgba(248, 152, 56, 0.25)'
              }
            },
            data: [[{ yAxis: 0 }, { yAxis: 20 }]]
          }
        },
        {
          symbolSize: 20,
          data: [],
          type: 'scatter',
          markArea: {
            itemStyle: {
              normal: {
                color: 'rgba(220, 231, 181, 0.25)'
              }
            },
            data: [[{ yAxis: 20 }, { yAxis: 80 }]]
          }
        },
        {
          symbolSize: 20,
          data: [],
          type: 'scatter',
          markArea: {
            itemStyle: {
              color: '#68d2e0',
              normal: {
                color: 'rgba(196, 217, 171, 0.5)'
              }
            },
            data: [[{ yAxis: 80 }, { yAxis: 100 }]]
          }
        },
        {
          symbolSize: 20,
          data: [],
          type: 'scatter',
          markArea: {
            label: {
              show: true,
              color: '#DADADA',
              fontSize: '31px',
              fontWeight: 'bold',
              verticalAlign: 'middle',
              fontFamily: 'Poppins-SemiBold, Poppins',
              opacity: 1
            },
            itemStyle: {
              color: 'transparent',
              borderWidth: 0,
              borderType: 'none'
            },
            data: [[{ name: 'Area of Strength', yAxis: 85 }, { yAxis: 85 }]]
          }
        },
        {
          symbolSize: 20,
          data: [],
          type: 'scatter',
          markArea: {
            label: {
              show: true,
              color: '#DADADA',
              fontSize: '31px',
              fontWeight: 'bold',
              verticalAlign: 'middle',
              fontFamily: 'Poppins-SemiBold, Poppins',
              opacity: 1
            },
            itemStyle: {
              color: 'transparent',
              borderWidth: 0,
              borderType: 'none'
            },
            data: [[{ name: 'Age Appropriate', yAxis: 48 }, { yAxis: 48 }]]
          }
        },
        {
          symbolSize: 20,
          data: [],
          type: 'scatter',
          markArea: {
            label: {
              show: true,
              color: '#DADADA',
              fontSize: '31px',
              fontWeight: 'bold',
              verticalAlign: 'middle',
              fontFamily: 'Poppins-SemiBold, Poppins',
              opacity: 1
            },
            itemStyle: {
              color: 'transparent',
              borderWidth: 0,
              borderType: 'none'
            },
            data: [[{ name: 'Progressing', yAxis: 10 }, { yAxis: 10 }]]
          }
        }]
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
