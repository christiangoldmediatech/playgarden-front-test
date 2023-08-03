<template>
  <div class="questionnaire lg:pg-max-w-[1300px]">
    <div class="questionnaire-image">
      <img src="@/assets/jpg/questionnaire/bg-question-2.jpg" />
    </div>

    <div class="questionnaire-card">
      <div class="questionnaire-title pg-mb-5">
        {{ questionnaireState.question2.text }}
      </div>

      <div class="questionnaire-text og-mb-6 lg:pg-mb-8">
        Please tell us how many days a week do you expect to use Playgarden Online
      </div>

      <div class="questionnaire-answers questionnaire-answers__days-per-week pg-mb-5 lg:pg-mb-16">
        <div
          class="option-card"
          :class="{ 'option-card--selected': questionnaireState.question2.answer === `${radioOptions[0] || ''}` }"
          @click="() => handleClick(radioOptions[0])"
        >
          <div class="pg-flex pg-h-full pg-items-center pg-justify-center">
            <img src="@/assets/png/questionnaire/days-per-week-option-1.png" />
          </div>
          DAY PER WEEK OR LESS
        </div>

        <div
          class="option-card option-card--double"
          :class="{ 'option-card--selected': questionnaireState.question2.answer === radioOptions[1] }"
          @click="() => handleClick(radioOptions[1])"
        >
          <div class="pg-flex pg-h-full pg-items-center pg-justify-center">
            <img src="@/assets/png/questionnaire/days-per-week-option-2.png" />
          </div>
          DAYS PER WEEK
        </div>

        <div
          class="option-card option-card--double"
          :class="{ 'option-card--selected': questionnaireState.question2.answer === radioOptions[2] }"
          @click="() => handleClick(radioOptions[2])"
        >
          <div class="pg-flex pg-h-full pg-items-center pg-justify-center">
            <img src="@/assets/png/questionnaire/days-per-week-option-3.png" />
          </div>
          DAYS PER WEEK
        </div>

        <div
          class="option-card"
          :class="{ 'option-card--selected': questionnaireState.question2.answer === radioOptions[3] }"
          @click="() => handleClick(radioOptions[3])"
        >
          <div class="pg-flex pg-h-full pg-items-center pg-justify-center">
            <img src="@/assets/png/questionnaire/days-per-week-option-4.png" />
          </div>
          DAYS PER WEEK
        </div>
      </div>

      <div class="questionnaire-button">
        <v-btn
          color="#B2E68D"
          class="white--text"
          :disabled="!questionnaireState.question2.answer"
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
  name: 'QuestionnaireQuestion2',

  setup() {
    const { questionnaireState, goToNextPage } = useQuestionnaire()
    const radioOptions = questionnaireState.question2.options || []

    function handleClick(option: string) {
      if (questionnaireState.question2.answer === option) {
        questionnaireState.question2.answer = ''
        return
      }
      questionnaireState.question2.answer = option
    }

    return {
      questionnaireState,
      radioOptions,
      goToNextPage,
      handleClick
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/questionnaire';
</style>
