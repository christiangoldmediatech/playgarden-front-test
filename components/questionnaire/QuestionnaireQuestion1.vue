<template>
  <div class="questionnaire">
    <div class="questionnaire-image">
      <img src="@/assets/jpg/questionnaire/bg-question-1.jpg" />
    </div>

    <div class="questionnaire-card">
      <div class="questionnaire-title pg-mb-5">
        {{ questionnaireState.question1.text }}
      </div>

      <div class="questionnaire-text pg-mb-6 lg:pg-mb-8">
        Select all that apply:
      </div>

      <div class="questionnaire-answers questionnaire-answers--checkboxes pg-mb-5 lg:pg-mb-16">
        <v-checkbox
          v-model="questionnaireState.question1.answer"
          v-for="(checkbox, checkboxIndex) in checkboxOptions"
          :key="`questionnaire-checkbox-${checkboxIndex}`"
          :value="checkbox"
          :label="checkbox"
          class="mt-0 pt-0 mb-3"
          off-icon="mdi-checkbox-blank-outline primary--text"
          hide-details
        />
      </div>

      <div class="questionnaire-button">
        <v-btn
          color="#B2E68D"
          class="white--text"
          :disabled="!questionnaireState.question1.answer.length"
          @click.stop="goToNextPage"
        >
          NEXT
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useQuestionnaire } from '@/composables/questionnaire/useQuestionnaire.composable'

export default defineComponent({
  name: 'QuestionnaireQuestion1',

  setup() {
    const { questionnaireState, goToNextPage } = useQuestionnaire()
    const checkboxOptions = questionnaireState.question1.options || []

    return {
      questionnaireState,
      checkboxOptions,
      goToNextPage
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/questionnaire';
</style>
