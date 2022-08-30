// Refactor of DashboardLinkMixin and DashboardOverridesMixin
import { ref, Ref, useRoute, computed, ComputedRef } from '@nuxtjs/composition-api'

type DashboardLinkParameters = {
  route: ReturnType<typeof useRoute>,
  lesson: ComputedRef<any>,
  customOverrides?: Ref<any>
}

export const useDashboardLink = ({ route, lesson, customOverrides = ref({}) }: DashboardLinkParameters) => {
  const overrides = computed(() => {
    const others = customOverrides.value
    return {
      childId: route.value.query.childId,
      lessonId: route.value.query.lessonId,
      ...others
    }
  })

  function generateDashboardRoute (name: string, queryParams: any = {}) {
    let prefix = 'app-dashboard'
    let params

    if (lesson.value.previewMode) {
      prefix = 'admin-curriculum-management-lessonId-preview'
      params = { lessonId: route.value.params.lessonId }
    }

    return {
      name: `${prefix}-${name}`,
      params,
      query: { ...overrides.value, ...queryParams }
    }
  }

  return {
    overrides,
    generateDashboardRoute
  }
}
