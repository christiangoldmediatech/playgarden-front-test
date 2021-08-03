import { ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { Feedback } from '@/models'

export const useFeedback = () => {
  // const feedback = ref<Feedback>()
  const feedback = ref<Partial<Feedback>>({
    title: '',
    fedback: '',
    uploadWorksheetId: 0
  })

  const getFeedbackById = async (id:number) => {
    feedback.value = await axios.$get(`/feedbacks/${id}`)
  }

  const getFeedbackByUploadedWorksheetsId = async (id:number) => {
    feedback.value = await axios.$get(`/feedbacks/uploadWorksheetId/${id}`)
  }

  const saveFeedback = async ({ data }: {data: any}) => {
    feedback.value = await axios.$post('/feedbacks', data)
  }

  const updateFeedback = async (id:number, { data }: {data: any}) => {
    feedback.value = await axios.$patch(`/feedbacks/${id}`, data)
  }

  return {
    feedback,
    getFeedbackById,
    getFeedbackByUploadedWorksheetsId,
    saveFeedback,
    updateFeedback
  }
}
