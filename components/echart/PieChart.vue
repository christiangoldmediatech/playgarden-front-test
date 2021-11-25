<template>
  <chart ref="pie-chart" :style="getChartDimensions" :graph="getFormatGraph" :autoresize="resize" />
</template>

<script>
import Chart from '@/components/echart/Chart.vue'
export default {
  name: 'PieChart',
  components: {
    Chart
  },
  props: {
    pieData: {
      type: Object,
      required: true,
      default: () => ({})
    },
    descriptionToolTip: {
      type: String,
      required: false,
      default: null
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
          text: (this.pieData.title) ? this.pieData.title : '',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: (this.descriptionToolTip) ? '{a} <br/>{b} ' + this.descriptionToolTip + ': {c} ({d}%)' : '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          bottom: 10,
          orient: 'vertical',
          left: 'left',
          data: (this.pieData.data) ? this.pieData.data.map(data => data.name) : []
        },
        series: [
          {
            name: (this.pieData.name) ? this.pieData.name : '',
            type: 'pie',
            center: ['50%', '50%'],
            radius: '50%',
            data: (this.pieData.data) ? this.pieData.data : [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ],
        color: ['#F89838', '#68C453', '#925A22', '#fc8452', '#78C383', '#9a60b4', '#ee6666', '#3ba272', '#ea7ccc']
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
