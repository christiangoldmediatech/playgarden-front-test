<template>
  <div>
    <v-row v-if="isMobile" no-gutters>
      <v-col cols="4" class="d-flex flex-column align-center justify-center">
        <div class="pg-w-[50px] pg-h-[15px] pg-rounded-[4px] pg-bg-[#D1ADF5] mb-2"></div>
        <span class="bar-label-mobile">{{ $t('studentCubby.progressReport.areaOfStrength') }}</span>
      </v-col>
      <v-col cols="4" class="d-flex flex-column align-center justify-center">
        <div class="pg-w-[50px] pg-h-[15px] pg-rounded-[4px] pg-bg-[#FFB8E7] mb-2"></div>
        <span class="bar-label-mobile">{{ $t('studentCubby.progressReport.ageAppropriate') }}</span>
      </v-col>
      <v-col cols="4" class="d-flex flex-column align-center justify-center">
        <div class="pg-w-[50px] pg-h-[15px] pg-rounded-[4px] pg-bg-[#A5EA95] mb-2"></div>
        <span class="bar-label-mobile">{{ $t('studentCubby.progressReport.progressing') }}</span>
      </v-col>
    </v-row>
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
    isMobile() {
      return this.$vuetify.breakpoint.mdAndDown
    },
    getCategories () {
      return (this.report.categories) ? this.report.categories : []
    },
    getCategoriesFormatted () {
      // A  is added at the beginning in order to render and empty space
      if (this.$vuetify.breakpoint.mdAndDown) {
        return [...this.getCategories]
      }

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
    getHorizontalLabels() {
      return this.$vuetify.breakpoint.mdAndDown
        ? []
        : [{
            symbolSize: 20,
            data: [],
            type: 'bar',
            silent: true,
            markArea: {
              label: {
                show: true,
                position: 'left',
                distance: this.$vuetify.breakpoint.smAndDown ? -110 : -140,
                color: '#606060',
                fontSize: this.getLabelFontSize,
                formatter: `{square|      }  ${this.$t('studentCubby.progressReport.areaOfStrength')}`,
                rich: {
                  square: {
                    fontSize: '18px',
                    backgroundColor: ' #A5EA95',
                    borderRadius: 4
                  }
                },
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
              data: [[{ yAxis: 90 }, { yAxis: 90 }]]
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
                distance: this.$vuetify.breakpoint.smAndDown ? -110 : -140,
                color: '#606060',
                fontSize: this.getLabelFontSize,
                formatter: `{square|      }  ${this.$t('studentCubby.progressReport.ageAppropriate')}`,
                rich: {
                  square: {
                    fontSize: '18px',
                    backgroundColor: '#FFB8E7',
                    borderRadius: 4
                  }
                },
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
              data: [[{ yAxis: 48 }, { yAxis: 48 }]]
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
                formatter: `{square|      }  ${this.$t('studentCubby.progressReport.progressing')}`,
                rich: {
                  square: {
                    fontSize: '18px',
                    backgroundColor: '#D1ADF5',
                    borderRadius: 4
                  }
                },
                verticalAlign: 'middle',
                fontFamily: 'Quicksand, Poppins',
                opacity: 1
              },
              itemStyle: {
                color: 'transparent',
                borderWidth: 0,
                borderType: 'none'
              },
              data: [[{ yAxis: 10 }, { yAxis: 10 }]]
            }
          }]
    },
    getDataSeriesWithStyles() {
      const firstSeparationValues = []
      const secondSeparationValues = []
      const thirdSeparationValues = []

      this.report.dataSerie.forEach((serie) => {
        const seperatedValues = this.separateValues(serie)
        firstSeparationValues.push(seperatedValues[0])
        secondSeparationValues.push(seperatedValues[1])
        thirdSeparationValues.push(seperatedValues[2])
      })

      // A zero is added at the beginning in order to render and empty space
      if (!this.$vuetify.breakpoint.mdAndDown) {
        firstSeparationValues.unshift(0)
        secondSeparationValues.unshift(0)
        thirdSeparationValues.unshift(0)
      }

      const label = {
        show: true,
        position: 'top',
        formatter (val) {
          const showLabel = val.data.showLabel
          const value = val.data.realValue ? val.data.realValue : val.value
          if (value <= 1 || !showLabel) {
            return ''
          }

          return `${value} %`
        },
        color: '#606060',
        fontWeight: 'bold',
        fontFamily: 'Poppins-SemiBold, Poppins',
        fontSize: this.getValueFontSize
      }

      const firstSeparation = {
        name: 'separation1',
        data: firstSeparationValues,
        itemStyle: { color: '#D1ADF5' },
        type: 'bar',
        stack: 'ad',
        barWidth: '80%',
        barCategoryGap: '10%',
        label: { ...label }
      }
      const secondSeparation = {
        name: 'separation2',
        data: secondSeparationValues,
        stack: 'ad',
        itemStyle: { color: '#FFB8E7' },
        type: 'bar',
        barWidth: '80%',
        barCategoryGap: '10%',
        label: { ...label }
      }
      const thirdSeparation = {
        name: 'separation3',
        data: thirdSeparationValues,
        stack: 'ad',
        itemStyle: { color: '#A5EA95' },
        type: 'bar',
        barWidth: '80%',
        barCategoryGap: '10%',
        label: { ...label }
      }

      return [firstSeparation, secondSeparation, thirdSeparation]
    },
    chartOptions () {
      return {
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            let text = (params.data.value !== undefined) ? `Percentage: <b> ${params.data.value} %</b> <br />` : this.$t('studentCubby.progressReport.text')
            if (params.data.value !== undefined) {
              if (params.data.value <= 20) {
                text += this.$t('studentCubby.progressReport.progressing')
              } else if (params.data.value > 20 && params.data.value <= 80) {
                text += this.$t('studentCubby.progressReport.ageAppropriate')
              } else {
                text += this.$t('studentCubby.progressReport.areaOfStrength')
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
        series: [
          ...this.getDataSeriesWithStyles,
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
          ...this.getHorizontalLabels
        ]
      }
    }
  },

  methods: {
    separateValues(dataSeries) {
      /*
        Values should be separated in three in order to render three stack bars
      */

      // In case the percentage is 0, we set the value to 1 so a little bar is rendered
      const value = (dataSeries && dataSeries.value) ? dataSeries.value : 1
      const getDataObject = (dataValue, showLabel) => ({ ...dataSeries, value: dataValue, showLabel, realValue: value })

      const firstUpperLimit = 20
      const secondUpperLimit = 80

      if (value <= firstUpperLimit) {
        return [
          getDataObject(value, true),
          getDataObject(0, false),
          getDataObject(0, false)
        ]
      } else if (value <= secondUpperLimit) {
        return [
          getDataObject(firstUpperLimit, false),
          getDataObject(value - firstUpperLimit, true),
          getDataObject(0, false)
        ]
      } else {
        return [
          getDataObject(firstUpperLimit, false),
          getDataObject(secondUpperLimit - firstUpperLimit, false),
          getDataObject(value - secondUpperLimit, true)
        ]
      }
    },
    pointClick (event) {
      this.$nuxt.$emit('detail-progress-report', event)
    },
    handleClick (val) {
      const valCopy = { ...val }
      if ('realValue' in valCopy.data) {
        valCopy.data = { ...valCopy.data, value: valCopy.data.realValue }
      }

      this.$emit('click', valCopy)
    }
  }
}
</script>

<style lang="scss" scoped>
.bar-label-mobile {
  // font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  font-size: 11px;
  line-height: 14px;
  color: #606060;
}
</style>
