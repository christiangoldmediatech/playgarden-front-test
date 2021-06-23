import { axios } from '@/utils'

export const useChildCourseProgress = () => {
  const getCourseProgressByChildId = (id: number, curriculumTypeId: number | null = null) => {
    let route = `/children/${id}/progress`
    route += curriculumTypeId ? `/${curriculumTypeId}` : ''

    return axios.$get(route)
  }

  return {
    getCourseProgressByChildId
  }
}
