import { ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { Feedback } from '@/models'

export const useFeedback = () => {
  const feedback = ref<Feedback>()

  const getFeedbackById = async (id:number) => {
    feedback.value = await axios.$get(`/feedbacks/${id}`)
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
    saveFeedback,
    updateFeedback
  }
}
