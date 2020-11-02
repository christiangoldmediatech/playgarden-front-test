import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export const translateUTC = (date) => {
  const utcDate = dayjs.utc(date)
  let newDate = dayjs()

  newDate = newDate.set('year', utcDate.year()).set('month', utcDate.month()).set('date', utcDate.date()).set('hour', utcDate.hour()).set('minute', utcDate.minute()).set('second', utcDate.second()).set('millisecond', utcDate.millisecond())

  return newDate
}
