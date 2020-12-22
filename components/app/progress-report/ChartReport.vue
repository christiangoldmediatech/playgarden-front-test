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
              // start text
              chart.renderer.text('<span style="color: #DADADA; font-weight:bold; opacity:0.4">Area of Strenght</span>', 300, 100)
                .css({
                  fontSize: '34px',
                  color: '#DADADA'
                })
                .add()

              chart.renderer.text('<span style="color: #DADADA; font-weight:bold; opacity:0.4">Age Appropiate</span>', 305, 186)
                .css({
                  fontSize: '34px',
                  color: '#DADADA'
                })
                .add()
              chart.renderer.text('<span style="color: #DADADA; font-weight:bold; opacity:0.4">Progressing</span>', 325, 286)
                .css({
                  fontSize: '34px',
                  color: '#DADADA'
                })
                .add()
              // end text
              let position = -1
              data.forEach((element) => {
                position += 1
                element.update({
                  color: '#F89838',
                  marker: {
                    symbol: dataImage[position]
                  }
                })
              })
            }
          }
        },
        title: {
          text: ''
        },
        yAxis: {
          gridLineColor: 'transparent',
          tickPositions: [0, 20, 40, 60, 80, 100],
          labels: {
            format: '{value} %'
          },
          title: {
            text: ''
          },
          min: 0
        },
        xAxis: {
          categories: ['Lenguage & Literacy', 'Cognitive', 'Physical', 'Social and Emotional']
        },
        tooltip: {
          formatter () {
            return this.series.name + 'Progress' +
               '</b>: <b> ' + this.point.y + ' data.' + '</b><br /><p>Lorem Ipsum is simply dummy text of<br />the printing and typesetting industry Ipsum is simply dummy text of the printing and typesIpsum.</p>'
          }
        },
        series: [{
          data: [
            { y: 47.0, st: 'hshs' },
            { y: 90.0, st: 'hshs' },
            { y: 40.0, st: 'hshs' },
            { y: 10.0, st: 'hshs' }
          ]
        }],
        credits: {
          enabled: false
        }
      }
    }
  },

  watch: {},

  created () {},

  methods: {}
}
</script>
