import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import pad from '@/utils/pad'

dayjs.extend(utc)

export const translateUTC = (date) => {
  const utcDate = dayjs.utc(date)
  let newDate = dayjs()

  newDate = newDate
    .set('year', utcDate.year())
    .set('month', utcDate.month())
    .set('date', utcDate.date())
    .set('hour', utcDate.hour())
    .set('minute', utcDate.minute())
    .set('second', utcDate.second())
    .set('millisecond', utcDate.millisecond())

  return newDate
}

export const formatDate = (value) => {
  const date = new Date(value)

  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  return `${pad(month, 2)}-${pad(day, 2)}-${year} ${pad(hours, 2)}:${pad(
    minutes,
    2
  )}:${pad(seconds, 2)}`
}

export const sameDay = (d1, d2) => {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
}

export const isTomorrow = (date) => {
  const today = new Date()
  return today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    date.getDate() === (today.getDate() + 1)
}

export const stringsToDate = (date, time) => {
  const result = new Date()
  const dateParts = date.split('-')
  const timeParts = time.split(':')

  result.setFullYear(dateParts[0])
  result.setMonth(dateParts[1] - 1)
  result.setDate(dateParts[2])
  result.setHours(timeParts[0])
  result.setMinutes(timeParts[1])
  result.setSeconds(0)
  result.setMilliseconds(0)

  return result
}

export const getNumberOrder = (dayInMonth) => {
  const st = [1, 21, 31]
  const nd = [2, 22]
  const rd = [3, 23]

  if (st.includes[dayInMonth]) {
    return `${dayInMonth}st`
  } else if (nd.includes[dayInMonth]) {
    return `${dayInMonth}nd`
  } else if (rd.includes[dayInMonth]) {
    return `${dayInMonth}rd`
  }
  return `${dayInMonth}th`
}

export const hours24ToHours12 = (hours, minutes, am = 'am', pm = 'pm') => {
  if (hours >= 13) {
    return `${hours - 12}:${minutes.toString().padStart(2, '0')}${pm}`
  }
  return `${hours}:${minutes.toString().padStart(2, '0')}${am}`
}
