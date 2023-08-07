import { Store } from 'vuex/types'
import { ref, reactive } from '@nuxtjs/composition-api'
import { CreateSurveyDto, SurveyQuestion, useSurvey } from '@/composables/survey/useSurvey.composable'

const questionnaireSurveyKey = 'POST-LOGIN-QUESTIONNAIRE'
const activeQuestionnairePage = ref(0)
const isSaving = ref(false)

const questPageData = reactive<CreateSurveyDto['surveyData']>([
  {
    pageName: 'Questionnaire - Page 1',
    pageTime: 0,
    questions: [],
    order: 0
  },
  {
    pageName: 'Questionnaire - Page 2',
    pageTime: 0,
    questions: [],
    order: 1
  },
  {
    pageName: 'Questionnaire - Page 3',
    pageTime: 0,
    questions: [],
    order: 2
  }
])

const questDataState = reactive<Record<string, SurveyQuestion>>({
  question1: {
    text: 'Which components of Playgarden Online do you plan on using?',
    instructions: 'Select all that apply:',
    type: 'CHECKBOX',
    options: [
      'Structured Online Preschool Lessons',
      'Live Zoom Classes',
      'Printable Worksheets',
      'Educational videos to replace TV'
    ],
    answer: [],
    order: 0
  },
  question2: {
    text: 'How often do you plan on using Playgarden Online?',
    instructions: 'Please tell us how many days a week do you expect to use Playgarden Online',
    type: 'RADIO',
    options: ['1 day per week or less', '1-2 days per week', '3-4 days per week', '5 days per week'],
    answer: '',
    order: 0
  },
  question3: {
    text: 'Has your child attended an online learning program before?',
    instructions: '',
    type: 'RADIO',
    options: ['Yes', 'No'],
    answer: '',
    order: 0
  },
  question4: {
    text: 'Would you like to assess your child\'s progress for free using our partner, Cognitive Toybox?',
    instructions: '',
    type: 'RADIO',
    options: ['Yes', 'No'],
    answer: '',
    order: 1
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

function resetQuestionnaire() {
  activeQuestionnairePage.value = 0
  questDataState.question1.answer = []
  questDataState.question2.answer = ''
  questDataState.question3.answer = ''
  questDataState.question4.answer = ''
}

export const useQuestionnaire = () => {
  return {
    activeQuestionnairePage,
    questPageData,
    questDataState,
    isSaving,
    resetQuestionnaire,
    goToNextPage,
    goToPrevPage
  }
}

export const useQuestionnaireSave = ({ store }:{ store: Store<unknown> }) => {
  const { checkUserSurvey, saveUserSurvey } = useSurvey({ store })

  const handleSave = async () => {
    try {
      isSaving.value = true
      const hasUserAnsweredSurvey = await checkUserSurvey(questionnaireSurveyKey)

      if (hasUserAnsweredSurvey) {
        return
      }

      // Add questions to pages
      questPageData[0].questions = [questDataState.question1]
      questPageData[1].questions = [questDataState.question2]
      questPageData[2].questions = [questDataState.question3, questDataState.question4]

      await saveUserSurvey({
        surveyKey: questionnaireSurveyKey,
        surveyData: questPageData
      })
    } finally {
      isSaving.value = false
    }
  }

  return {
    isSaving,
    handleSave
  }
}
