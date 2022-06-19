/* eslint-disable no-use-before-define */
import { OfflineWorksheetLesson, Child, UploadedOfflineWorksheet } from '@/models'
import { axios } from '@/utils'
import { Store } from 'vuex/types'

export const useOfflineWorksheet = ({ store }: { store: Store<unknown> }) => {
  interface UploadParams {
    lessonId: number
    childId: number
    file: File
  }
  interface DocumentParamsGetFile {
    type?: string
    folder: string
    filename: string,
    files?: any[]
  }

  interface OfflineWorksheetProgress {
    lessonId: number
    childId: number
    offlineWorksheetId: number
    completed: boolean
    date?: Date
  }

  const uploadWorksheet = async ({ lessonId, childId, file }: UploadParams) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await store.dispatch(
        'upload/doUpload',
        {
          type: 'upload-image',
          path: 'offline-worksheet',
          formData
        },
        { root: true }
      )

      const data = await axios.$post('/worksheets/upload/lesson', {
        lessonId,
        childrenId: childId,
        url: response.filePath
      })

      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const getFileUpload = async ({ type, folder, filename } : DocumentParamsGetFile) => {
    try {
      const data = await axios.$get(`/files/${type}/${folder}/${filename}`)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const mergeFilesOfflineLesson = async ({ files, folder, filename } : DocumentParamsGetFile) => {
    try {
      const data = await axios.$post(`/files/upload-document/merge/${folder}/multiple`, {
        files,
        fileName: filename
      })
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const saveOfflineWorksheetProgress = async ({
    lessonId,
    childId,
    completed,
    offlineWorksheetId,
    date = new Date()
  }: OfflineWorksheetProgress): Promise<unknown> => {
    try {
      const { data } = await axios.$post(
        `/lessons/${lessonId}/children/${childId}/worksheet`,
        {
          worksheet: {
            id: offlineWorksheetId,
            completed,
            date: date.toISOString().substring(0, 19)
          }
        }
      )
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const getUploaded = (childId: number, lessonId: number): Promise<UploadedOfflineWorksheet[]> => {
    return axios.$get(`/worksheets/children/${childId}/lesson/${lessonId}`)
  }

  const getOfflineWorksheetsByChildId = (
    childId: number
  ): Promise<OfflineWorksheetLesson[]> => {
    return axios.$get(`worksheets/children/${childId}/by-lesson`)
  }

  const getChild = (childId: number): Promise<Child> => {
    return axios.$get(`/children/${childId}`)
  }

  const removeUploadedOfflineWorksheet = (uploadedOfflineWorksheetId: number): Promise<void> => {
    return axios.$delete(`/worksheets/upload/${uploadedOfflineWorksheetId}`)
  }

  return {
    uploadWorksheet,
    saveOfflineWorksheetProgress,
    getUploaded,
    getChild,
    getOfflineWorksheetsByChildId,
    removeUploadedOfflineWorksheet,
    getFileUpload,
    mergeFilesOfflineLesson
  }
}
