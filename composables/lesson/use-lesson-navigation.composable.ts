import { ref, ComputedRef } from '@nuxtjs/composition-api'
import { Route } from 'vue-router'
import { VueRouter } from '@/types/vue-router'
import { Store } from 'vuex'

import { useChildren } from '@/composables/store'
import { useLessonGlobals } from './use-lesson-globals.composable'
import { useLessonApi } from './use-lesson-api.composable'
import { useLessonLoader } from './use-lesson-loader.composable'
import { useLessonRedirect } from './use-lesson-redirect.composable'

const loadingNext = ref<boolean>(false)

export const useLessonNavigation = ({ route, router, store }: { route: ComputedRef<Route>, router: VueRouter, store: Store<unknown> }) => {
  const { currentChild } = useChildren({ store })
  const lessonGlobals = useLessonGlobals()
  const lessonApi = useLessonApi({ child: currentChild })
  const { loadLesson } = useLessonLoader({ router, store })
  const { redirectLesson } = useLessonRedirect({ route, router }, lessonGlobals.isHistoryMode)

  const goToPreviousLesson = () => {
    if (lessonGlobals.lesson.value && lessonGlobals.previousLessonId.value) {
      const lessonId = lessonGlobals.previousLessonId.value.toString()
      router.push({
        name: 'app-lesson-lessonId',
        params: {
          lessonId
        }
      })
    }
  }

  const goToNextLesson = async () => {
    if (lessonGlobals.lesson.value && loadingNext.value === false) {
      loadingNext.value = true
      lessonGlobals.isPageLoading.value = true
      const currentLessonId = lessonGlobals.currentLessonId.value
      const nextLessonId = lessonGlobals.nextLessonId.value
      const lesson = lessonGlobals.lesson.value
      lessonGlobals.resetLessonGlobals()

      if (currentLessonId === lesson.id) {
        try {
          await lessonApi.advanceChildLesson()
          router.push({
            name: 'app-lesson-current'
          }, () => {
            if (!lessonGlobals.isHistoryMode.value) {
              loadLesson().then(() => {
                redirectLesson()
                lessonGlobals.isPageLoading.value = false
              })
            }
            loadingNext.value = false
          })
        } catch (e) {
          if (e && e.errorCode === 100) {
            router.push({
              name: 'app-all-done'
            },
            () => {
              loadingNext.value = false
            })
          }
        }
      } else {
        router.push({
          name: 'app-lesson-lessonId',
          params: {
            lessonId: nextLessonId!.toString()
          }
        },
        () => {
          loadingNext.value = false
        })
      }
    }
  }

  return {
    goToPreviousLesson,
    goToNextLesson
  }
}
