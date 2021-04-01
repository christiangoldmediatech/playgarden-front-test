<template>
  <chart ref="pie-chart" :graph="getFormatGraph" :autoresize="resize" />
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
          formatter: '{a} <br/>{b} : {c} ({d}%)'
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
        color: ['#F89838', '#C2DAA5', '#925A22', '#fc8452', '#78C383', '#9a60b4', '#ee6666', '#3ba272', '#ea7ccc']
      }
    }
  }
}
</script>

<style>
/**
 * The default size is 600px×400px, for responsive charts
 * you may need to set percentage values as follows (also
 * don't forget to provide a size for the container).
 */
.echarts {
  width: 100%;
  height: 300px !important;
}
</style>
