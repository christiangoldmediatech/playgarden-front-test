<template>
  <chart ref="funnel-chart" :graph="getFormatGraph" />
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
      default: () => ({
        xAxis: {},
        yAxis: {},
        series: []
      })
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
          text: 'Conversions funnel',
          subtext: 'The conversions will be shown here'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}%'
        },
        legend: {
          orient: 'vertical',
          right: 'right',
          data: this.funnelData.map(data => data.name)
        },
        series: [
          {
            name: 'Conversions funnel',
            type: 'funnel',
            left: '10%',
            top: 60,
            // x2: 80,
            bottom: 60,
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
            data: this.funnelData
          }
        ]
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
  height: 700px;
}
</style>
