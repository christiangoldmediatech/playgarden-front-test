<template>
  <chart ref="funnelChartRef" :style="getChartDimensions" :graph="getFormatGraph" :autoresize="resize" />
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
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
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
          text: (this.funnelData.title) ? this.funnelData.title : '',
          subtext: (this.funnelData.subtitle) ? this.funnelData.subtitle : ''
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          bottom: 10,
          orient: 'vertical',
          left: 'left',
          data: (this.funnelData.data) ? this.funnelData.data.map(data => data.name) : []
        },
        events: {
          click: this.click
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
        color: ['#78C383', '#68C453', '#F89838', '#925A22', '#ee6666', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
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
