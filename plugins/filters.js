import Vue from 'vue'
import pad from '@/utils/pad'

Vue.filter('formatDate', (value) => {
  const date = new Date(value)

  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  return `${pad(month, 2)}-${pad(day, 2)}-${year} ${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}`
})

Vue.filter('shorten', (value) => {
  if (value.length > 23) {
    const partA = value.slice(0, 10)
    const partB = value.slice(value.length - 10, value.length)
    return `${partA}...${partB}`
  }
  return value
})
