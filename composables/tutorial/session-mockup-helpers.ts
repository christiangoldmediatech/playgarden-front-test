import dayjs from 'dayjs'
import { axios } from '@/utils'

// Week types and object
type WeekDays = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'

type Week = {
  [key in WeekDays]: {
    at: (hour: number, minutes?: number) => string
  }
}

const weekStart = dayjs().startOf('week')
const week = {} as unknown as Week

for (let i = 1; i <= 6; i++) {
  const day = dayjs(weekStart).add(i, 'days')
  week[day.format('dddd').toLowerCase() as WeekDays] = {
    at: (hours, minutes = 0) => {
      return day.add(hours, 'hours').add(minutes, 'minutes').toISOString()
    }
  }
}

// Session boilerplate, data we don't have to generate
export const sessionBoilerplate = {
  duration: 60,
  link: 'zoom.com',
  password: null,
  teacherName: null,
  ages: 'All ages',
  inCollaborationWith: null,
  meetingId: 'zoom.com',
  active: true,
  cancelled: false,
  sendCancellationEmail: true,
  cancellationDate: null,
  cancellationReason: null,
  file: null,
  spots: 0,
  createdBy: '1', // or '1',
  createdAt: '2023-08-26T00:23:06.580Z',
  updatedAt: '2023-08-26T00:34:25.000Z',
  deletedAt: null,
  videos: null,
  meetingsChildren: [],
  backpackImages: []
}

export async function getDataForLiveClases() {
  const [curriculumTypes, activityTypes, teachersList] = await Promise.all([
    axios.$get('/curriculum-types'),
    axios.$get('/activities'),
    axios.$get('/teachers')
  ])

  // Format data to match return types from live sessions
  const curriculums = curriculumTypes.map(({ id, name, description, icon, letter, picture, order, createdAt, updatedAt, deletedAt }: any) => {
    return { id, name, description, icon, letter, picture, order, createdAt, updatedAt, deletedAt }
  })

  const activities = activityTypes.activities.map(({ id, name, description, type, icon, color, createdAt, updatedAt, deletedAt }: any) => {
    return { id, name, description, type, icon, color, createdAt, updatedAt, deletedAt }
  })

  const teacherTitles = ['Miss', 'Ms', 'Mrs', 'Mr', 'Teacher']
  const teachers = teachersList
    .map(({ id, name, img, createdAt, updatedAt, deletedAt }: any) => {
      return { id, name, img, createdAt, updatedAt, deletedAt }
    })
    .filter((teacher: any) => {
      return teacherTitles.some((title) => {
        return teacher.name.includes(title)
      })
    })

  // Getter functions
  function getCurriculum(curriculumName: string = 'Aa') {
    return curriculums.find((curriculum: any) => curriculum.name === curriculumName) || curriculums[0]
  }

  function getActivity(activityName: string) {
    return activities.find((acitivityType: any) => acitivityType.name === activityName) || activities[0]
  }

  function getTeacher(teacherName: string) {
    return teachers.find((teacher: any) => teacher.name.includes(teacherName)) || teachers[0]
  }

  return {
    getCurriculum, getActivity, getTeacher, week
  }
}
