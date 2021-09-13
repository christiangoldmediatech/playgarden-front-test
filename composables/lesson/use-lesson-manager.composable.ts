/*
  A top level composable for handling lesson loading, redirecting, and other related concerns.
  Should be implemented only at the top level page component of lessons,
  whether in current mode, history mode, or later on, in admin preview mode.
  All child components should be able to pull their neccessary data or redirect / load functionality from
  the appropiate composables
  TODO:
  Find a better structure for storing component unique composables; this component is only used by the
  current.vue and _lessonId.vue page components.
*/
import { ComputedRef, computed, onMounted, onBeforeUnmount } from '@nuxtjs/composition-api'
import { VueRouter } from '@/types/vue-router'
import { Route } from 'vue-router'
import { Store } from 'vuex'
import { useAppEventBusHelper, useGtmHelper } from '@/composables/helpers.composable'
import { APP_EVENTS, TAG_MANAGER_EVENTS } from '@/models'
import { useLessonGlobals } from './use-lesson-globals.composable'
import { useLessonLoader } from './use-lesson-loader.composable'
import { useLessonRedirect } from './use-lesson-redirect.composable'

export const useLessonManager = ({
  route,
  router,
  store
}: {
  router: VueRouter
  route: ComputedRef<Route>
  store: Store<unknown>
}) => {
  // Get a reference to lesson global variables and other utilities
  const lessonGlobals = useLessonGlobals()
  const { loadLesson, handleLessonLoadException } = useLessonLoader({
    router,
    store
  })

  // Determine if we are in history mode or not
  // Should only be needed on lesson page setup
  lessonGlobals.isHistoryMode.value = lessonGlobals.generateIsHistoryMode(route)

  // Get lesson redirect
  const { redirectLesson } = useLessonRedirect(
    { route, router },
    lessonGlobals.isHistoryMode
  )

  const $appEventBus = useAppEventBusHelper()
  const $gtm = useGtmHelper()
  const { lesson } = lessonGlobals
  const userInfo = computed(() => {
    return store.getters['auth/getUserInfo']
  })

  onMounted(() => {
    $appEventBus.$on(APP_EVENTS.DASHBOARD_ONLINE_WORKSHEET_CLICKED, () => {
      if (lesson.value && !lesson.value.previewMode) {
        $gtm.push({
          event: TAG_MANAGER_EVENTS.DASHBOARD_ONLINE_WORKSHEET_CLICKED,
          userId: userInfo.value.id,
          dayLetter: lesson.value.curriculumType.letter,
          dayNumber: `${lesson.value.day}`
        })
      }
    })
  })

  onBeforeUnmount(() => {
    $appEventBus.$off(APP_EVENTS.DASHBOARD_ONLINE_WORKSHEET_CLICKED)
  })

  const manageLesson = async () => {
    if (route.value.query.noReload) {
      // Redirect without reloading
      redirectLesson()
    } else {
      try {
        lessonGlobals.resetLessonGlobals()
        lessonGlobals.isPageLoading.value = true
        // Load the correct lesson and redirect the user
        await loadLesson()
        redirectLesson()
      } catch (error) {
        handleLessonLoadException(error)
      } finally {
        lessonGlobals.isPageLoading.value = false
      }
    }
  }

  manageLesson()
}
