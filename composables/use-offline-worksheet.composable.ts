/* eslint-disable no-use-before-define */
import { OfflineWorksheet } from '@/models'
import { axios } from '@/utils'
import { Store } from 'vuex/types'

export const useOfflineWorksheet = ({
  store
}: {
  store: Store<unknown>
}) => {
  interface UploadParams {
    lessonId: number
    childrenId: number
    categoryId: number
    File: File
  }

  const upload = async ({ lessonId, childrenId, categoryId, File }: UploadParams) => {
    try {
      const formData = new FormData()
      formData.append('file', File)

      const response = await store.dispatch('upload/doUpload', {
        type: 'upload-document',
        path: 'offline-worksheet',
        formData
      }, { root: true })

      const data = await axios.$post('/worksheets/upload', {
        lessonId,
        childrenId,
        categoryId,
        url: response.filePath
      })

      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const getUploaded = (childId: number): Promise<OfflineWorksheet[]> => {
    return axios.$get(`/worksheets/children/${childId}`)
  }

  const getUploadedByLesson = (lessonId: number): Promise<OfflineWorksheet[]> => {
    return axios.$get(`/worksheets/children/${lessonId}`)
  }

  return {
    upload,
    getUploaded,
    getUploadedByLesson
  }
}
