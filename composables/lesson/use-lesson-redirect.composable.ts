import { ComputedRef, Ref } from '@nuxtjs/composition-api'
import { Route } from 'vue-router'
import { VueRouter } from '@/types/vue-router'
import { useLessonGlobals, useLessonRoute, useLessonFinders } from '@/composables'

export const useLessonRedirect = (
  { route, router } : { route: ComputedRef<Route>, router: VueRouter },
  isHistoryMode: Ref<boolean>
) => {
  // get lesson globals
  const { lesson, currentLessonId, lessonVideos, lessonWorksheets, lessonActivities, lessonCompleted } = useLessonGlobals()
  const { generateLessonRoute } = useLessonRoute({ route })
  const { getNextLessonVideoId, getNextLessonActivityId } = useLessonFinders()

  const redirectLesson = (): void => {
    if (lesson.value) {
      if (isHistoryMode.value && lesson.value.id === currentLessonId.value) {
        // If we have loaded the current lesson, redirect to app-lesson-current without reloading
        router.push({
          name: 'app-lesson-current',
          query: { noReload: 'true' }
        })
        return
      }

      // Find the route we need to go to next
      let route
      const params = { lessonId: lesson.value.id.toString() }

      if (lessonVideos.value.progress < 100 && lessonVideos.value.items.length) {
        // Redirect to next video if we haven't finished all lesson videos
        route = generateLessonRoute({
          name: 'videos',
          params,
          query: {
            id: getNextLessonVideoId(lessonVideos)?.toString()
          }
        })
      } else if (lessonWorksheets.value.progress < 100 && lessonWorksheets.value.ONLINE) {
        // Redirect to worksheets if we haven't finished online-worksheets
        route = generateLessonRoute({ name: 'online-worksheet', params })
      } else if (lessonActivities.value.progress < 100 && lessonActivities.value.items.length) {
        // Redirect to next activity, if activities have not been finished
        route = generateLessonRoute({
          name: 'activities',
          params,
          query: {
            id: getNextLessonActivityId(lessonActivities)?.toString()
          }
        })
      } else if (isHistoryMode.value && lessonCompleted.value) {
        // If in history mode, and lesson is completed, go to first video
        route = generateLessonRoute({
          name: 'videos',
          params,
          query: {
            id: getNextLessonVideoId(lessonVideos)?.toString()
          }
        })
      } else if (!isHistoryMode.value && lessonCompleted.value) {
        // if we are app lesson current, and lesson is completed
        route = generateLessonRoute({ name: 'completed', params })
      }

      // If we have a route, push it
      if (route) {
        router.push(route)
      }
    } else {
      // eslint-disable-next-line no-console
      console.error('Attempting to redirect error before lesson has been loaded.')
    }
  }
  return { redirectLesson }
}
