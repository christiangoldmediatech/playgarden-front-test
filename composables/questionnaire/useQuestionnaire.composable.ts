import { Store } from 'vuex/types'
import { ref, reactive } from '@nuxtjs/composition-api'

const activeQuestionnairePage = ref(0)
const isSaving = ref(false)

export type SurveyAnswer = {
  text: string
  type: 'CHECKBOX' | 'RADIO'
  options?: string[],
  answer: string[] | string
}

const questionnaireState = reactive<Record<string, SurveyAnswer>>({
  question1: {
    text: 'Which components of Playgarden Online do you plan on using?',
    type: 'CHECKBOX',
    options: [
      'Structured Online Preschool Lessons',
      'Live Zoom Classes',
      'Printable Worksheets',
      'Educational videos to replace TV'
    ],
    answer: []
  },
  question2: {
    text: 'How often do you plan on using Playgarden Online?',
    type: 'RADIO',
    options: ['1 day per week or less', '1-2 days per week', '3-4 days per week', '5 days per week'],
    answer: ''
  },
  question3: {
    text: 'Has your child attended an online learning program before?',
    type: 'RADIO',
    options: ['Yes', 'No'],
    answer: ''
  },
  question4: {
    text: 'Would you like to assess your child\'s progress for free using our partner, Cognitive Toybox?',
    type: 'RADIO',
    options: ['Yes', 'No'],
    answer: ''
  }
})

function goToNextPage() {
  if (activeQuestionnairePage.value < 2) {
    activeQuestionnairePage.value++
  }
}

function goToPrevPage() {
  if (activeQuestionnairePage.value > 0) {
    activeQuestionnairePage.value--
  }
}

export const useQuestionnaire = () => {
  return {
    activeQuestionnairePage,
    questionnaireState,
    isSaving,
    goToNextPage,
    goToPrevPage
  }
}

export const useQuestionnaireSave = ({ store }:{ store: Store<unknown> }) => {
  const handleSave = async () => {
    const questionnaireId = 'POST-LOGIN-QUESTIONNAIRE'
    try {
      isSaving.value = true
      const hasUserAnsweredSurvey = await store.dispatch('survey/checkUserSurvey', questionnaireId)

      if (hasUserAnsweredSurvey) {
        return
      }

      const questions = [
        questionnaireState.question1,
        questionnaireState.question2,
        questionnaireState.question3,
        questionnaireState.question4
      ]

      store.dispatch('survey/createUserSurveyGroup', questions.map((question) => ({ ...question, survey: questionnaireId })))
    } finally {
      isSaving.value = false
    }
  }

  return {
    isSaving,
    handleSave
  }
}
