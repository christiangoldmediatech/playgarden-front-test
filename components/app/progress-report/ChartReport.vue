<template>
  <div v-if="getSeries.length > 0">
    <highchart class="content-report chart-style" :options="chartOptions" :update-args="updateArgs" ref="chart" />
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
    getFontSize () {
      return (this.$vuetify.breakpoint.xs) ? '32px' : '34px'
    },
    getIconSize () {
      return (this.$vuetify.breakpoint.xs) ? '45' : '60'
    },
    chartOptions () {
      const that = this
      return {
        chart: {
          type: 'scatter',
          height: '530px',
          events: {
            load () {
              const chart = this
              // console.log('icon si', this.getIconSize())
              const data = chart.series[0].data
              const textX = (chart.plotWidth * 0.5) - 100
              const textY = (chart.plotHeight * 0.5) - 100
              // start text
              chart.renderer.text('<span style="color: #DADADA; font-weight:bold; opacity:0.9">Area of Strenght</span>', (textX + 20), (textY + 7))
                .css({
                  fontSize: '32px',
                  fontFamily: 'Poppins-SemiBold, Poppins',
                  color: '#DADADA'
                })
                .add()

              chart.renderer.text('<span style="color: #DADADA; font-weight:bold; opacity:0.9">Age Appropiate</span>', (textX + 40), ((textY + 160)))
                .css({
                  fontSize: '31px',
                  color: '#DADADA',
                  fontFamily: 'Poppins-SemiBold, Poppins'
                })
                .add()
              chart.renderer.text('<span style="color: #DADADA; font-weight:bold; opacity:0.9">Progressing</span>', (textX + 50), ((textY + 315)))
                .css({
                  fontSize: '32px',
                  color: '#DADADA',
                  fontFamily: 'Poppins-SemiBold, Poppins'
                })
                .add()
              // end text
              data.forEach((element) => {
                element.update({
                  color: '#F89838',
                  marker: {
                    symbol: `url(${element.icon})`,
                    width: that.getIconSize,
                    height: that.getIconSize
                  }
                })
              })
            }
          }
        },
        title: {
          text: 'text',
          margin: 20,
          style: {
            color: 'white'
          }
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
          plotBands: [
            {
              color: 'rgba(248, 152, 56, 0.25)',
              from: 0,
              to: 20
            },
            {
              color: 'rgba(220, 231, 181, 0.25)',
              from: 0,
              to: 80
            },
            {
              color: 'rgba(196, 217, 171, 0.5)',
              from: 80,
              to: 100
            }
          ],
          min: 0
        },
        xAxis: {
          categories: this.getCategories
        },
        legend: {
          enabled: false
        },
        tooltip: {
          formatter () {
            let text = `Data: <b> ${this.point.y} </b> <br />`
            if (this.point.y <= 20) {
              text += `Progressing: ${this.point.progressing} <br />`
            } else if (this.point.y > 20 && this.point.y <= 80) {
              text += `Age Appropriate: ${this.point.ageAppropiate} <br />`
            } else {
              text += `Area of Strength: ${this.point.areaStrenght}`
            }
            return text
          }
        },
        plotOptions: {
          series: {
            cursor: 'pointer',
            events: {
              click: (e) => {
                this.pointClick(e)
              }
            }
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
