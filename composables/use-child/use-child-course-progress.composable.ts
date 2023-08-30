import { ChildProgress } from '@/models'
import { axios } from '@/utils'

export const useChildCourseProgress = () => {
  const getCourseProgressByChildId = (
    id: number | number[],
    curriculumTypeId: number | null = null
  ): Promise<ChildProgress[]> => {
    const isIdArray = Array.isArray(id)
    const idToSend = isIdArray ? (id as number[])[0] : id

    let route = `/children/${idToSend}/progress`
    route += curriculumTypeId ? `/${curriculumTypeId}` : ''

    return axios.$get(route, {
      params: {
        childrenIds: isIdArray ? id : [id]
      }
    })
  }

  return {
    getCourseProgressByChildId
  }
}
