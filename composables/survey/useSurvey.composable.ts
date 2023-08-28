import { Store } from 'vuex/types'

export type SurveyQuestion = {
  type: 'CHECKBOX' | 'RADIO'
  text: string;
  instructions: string;
  options: string[]
  answer: string | string[]
  order: number
}

export type SurveyPage = {
  pageName: string
  pageTime: number
  questions: SurveyQuestion[]
  order: number
}

export type CreateSurveyDto = {
  surveyKey: string
  surveyData: SurveyPage[]
}

export const useSurvey = ({ store }:{ store: Store<unknown> }) => {
  function checkUserSurvey(surveyKey: string) {
    return store.dispatch('survey/checkUserSurvey', surveyKey)
  }

  function saveUserSurvey(createSurveyDto: CreateSurveyDto) {
    return store.dispatch('survey/saveUserSurvey', createSurveyDto)
  }

  return {
    checkUserSurvey,
    saveUserSurvey
  }
}
