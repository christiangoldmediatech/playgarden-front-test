import dayjs from 'dayjs'
import { sessionBoilerplate, getDataForLiveClases } from './session-mockup-helpers'

export const useLiveClassesTutorial = async (i18n: any) => {
  const $localT = (prefix: string) => {
    return i18n.t(`LocalComponentTranslations.tutorial.liveClasses.mockup.${prefix}`) as string
  }

  const { getCurriculum, getActivity, getTeacher, week } = await getDataForLiveClases()
  const curriculumA = getCurriculum()
  let id = 1000

  let liveSessionsData = [
    {
      tutorialId: 'tutorial-music-live-session',
      title: $localT('liveClass1Title'),
      description: $localT('liveClass1Description'),
      dateStart: week.monday.at(11),
      dateEnd: week.monday.at(12),
      activityType: getActivity('Music'),
      teacher: getTeacher('Sarah')
    },
    {
      tutorialId: 'tutorial-art-live-session',
      title: $localT('liveClass2Title'),
      description: $localT('liveClass2Description'),
      dateStart: week.monday.at(15),
      dateEnd: week.monday.at(16),
      activityType: getActivity('Art'),
      teacher: getTeacher('Canitra')
    },
    {
      title: $localT('liveClass3Title'),
      description: '',
      dateStart: week.wednesday.at(13),
      dateEnd: week.wednesday.at(14),
      activityType: getActivity('Movement'),
      teacher: getTeacher('Katryna')
    },
    {
      title: $localT('liveClass4Title'),
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
      title: $localT('playdate1Title'),
      description: $localT('playdateDescription'),
      dateStart: week.monday.at(13),
      dateEnd: week.monday.at(14),
      activityType: getActivity('Math'),
      teacher: getTeacher('Gabby')
    },
    {
      title: $localT('playdate2Title'),
      description: $localT('playdateDescription'),
      dateStart: week.tuesday.at(11),
      dateEnd: week.tuesday.at(12),
      activityType: getActivity('Sensory'),
      teacher: getTeacher('Katryna')
    },
    {
      title: $localT('playdate2Title'),
      description: $localT('playdateDescription'),
      dateStart: week.friday.at(11),
      dateEnd: week.friday.at(12),
      activityType: getActivity('Science'),
      teacher: getTeacher('Katryna')
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
