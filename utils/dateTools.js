import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

export const timezoneOptions = [{
  name: 'Hawaii Standard Time',
  value: 'Pacific/Honolulu'
},
{
  name: 'Alaska Standard Time',
  value: 'America/Anchorage'
},
{
  name: 'Pacific Standard Time',
  value: 'America/Los_Angeles'
},
{
  name: 'Mountain Standard Time',
  value: 'America/Denver'
},
{
  name: 'Central Standard Time',
  value: 'America/Chicago'
},
{
  name: 'Eastern Standard Time',
  value: 'America/New_York'
}
]

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

export const formatDate = (
  value,
  {
    format = 'MM-DD-YYYY HH:mm:ss',
    fromFormat,
    fromUtc = false,
    toUtc = false,
    returnObject = false
  } = {}
) => {
  let date = dayjs(value, fromFormat)
  if (fromUtc) {
    date = dayjs.utc(value, fromFormat)
  } else if (toUtc) {
    date = dayjs(value, fromFormat).utc()
  }

  if (!toUtc) {
    date = date.local()
  }

  return returnObject ? date : date.format(format)
}

export const formatTimezone = (
  value,
  {
    format = 'MM-DD-YYYY HH:mm:ss',
    fromFormat,
    timezone,
    returnObject = false
  } = {}
) => {
  timezone = getTimezone(timezone)
  let date = dayjs(value, fromFormat)
  if (timezone) {
    date = dayjs.tz(value, timezone)
  }
  return returnObject ? date : date.format(format)
}

export const getTimezone = (timezone) => {
  const currentTimezone = timezoneOptions.find(item => item.value === timezone)
  return (currentTimezone) ? timezone : 'America/New_York'
}

export const sameDay = (d1, d2) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

export const isTomorrow = (date) => {
  const today = new Date()
  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    date.getDate() === today.getDate() + 1
  )
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
  if (hours >= 12) {
    return `${hours === 12 ? 12 : hours - 12}:${minutes.toString().padStart(2, '0')}${pm}`
  }
  return `${hours}:${minutes.toString().padStart(2, '0')}${am}`
}

export const getMondayFriday = (day) => {
  const today = dayjs(day).startOf('day')
  const monday = today.startOf('week').add(1, 'day').toDate()
  const friday = today.endOf('week').subtract(1, 'day').toDate()
  return {
    monday,
    friday
  }
}

export const getWeekStartAndEnd = (day) => {
  const today = dayjs(day).startOf('day')
  const sunday = today.startOf('week').toDate()
  const saturday = today.endOf('week').toDate()
  return {
    sunday,
    saturday
  }
}

export const isTodayInThisWeek = (today, days) => {
  const mondayMs = days.monday.getTime()
  const fridayMs = days.friday.getTime()
  const todayMs = today.getTime()
  return todayMs >= mondayMs && todayMs <= fridayMs
}

export const getCountdownToDate = (date, defaultExpiredString = '0:00:00') => {
  if (!date) {
    return defaultExpiredString
  }

  const time = new Date(date).getTime()

  // get today's date and time
  const now = Date.now()

  // find the distance between now and the count down date
  const distance = time - now

  // time calculations for days, hours, minutes and seconds
  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  // const seconds = Math.floor((distance % (1000 * 60)) / 1000)

  if (distance < 0) {
    return defaultExpiredString
  }

  const displayHours = hours < 10 ? `0${hours}` : hours
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes

  return `${days}:${displayHours}:${displayMinutes}`
}
