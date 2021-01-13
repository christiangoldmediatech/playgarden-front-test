import Vue from 'vue'

import { formatDate } from '@/utils/dateTools'

Vue.filter('formatDate', formatDate)

Vue.filter('shorten', (value) => {
  if (value.length > 23) {
    const partA = value.slice(0, 10)
    const partB = value.slice(value.length - 10, value.length)
    return `${partA}...${partB}`
  }
  return value
})

Vue.filter('belongsTo', (name) => {
  if (name.charAt(name.length - 1).toLowerCase() === 's') {
    return `${name}'`
  }

  return `${name}'s`
})
