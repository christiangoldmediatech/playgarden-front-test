<template>
  <div v-if="getSeries.length > 0" class="report-children">
    <highchart :options="chartOptions" :update-args="updateArgs" />
  </div>
</template>

<script>

export default {
  name: 'ChartReport',

  props: {
    report: {
      type: Object,
      required: true,
      default: () => {}
    }
  },

  data: () => ({
    columns: 5
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
      return (this.report.dataSerie) ? this.report.dataSerie : []
    },
    chartOptions () {
      return {
        chart: {
          type: 'scatter',
          backgroundColor: {
            linearGradient: [0, 0, 0, '100%'],
            stops: [
              [0, 'rgba(196, 217, 171, 0.5)'],
              [0.2, 'rgba(196, 217, 171, 0.5)'],
              [0.4, 'rgba(220, 231, 181, 0.25)'],
              [0.6, 'rgba(220, 231, 181, 0.25)'],
              [0.8, 'rgba(248, 152, 56, 0.25)'],
              [1, 'rgba(248, 152, 56, 0.25)']
            ]
          },
          events: {
            load () {
              const chart = this
              const data = chart.series[0].data
              // start text
              chart.renderer.text('<span style="color: #DADADA; font-weight:bold; opacity:0.4">Area of Strenght</span>', 230, 100)
                .css({
                  fontSize: '34px',
                  color: '#DADADA'
                })
                .add()

              chart.renderer.text('<span style="color: #DADADA; font-weight:bold; opacity:0.4">Age Appropiate</span>', 250, 186)
                .css({
                  fontSize: '34px',
                  color: '#DADADA'
                })
                .add()
              chart.renderer.text('<span style="color: #DADADA; font-weight:bold; opacity:0.4">Progressing</span>', 275, 286)
                .css({
                  fontSize: '34px',
                  color: '#DADADA'
                })
                .add()
              // end text
              data.forEach((element) => {
                element.update({
                  color: '#F89838',
                  marker: {
                    symbol: element.icon
                  }
                })
              })
            }
          }
        },
        title: {
          text: ''
        },
        yAxis: {
          gridLineColor: 'transparent',
          tickPositions: [0, 20, 40, 60, 80, 100],
          labels: {
            format: '{value} %'
          },
          title: {
            text: ''
          },
          min: 0
        },
        xAxis: {
          categories: this.getCategories
        },
        tooltip: {
          formatter () {
            return `Data: <b> ${this.point.y} </b> <br /> Progressing: ${this.point.progressing} <br />Strenght: ${this.point.areaStrenght} <br /> Appropiate: ${this.point.ageAppropiate}`
          }
        },
        series: [{
          data: this.getSeries
        }],
        credits: {
          enabled: false
        }
      }
    }
  },

  watch: {},

  created () {},

  methods: {}
}
</script>
