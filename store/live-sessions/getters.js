export default {
  getWeeklySchedule (state) {
    // Create an array for the week.
    const schedule = []
    const sessions = state.sessions

    for (let day = 1; day <= 5; day++) {
      const daySessions = sessions.filter(({ dateStart }) => {
        const date = new Date(dateStart)
        return date.getDay() === day
      })

      const hours = []
      for (let hour = 8; hour <= 18; hour++) {
        if (daySessions.length) {
          const session = daySessions.find(({ dateStart }) => {
            const date = new Date(dateStart)
            return date.getHours() === hour
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
