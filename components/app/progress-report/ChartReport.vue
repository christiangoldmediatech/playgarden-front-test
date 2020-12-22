<template>
  <highchart :options="chartOptions" />
</template>

<script>

export default {
  name: 'ChartReport',

  components: {},

  data: () => ({
    columns: 5
  }),

  computed: {
    chartOptions () {
      return {
        chart: {
          type: 'scatter',
          backgroundColor: {
            linearGradient: [0, 0, 0, '100%'],
            stops: [
              [0, 'rgba(196, 217, 171, 0.5)'],
              [0.2, 'rgba(196, 217, 171, 0.5)'],
              [0.4, 'rgba(220, 231, 181, 0.25)'],
              [0.6, 'rgba(220, 231, 181, 0.25)'],
              [0.8, 'rgba(248, 152, 56, 0.25)'],
              [1, 'rgba(248, 152, 56, 0.25)']
            ]
          },
          events: {
            load () {
              const chart = this
              const data = chart.series[0].data
              const dataImage = [
                'url(https://playgarden-assets.s3.amazonaws.com/images/report-card-icon/c1c31b01-88c0-468c-aeb8-533037ed8637.png)',
                'url(https://playgarden-assets.s3.amazonaws.com/images/report-card-icon/9d402339-edd5-453e-9e7b-c076132871f8.png)',
                'url(https://playgarden-assets.s3.amazonaws.com/images/report-card-icon/6b8d617d-46d0-4ca3-bf5a-c90d2f7fa7f8.png)',
                'url(https://playgarden-assets.s3.amazonaws.com/images/report-card-icon/c992a995-413a-4795-9dfd-08bc711d227c.png)'
              ]
              let position = -1
              data.forEach((element) => {
                position += 1
                element.update({
                  color: 'red',
                  marker: {
                    symbol: dataImage[position]
                  }
                })
              })
            }
          }
        },
        xAxis: {
          categories: ['Lenguage & Literacy', 'Cognitive', 'Physical', 'Social and Emotional']
        },
        series: [{
          data: [47.0, 60, 40, 10]
        }]
      }
    }
  },

  watch: {},

  created () {},

  methods: {}
}
</script>
