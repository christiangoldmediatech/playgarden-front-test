<template>
  <div class="pg-w-full pg-mx-6">
    <BackButton class="my-8" @click="goToPrevPage" />

    <QuestionnaireQuestion1 v-if="activeQuestionnairePage === 0" />
    <QuestionnaireQuestion2 v-if="activeQuestionnairePage === 1" />
    <QuestionnaireQuestion3 v-if="activeQuestionnairePage === 2" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import BackButton from '@/components/shared/BackButton/BackButton.vue'

import { useQuestionnaire } from '@/composables/questionnaire/useQuestionnaire.composable'
import QuestionnaireQuestion1 from '@/components/questionnaire/QuestionnaireQuestion1.vue'
import QuestionnaireQuestion2 from '@/components/questionnaire/QuestionnaireQuestion2.vue'
import QuestionnaireQuestion3 from '@/components/questionnaire/QuestionnaireQuestion3.vue'

export default defineComponent({
  name: 'Questionnaire',

  components: {
    BackButton,
    QuestionnaireQuestion1,
    QuestionnaireQuestion2,
    QuestionnaireQuestion3
  },

  setup() {
    const { activeQuestionnairePage, goToPrevPage } = useQuestionnaire()

    return {
      activeQuestionnairePage,
      goToPrevPage
    }
  }
})
</script>
