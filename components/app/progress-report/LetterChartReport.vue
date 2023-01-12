<template>
  <div v-if="letterStats.reports.length > 0">
    <report-chart ref="progress-chart" :graph="chartOptions" />
  </div>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import ReportChart from '@/components/echart/ReportChart.vue'
import { useVuetifyHelper } from '@/composables'

export default defineComponent({
  name: 'LetterChartReport',
  components: { ReportChart },
  props: {
    letterStats: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  setup(props) {
    const vuetify = useVuetifyHelper()

    const categories = computed(() => {
      return !props.letterStats?.reports ? [] : props.letterStats.reports.map((letterStat) => letterStat.title).reverse()
    })

    const getLabelPosition = computed(() => vuetify.breakpoint.smAndDown ? [0, -30] : 'right')

    const getLabelFontSize = computed(() => vuetify.breakpoint.smAndDown ? '18px' : '25px')

    const getAxisLabel = computed(() => vuetify.breakpoint.smAndDown ? '' : '{value}')

    const dataSeries = computed(() => {
      return !props.letterStats?.reports
        ? []
        : props.letterStats.reports.map((letterStat) =>
          ({
            // In case the percentage is 0, we set the value to 0.5 so a little bar is rendered
            value: letterStat.percentage === 0 ? 0.5 : letterStat.percentage,
            done: letterStat.done,
            total: letterStat.total,
            nameCardType: letterStat.title,
            itemStyle: { color: '#78C383' }
          })).reverse()
    })

    const chartOptions = computed(() => ({
      grid: {
        show: false,
        containLabel: true
      },
      yAxis: {
        type: 'category',
        data: categories.value,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          formatter: getAxisLabel.value,
          interval: -1,
          color: '#606060',
          position: 'top',
          fontSize: getLabelFontSize.value,
          fontWeight: 'bold',
          fontFamily: 'Quicksand, Poppins'
        }
      },
      xAxis: {
        min: 0,
        max: 100,
        splitLine: {
          show: false
        },
        axisLabel: {
          formatter: ''
          // rotate: this.getRotateYaxios
        }
      },
      series: [{
        data: dataSeries.value,
        type: 'bar',
        orient: 'horizontal',
        barWidth: '50%',
        label: {
          show: true,
          position: getLabelPosition.value,
          formatter (val) {
            if (vuetify.breakpoint.smAndDown) {
              return `${val.data.nameCardType} ${val.data.done}/${val.data.total}`
            }

            return `${val.data.done}/${val.data.total}`
          },
          color: '#606060',
          fontWeight: 'bold',
          fontFamily: 'Quicksand, Poppins',
          fontSize: getLabelFontSize.value
        }
      }]
    }))

    return { chartOptions }
  }
})
</script>
