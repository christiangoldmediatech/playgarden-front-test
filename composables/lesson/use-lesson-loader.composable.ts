// This composable will return a lesson loader function
// that will populate global lesson variables with the loaded lesson
import { VueRouter } from '@/types/vue-router'
import { Store } from 'vuex'
import { useChildren } from '@/composables/store/use-children.composable'
import { useLessonApi } from './use-lesson-api.composable'
import { useLessonGlobals } from './use-lesson-globals.composable'
import { useLessonVideos } from './use-lesson-videos.composable'
import { useLessonWorksheets } from './use-lesson-worksheets.composable'
import { useLessonActivities } from './use-lesson-activities.composable'
import { useLessonCompleted } from './use-lesson-completed.composable'

export const useLessonLoader = ({ router, store }: { router: VueRouter, store: Store<unknown>}) => {
  const children = useChildren({ store })
  const lessonApi = useLessonApi({ child: children.currentChild })
  const lessonGlobals = useLessonGlobals()

  // Functions for updating lesson global formatted data
  const { generateLessonVideos } = useLessonVideos()
  const { generateLessonWorksheets } = useLessonWorksheets()
  const { generateLessonActivities } = useLessonActivities()
  const { generateLessonCompleted } = useLessonCompleted()

  const loadLesson = async () => {
    try {
      let data
      if (lessonGlobals.isHistoryMode.value) {
        const route = router.currentRoute
        data = await lessonApi.getChildsLessonById(route.params.lessonId)
      } else {
        data = await lessonApi.getChildsCurrentLesson()
      }

      // Updat basic lesson data
      lessonGlobals.lesson.value = data?.lesson
      lessonGlobals.currentLessonId.value = data?.currentLessonId
      lessonGlobals.nextLessonId.value = data?.nextLessonId
      lessonGlobals.previousLessonId.value = data?.previousLessonId

      // Update lesson formatted data
      lessonGlobals.lessonVideos.value = generateLessonVideos(lessonGlobals.lesson)
      lessonGlobals.lessonWorksheets.value = generateLessonWorksheets(lessonGlobals.lesson)
      lessonGlobals.lessonActivities.value = generateLessonActivities(lessonGlobals.lesson)
      lessonGlobals.lessonCompleted.value = generateLessonCompleted({
        lessonVideos: lessonGlobals.lessonActivities,
        lessonWorksheets: lessonGlobals.lessonWorksheets,
        lessonActivities: lessonGlobals.lessonActivities
      })

      // Update puzzle data
      lessonGlobals.puzzlePiece.value = data?.puzzleChildren
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const handleLessonLoadException = (exception: any) => {
    if (exception && exception.response) {
      const { data } = exception.response
      if (data.errorCode === 100 && !lessonGlobals.isHistoryMode.value) {
        router.push({ name: 'app-all-done' })
      }
    }
  }

  return {
    loadLesson,
    handleLessonLoadException
  }
}
