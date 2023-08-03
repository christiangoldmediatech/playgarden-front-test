<template>
  <div class="questionnaire">
    <div class="questionnaire-image">
      <img src="@/assets/jpg/questionnaire/bg-question-3.jpg" />
    </div>

    <div class="questionnaire-card">
      <div class="questionnaire-title pg-mb-5">
        One last thing before you get started!
      </div>

      <div class="questionnaire-answers questionnaire-answers--radio pg-mb-5 lg:pg-mb-16">
        <v-radio-group v-model="questionnaireState.question3.answer" hide-details class="pg-mt-0 !pg-mb-10">
          <div class="pg-mb-4 pg-text-[#606060] pg-font-bold pg-text-base pg-leading-[20px]">
            {{ questionnaireState.question3.text }}
          </div>
          <v-radio off-icon="mdi-radiobox-blank primary--text" label="Yes" value="Yes" />
          <v-radio off-icon="mdi-radiobox-blank primary--text" label="No" value="No" />
        </v-radio-group>

        <v-radio-group v-model="questionnaireState.question4.answer" hide-details>
          <div class="pg-mb-4 pg-text-[#606060] pg-font-bold pg-text-base pg-leading-[20px]">
            {{ questionnaireState.question4.text }}
          </div>
          <v-radio off-icon="mdi-radiobox-blank primary--text" label="Yes" value="Yes" />
          <v-radio off-icon="mdi-radiobox-blank primary--text" label="No" value="No" />
        </v-radio-group>
      </div>

      <div class="questionnaire-button questionnaire-button--final">
        <v-btn
          color="#B2E68D"
          class="white--text"
          :disabled="!questionnaireState.question3.answer || !questionnaireState.question4.answer"
        >
          GO TO FIRST DAY OF LEARNING
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { useQuestionnaire } from '@/composables/questionnaire/useQuestionnaire.composable'

export default defineComponent({
  name: 'QuestionnaireQuestion3',

  setup() {
    const { questionnaireState } = useQuestionnaire()

    return {
      questionnaireState
    }
  }
})
</script>

<style lang="sass" scoped>
@import '@/assets/scss/questionnaire'
</style>
