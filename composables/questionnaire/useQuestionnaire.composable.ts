import { Store } from 'vuex/types'
import { ref, reactive } from '@nuxtjs/composition-api'
import { CreateSurveyDto, SurveyQuestion, useSurvey } from '@/composables/survey/useSurvey.composable'
import enLocale from '@/components/questionnaire/locales/questionnaire.en.locale'

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
    text: enLocale.question1.text,
    instructions: enLocale.question1.instructions,
    type: 'CHECKBOX',
    options: enLocale.question1.options,
    answer: [],
    order: 0
  },
  question2: {
    text: enLocale.question2.text,
    instructions: enLocale.question2.instructions,
    type: 'RADIO',
    options: enLocale.question2.options,
    answer: '',
    order: 0
  },
  question3: {
    text: enLocale.question3.text,
    instructions: enLocale.question3.instructions,
    type: 'RADIO',
    options: enLocale.question3.options,
    answer: '',
    order: 0
  },
  question4: {
    text: enLocale.question4.text,
    instructions: enLocale.question4.instructions,
    type: 'RADIO',
    options: enLocale.question4.options,
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
