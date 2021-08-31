import { ComputedRef } from '@nuxtjs/composition-api'
import { Route, Location, RawLocation } from 'vue-router'

export const useLessonRoute = ({ route }: { route: ComputedRef<Route> }) => {
  const generateLessonRoute = ({ name, params, query }: Location): RawLocation => {
    const result = { name: '', params, query }
    // Create default route prefix for lesson history mode
    let prefix = 'app-lesson-lessonId'

    if (route.value.matched.find(({ name }) => name === 'app-lesson-current')) {
      // If we are in current lesson mode, create a current lesson route
      prefix = 'app-lesson-current'
    } else if (route.value.matched.find(({ name }) => name === 'admin-curriculum-management-lessonId-preview')) {
      // If we are in admin preview mode, create a current lesson route
      prefix = 'admin-curriculum-management-lessonId-preview'
    }

    result.name = `${prefix}-${name}`

    return result
  }

  return {
    generateLessonRoute
  }
}
