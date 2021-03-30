import Vue from 'vue'
// import ECharts modules manually to reduce bundle size
import ECharts from 'vue-echarts'
import 'echarts'

// register globally (or you can do it locally)
Vue.component('v-chart', ECharts)
