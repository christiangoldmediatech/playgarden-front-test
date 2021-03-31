<template>
  <chart ref="funnel-chart" :graph="getFormatGraph" :autoresize="resize" />
</template>

<script>
import Chart from '@/components/echart/Chart.vue'
export default {
  name: 'FunnelChart',
  components: {
    Chart
  },
  props: {
    funnelData: {
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
          text: '',
          subtext: ''
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 'right',
          data: (this.funnelData.data) ? this.funnelData.data.map(data => data.name) : []
        },
        series: [
          {
            name: 'Conversions funnel',
            type: 'funnel',
            left: '10%',
            top: 70,
            // x2: 80,
            bottom: 50,
            width: '80%',
            // height: {totalHeight} - y - y2,
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              show: true,
              position: 'inside'
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            emphasis: {
              label: {
                fontSize: 20
              }
            },
            data: (this.funnelData.data) ? this.funnelData.data : []
          }
        ],
        color: ['#78C383', '#C2DAA5', '#F89838', '#925A22', '#ee6666', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
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
  width: 100% !important;
}
</style>
