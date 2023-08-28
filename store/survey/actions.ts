import { actionTree } from 'typed-vuex'
import { CreateSurveyDto } from '@/composables/survey/useSurvey.composable'
import { state, mutations, getters } from '.'

export default actionTree(
  { state, mutations, getters },
  {
    async checkUserSurvey(_, surveyKey: string) {
      const count = await this.$axios.$get('/users/survey-count', {
        params: { survey: surveyKey }
      })
      return count > 0
    },

    async saveUserSurvey(_, createSurveyDto: CreateSurveyDto) {
      const survey = await this.$axios.$post('/users/survey', createSurveyDto)
      return survey
    }
  }
)
