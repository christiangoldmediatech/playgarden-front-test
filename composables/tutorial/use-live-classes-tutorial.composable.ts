import dayjs from 'dayjs'
import { sessionBoilerplate, getDataForLiveClases } from './session-mockup-helpers'

export const useLiveClassesTutorial = async () => {
  const { getCurriculum, getActivity, getTeacher, week } = await getDataForLiveClases()
  const curriculumA = getCurriculum()
  let id = 1000

  let liveSessionsData = [
    {
      tutorialId: 'tutorial-music-live-session',
      title: 'The teacher loves music, singing...',
      description: 'Miss Sarah loves music, singing and playing the piano! Join us each week to learn about a new Letter of the Week using educational songs and live music!',
      dateStart: week.monday.at(11),
      dateEnd: week.monday.at(12),
      activityType: getActivity('Music'),
      teacher: getTeacher('Sarah')
    },
    {
      tutorialId: 'tutorial-art-live-session',
      title: 'Let\'s do art!',
      description: 'The teacher enjoys drawing and painting! Join us to learn about a new Letter of the Week with educational art classes!\nYou will need the following list of materials:\nLetter sized paper,\nCrayons,\nWatercolors and brushes\n',
      dateStart: week.monday.at(15),
      dateEnd: week.monday.at(16),
      activityType: getActivity('Art'),
      teacher: getTeacher('Emma')
    },
    {
      title: 'Jake on the Playground...',
      description: '',
      dateStart: week.wednesday.at(13),
      dateEnd: week.wednesday.at(14),
      activityType: getActivity('Movement'),
      teacher: getTeacher('Jake')
    },
    {
      title: 'Spanish Class with Veronica',
      description: '',
      dateStart: week.thursday.at(13),
      dateEnd: week.thursday.at(14),
      activityType: getActivity('Language'),
      teacher: getTeacher('Veronica')
    }
  ]

  // Mix in boilerplater and other operations
  liveSessionsData = liveSessionsData.map((liveSession: any) => {
    const session = {
      ...sessionBoilerplate,
      id,
      curriculumType: curriculumA,
      type: 'LiveClass',
      day: dayjs(liveSession.dateStart).format('dddd').toUpperCase(),
      ...liveSession
    }
    id++
    return session
  })

  let playdatesData = [
    {
      tutorialId: 'tutorial-playdate',
      title: 'Playdates with Miss Beth',
      description: 'Join your friends and socialize in our Educational Playdates! These 30 minute Zoom sessions are created to give children the opportunity to connect with peers, while learning.',
      dateStart: week.monday.at(13),
      dateEnd: week.monday.at(14),
      activityType: getActivity('Art'),
      teacher: getTeacher('Beth')
    },
    {
      title: 'Playdates with Miss Beth',
      description: '',
      dateStart: week.tuesday.at(11),
      dateEnd: week.tuesday.at(12),
      activityType: getActivity('Sensory'),
      teacher: getTeacher('Beth')
    },
    {
      title: 'Playdates with Miss Beth',
      description: '',
      dateStart: week.friday.at(11),
      dateEnd: week.friday.at(12),
      activityType: getActivity('Science'),
      teacher: getTeacher('Beth')
    }
  ]

  playdatesData = playdatesData.map((liveSession: any) => {
    const session = {
      ...sessionBoilerplate,
      id,
      curriculumType: curriculumA,
      type: 'Playdate',
      day: dayjs(liveSession.dateStart).format('dddd').toUpperCase(),
      ...liveSession
    }
    id++
    return session
  })

  const liveSessions = {
    total: liveSessionsData.length,
    filtered: liveSessionsData.length,
    limit: '100',
    page: '1',
    meetings: liveSessionsData.concat(playdatesData),
    block: false
  }

  return {
    liveSessions
  }
}
