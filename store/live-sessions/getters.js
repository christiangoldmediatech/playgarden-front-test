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
          const session =
            daySessions.find(({ dateStart }) => {
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
  },

  getAdvancedSchedule (state) {
    const hourDays = new Array(19).fill(null)
    const days = new Array(5).fill(hourDays)
    // Create default base obj
    const schedule = {
      firstHour: 0,
      endHour: 18,
      days
    }

    if (state.sessions.length === 0) {
      return schedule
    }

    // Get the sessions and transform them for easier sorting
    const sessions = state.sessions.map((session) => {
      const date = new Date(session.dateStart)
      const endDate = new Date(session.dateEnd)
      return {
        ...session,
        weekDay: date.getDay(),
        day: date.getDate(),
        hour: date.getHours(),
        endHour: endDate.getHours()
      }
    }).sort((a, b) => {
      return a.day - b.day || a.hour - b.hour
    })

    schedule.sessions = sessions

    // Find first start and end hour. We need to set real initial value
    // so that when we loop through all the sessions, we can find the correct hours
    // This is what allows us to have our initial empty placeholder values when no sessions
    // loaded, and allows an empty table to render correctly.
    // We want the first hour to be earlier than the first hour used,
    // But not earlier than 0 hour
    if ((sessions[0].hour - 1) > 0) {
      schedule.firstHour = sessions[0].hour - 1
    } else {
      schedule.firstHour = sessions[0].hour
    }

    // The same applies to the end hour; one hour later and the last used,
    // but not greater than 23
    if (sessions[0].endHour === 23) {
      schedule.endHour = 23
    } else {
      schedule.endHour = sessions[0].endHour + 1
    }

    // Now find start and end hours for all sessions
    // We will use the same logic as above, but not for each session in a loop
    sessions.forEach((session) => {
      if (session.hour < schedule.firstHour) {
        if (session.hour > 0) {
          schedule.firstHour = session.hour - 1
        } else {
          schedule.firstHour = session.hour
        }
      }

      if ((session.endHour + 1) > schedule.endHour) {
        if (session.endHour === 23) {
          schedule.endHour = 23
        } else {
          schedule.endHour = session.endHour + 1
        }
      }
    })

    for (let day = 1; day <= 5; day++) {
      const daySessions = sessions.filter((session) => {
        return session.weekDay === day
      })

      const hours = []
      for (let hour = schedule.firstHour; hour <= 18; hour++) {
        if (daySessions.length) {
          const session =
            daySessions.find((session) => {
              return session.hour === hour
            }) || null
          hours.push(session)
        } else {
          hours.push(null)
        }
      }
      schedule.days[day - 1] = hours
    }

    return schedule
  }
}
