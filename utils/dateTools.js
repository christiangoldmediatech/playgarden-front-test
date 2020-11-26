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
