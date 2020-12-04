import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export default {
  getWeeklySchedule (state) {
    // Create an array for the week.
    const schedule = []
    const sessions = state.sessions

    for (let day = 1; day <= 5; day++) {
      const daySessions = sessions.filter(({ dateStart }) => {
        const date = dayjs.utc(dateStart)
        return date.day() === day
      })

      const hours = []
      for (let hour = 8; hour <= 18; hour++) {
        if (daySessions.length) {
          const session = daySessions.find(({ dateStart }) => {
            const date = dayjs.utc(dateStart)
            return date.hour() === hour
          }) || null
          hours.push(session)
        } else {
          hours.push(null)
        }
      }
      schedule.push(hours)
    }
    return schedule
  }
}
