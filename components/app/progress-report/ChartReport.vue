<template>
  <div>
    <report-chart ref="progress-chart" :graph="chartOptions" @click="handleClick" />
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
    getCategoriesFormatted () {
      return ['', ...this.getCategories]
    },
    getRotate () {
      return (this.$vuetify.breakpoint.xs) ? 30 : 0
    },
    getRotateYaxios () {
      return (this.$vuetify.breakpoint.xs) ? 45 : 0
    },
    getValueFontSize () {
      if (this.$vuetify.breakpoint.xs) {
        return '14px'
      }

      return (this.$vuetify.breakpoint.smAndDown) ? '25px' : '30px'
    },
    getAxisLabelFontSize () {
      return (this.$vuetify.breakpoint.smAndDown) ? '14px' : '18px'
    },
    getLabelFontSize () {
      return (this.$vuetify.breakpoint.smAndDown) ? '14px' : '18px'
    },
    getFontSize () {
      return (this.$vuetify.breakpoint.mdAndDown) ? '18px' : '22px'
    },
    getIconSize () {
      return (this.$vuetify.breakpoint.xs) ? '45' : '60'
    },
    getDataSeriesWithStyles() {
      let cognitive = this.report.dataSerie.find((data) => data.nameCardType === 'Cognitive')
      let languageAndLiteracy = this.report.dataSerie.find((data) => data.nameCardType === 'Language & Literacy')
      let physical = this.report.dataSerie.find((data) => data.nameCardType === 'Physical')
      let socialAndEmotional = this.report.dataSerie.find((data) => data.nameCardType === 'Social and Emotional')

      // console.log('languageAndLiteracy--', languageAndLiteracy)

      // In case the percentage is 0, we set the value to 1 so a little bar is rendered
      cognitive = { ...cognitive, value: (cognitive && cognitive.value) ? cognitive.value : 1, itemStyle: { color: '#FA8792', borderRadius: '40%' } }
      languageAndLiteracy = { ...languageAndLiteracy, value: (languageAndLiteracy && languageAndLiteracy.value) ? languageAndLiteracy.value : 1, itemStyle: { color: '#78C383', borderRadius: '40%' } }
      physical = { ...physical, value: (physical && physical.value) ? physical.value : 1, itemStyle: { color: '#69BEFF', borderRadius: '40%' } }
      socialAndEmotional = { ...socialAndEmotional, value: (socialAndEmotional && socialAndEmotional.value) ? socialAndEmotional.value : 1, itemStyle: { color: '#FFAF4B', borderRadius: '40%' } }

      const dataSeriesPadding = { value: 0, nameCardType: '' }
      console.log('languageAndLiteracy--', languageAndLiteracy)

      return [dataSeriesPadding, cognitive, languageAndLiteracy, physical, socialAndEmotional]
    },
    chartOptions () {
      return {
        tooltip: {
          trigger: 'item',
          formatter (params) {
            let text = (params.data.value !== undefined) ? `Percentage: <b> ${params.data.value} %</b> <br />` : 'Progress Report'
            if (params.data.value !== undefined) {
              if (params.data.value <= 20) {
                text += 'Progressing'
              } else if (params.data.value > 20 && params.data.value <= 80) {
                text += 'Age Appropriate'
              } else {
                text += 'Area of Strength'
              }
            }
            return text
          }
        },
        grid: {
          show: false,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.getCategoriesFormatted,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: -1,
            rotate: this.getRotate,
            color: '#606060',
            fontSize: this.getAxisLabelFontSize,
            fontWeight: 'bold',
            fontFamily: 'Quicksand, Poppins'
          }
        },
        yAxis: {
          min: 0,
          max: 100,
          splitLine: {
            show: false
          },
          axisLabel: {
            formatter: '',
            rotate: this.getRotateYaxios
          }
        },
        series: [{
          data: this.getDataSeriesWithStyles,
          type: 'bar',
          barWidth: '80%',
          barCategoryGap: '10%',
          label: {
            show: true,
            position: 'inside',
            formatter (val) {
              if (val.value <= 1) {
                return ''
              }

              return `${val.value} %`
            },
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontFamily: 'Poppins-SemiBold, Poppins',
            fontSize: this.getValueFontSize
          }
        },
        {
          symbolSize: 20,
          silent: true,
          data: [],
          type: 'bar',
          markArea: {
            itemStyle: {
              borderWidth: 1,
              borderType: 'solid',
              borderColor: '#CCCCCC'
            },
            data: [[{ yAxis: 20 }, { yAxis: 20 }]]
          }
        },
        {
          symbolSize: 20,
          silent: true,
          data: [],
          type: 'bar',
          markArea: {
            itemStyle: {
              color: '#68d2e0',
              borderWidth: 1,
              borderType: 'solid',
              borderColor: '#CCCCCC'
            },
            data: [[{ yAxis: 80 }, { yAxis: 80 }]]
          }
        },
        {
          symbolSize: 20,
          silent: true,
          data: [],
          type: 'bar',
          markArea: {
            itemStyle: {
              color: '#000000',
              borderWidth: 1,
              borderType: 'solid',
              borderColor: '#CCCCCC'
            },
            data: [[{ yAxis: 100 }, { yAxis: 100 }]]
          }
        },
        {
          symbolSize: 20,
          data: [],
          type: 'bar',
          silent: true,
          markArea: {
            label: {
              show: true,
              position: 'left',
              distance: this.$vuetify.breakpoint.smAndDown ? -110 : -155,
              color: '#606060',
              fontSize: this.getLabelFontSize,
              fontWeight: 'bold',
              verticalAlign: 'middle',
              fontFamily: 'Quicksand, Poppins',
              opacity: 1
            },
            itemStyle: {
              color: 'transparent',
              borderWidth: 0,
              borderType: 'none'
            },
            data: [[{ name: 'Area of Strength', yAxis: 90 }, { yAxis: 90 }]]
          }
        },
        {
          symbolSize: 20,
          data: [],
          type: 'bar',
          silent: true,
          markArea: {
            label: {
              show: true,
              position: 'left',
              distance: this.$vuetify.breakpoint.smAndDown ? -110 : -150,
              color: '#606060',
              fontSize: this.getLabelFontSize,
              fontWeight: 'bold',
              verticalAlign: 'middle',
              fontFamily: 'Quicksand, Poppins',
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
          type: 'bar',
          silent: true,
          markArea: {
            label: {
              show: true,
              position: 'left',
              distance: this.$vuetify.breakpoint.smAndDown ? -90 : -100,
              color: '#606060',
              fontSize: this.getLabelFontSize,
              fontWeight: 'bold',
              verticalAlign: 'middle',
              fontFamily: 'Quicksand, Poppins',
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
    },
    handleClick (val) {
      this.$emit('click', val)
    }
  }
}
</script>
