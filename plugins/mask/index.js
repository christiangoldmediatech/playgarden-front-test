import Vue from 'vue'
import mask from './directive'

function install (Vue) {
  Vue.directive('mask', mask)
}

Vue.use(install)
