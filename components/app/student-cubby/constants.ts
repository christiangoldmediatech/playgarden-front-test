import { StudentCubbyItem } from '@/components/app/student-cubby/types'

const DEFAULT_IMAGE_HEIGHT = '80px'
export const studentCubbyItems: StudentCubbyItem[] = [
  {
    text: 'PUZZLE',
    title: 'STUDENTS CUBBY',
    imgName: 'puzzle-piece.png',
    imageHeight: DEFAULT_IMAGE_HEIGHT,
    routeName: 'app-student-cubby-puzzle',
    blockedPlanIds: [1],
    description: (childName: string | undefined) => {
      const name = childName || 'Child'
      return `Find all of ${name}'s completed puzzles. Share them on social media!`
    }
  },
  {
    text: 'PATCHES',
    title: 'Earn Activity Patches for learning',
    imgName: 'patches.svg',
    imageHeight: DEFAULT_IMAGE_HEIGHT,
    routeName: 'app-student-cubby-patches',
    blockedPlanIds: [],
    description: `Master subjects in the Activities section to collect patches for
            your Student Cubby! Collect all badges to receive a real patch for
            your backpack.`
  },
  {
    text: 'CURRICULUM',
    title: 'Review all Curriculum',
    imgName: 'abc.png',
    imageHeight: DEFAULT_IMAGE_HEIGHT,
    routeName: 'app-student-cubby-course-progress',
    blockedPlanIds: [1],
    description: 'Scroll through to review your lessons and worksheets!'
  },
  {
    text: 'PORTFOLIO',
    title: 'PORTFOLIO',
    imgName: 'group.png',
    imageHeight: DEFAULT_IMAGE_HEIGHT,
    routeName: 'app-student-cubby-student-portfolio',
    blockedPlanIds: [1],
    description: 'Keep track of your worksheets and progress!'
  },
  {
    text: 'PROGRESS REPORT',
    title: 'Student progress report',
    imgName: 'progress.png',
    imageHeight: '40px',
    routeName: 'app-student-cubby-progress-report',
    blockedPlanIds: [1],
    description: `Playgarden Prep Online Lessons have been developed to support one or more of the core areas of development.
            After watching a video, doing the worksheet together with an adult, or actively participating in a Live Class,
            parents will be helping in the development of their child in each of the specific areas.`
  }
]
