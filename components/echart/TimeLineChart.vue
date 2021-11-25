<template>
  <chart ref="time-line-chart" :style="getChartDimensions" :graph="getFormatGraph" :autoresize="resize" />
</template>

<script>
import Chart from '@/components/echart/Chart.vue'
export default {
  name: 'TimeLineChart',
  components: {
    Chart
  },
  props: {
    timeLineData: {
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
          text: (this.timeLineData.title) ? this.timeLineData.title : ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.timeLineData.xAxios
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Users',
            type: 'line',
            stack: 'Users',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: this.timeLineData.data
          }
        ],
        color: ['#68C453', '#F89838', '#925A22', '#fc8452', '#78C383', '#9a60b4', '#ee6666', '#3ba272', '#ea7ccc']
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
