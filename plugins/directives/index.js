import Vue from 'vue'
import mask from './mask/directive'
import lazyload from './lazyload/directive'

function install (Vue) {
  Vue.directive('mask', mask)
  Vue.directive('lazyload', lazyload)
}

Vue.use(install)
