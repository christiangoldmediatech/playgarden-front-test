import { ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { Feedback } from '@/models'

export const useFeedback = () => {
  const feedback = ref<Partial<Feedback>>({
    title: '',
    feedback: '',
    uploadedWorksheetId: 0
  })

  const getFeedbackById = async (id:number) => {
    feedback.value = await axios.$get(`/feedbacks/${id}`)
  }

  const getFeedbackByUploadedWorksheetsId = async (id:number) => {
    const data = await axios.$get(`/feedbacks/uploadWorksheet/${id}`)
    if (data) {
      feedback.value = data
    }
  }

  const saveFeedback = async ({ data }: { data: Feedback }) => {
    feedback.value = await axios.$post('/feedbacks', data)
  }

  const updateFeedback = async (id: number, { data }: { data: Partial<Feedback> }) => {
    feedback.value = await axios.$patch(`/feedbacks/${id}`, {
      title: data.title,
      feedback: data.feedback,
      uploadedWorksheetId: data.uploadedWorksheetId
    })
  }

  return {
    feedback,
    getFeedbackById,
    getFeedbackByUploadedWorksheetsId,
    saveFeedback,
    updateFeedback
  }
}
