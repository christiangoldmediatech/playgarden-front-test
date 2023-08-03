import { actionTree } from 'typed-vuex'
import { state, mutations, getters } from '.'

type CreateSurveyDto = {
  survey: string
  text: string
  type: 'CHECKBOX' | 'RADIO'
  options?: string[],
  answer: string[] | string
}

export default actionTree(
  { state, mutations, getters },
  {
    async checkUserSurvey(_, survey: string) {
      const count = await this.$axios.$get('/users/survey-count', {
        params: { survey }
      })
      return count > 0
    },

    async createUserSurvey(_, createSurveyDto: CreateSurveyDto) {
      const survey = await this.$axios.$post('/users/survey', createSurveyDto)
      return survey
    },

    async createUserSurveyGroup({ dispatch }, createSurveyGroupDto: CreateSurveyDto[]) {
      const promises = createSurveyGroupDto.map((createSurveyDto) => {
        return dispatch('createUserSurvey', createSurveyDto)
      })
      const result = await Promise.allSettled(promises)
      return result
    }
  }
)
