// Lesson global variables to be used in a lesson page, to supply all components with needed lesson data and reduce instantiation
import { ref, ComputedRef } from '@nuxtjs/composition-api'
import { Route } from 'vue-router'
import { Lesson } from '@/models'
import { GeneratedLessonVideos, useLessonVideos } from './use-lesson-videos.composable'
import { GeneratedLessonWorksheets, useLessonWorksheets } from './use-lesson-worksheets.composable'
import { GeneratedLessonActivities, useLessonActivities } from './use-lesson-activities.composable'
import { useLessonCompleted } from './use-lesson-completed.composable'

// Functions for generating computed values of lesson variables
const { generateLessonVideos } = useLessonVideos()
const { generateLessonWorksheets } = useLessonWorksheets()
const { generateLessonActivities } = useLessonActivities()
const { generateLessonCompleted } = useLessonCompleted()

// Global variables for storing and computing lesson globals within lesson pages
// loading
const isPageLoading = ref<boolean>(false)

// history mode boolean
const isHistoryMode = ref<boolean>(false)
const generateIsHistoryMode = (route: ComputedRef<Route>): boolean => {
  return Boolean(
    route.value.matched.find(({ name }) => name === 'app-lesson-lessonId')
  )
}

// Lesson holder variable
const lesson = ref<Lesson | undefined>(undefined)

// current, prev and next lessonId
// The lessonId of the child's most advanced lesson
const currentLessonId = ref<number | undefined>(undefined)

// The lessonId prior to the currently loadded one
const previousLessonId = ref<number | undefined>(undefined)

// The lessonId of the lesson next to the currently loaded one
const nextLessonId = ref<number | undefined>(undefined)

// generate lesson global variables
const lessonVideos = ref<GeneratedLessonVideos>(generateLessonVideos(lesson))
const lessonWorksheets = ref<GeneratedLessonWorksheets>(generateLessonWorksheets(lesson))
const lessonActivities = ref<GeneratedLessonActivities>(generateLessonActivities(lesson))
const lessonCompleted = ref<boolean>(generateLessonCompleted({ lessonVideos, lessonWorksheets, lessonActivities }))

const puzzlePiece = ref<unknown>(undefined)

const resetLessonGlobals = () => {
  lesson.value = undefined
  currentLessonId.value = undefined
  previousLessonId.value = undefined
  nextLessonId.value = undefined
  lessonVideos.value = generateLessonVideos(lesson)
  lessonWorksheets.value = generateLessonWorksheets(lesson)
  lessonActivities.value = generateLessonActivities(lesson)
  lessonCompleted.value = generateLessonCompleted({ lessonVideos, lessonWorksheets, lessonActivities })
  puzzlePiece.value = undefined
}

// Function to return global constants
export const useLessonGlobals = () => {
  return {
    isPageLoading,
    isHistoryMode,
    lesson,
    currentLessonId,
    previousLessonId,
    nextLessonId,
    lessonVideos,
    lessonWorksheets,
    lessonActivities,
    lessonCompleted,
    puzzlePiece,
    resetLessonGlobals,
    generateIsHistoryMode
  }
}

export type LessonGlobals = ReturnType<typeof useLessonGlobals>
