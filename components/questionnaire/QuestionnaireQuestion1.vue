<template>
  <div class="questionnaire">
    <div class="questionnaire-image">
      <img src="@/assets/jpg/questionnaire/bg-question-1.jpg" />
    </div>

    <div class="questionnaire-card">
      <div class="questionnaire-title pg-mb-5">
        {{ questDataState.question1.text }}
      </div>

      <div class="questionnaire-text pg-mb-6 lg:pg-mb-8">
        {{ questDataState.question1.instructions }}
      </div>

      <div class="questionnaire-answers questionnaire-answers--checkboxes pg-mb-5 lg:pg-mb-16">
        <v-checkbox
          v-for="(checkbox, checkboxIndex) in checkboxOptions"
          :key="`questionnaire-checkbox-${checkboxIndex}`"
          v-model="questDataState.question1.answer"
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
          depressed
          :disabled="!questDataState.question1.answer.length"
          @click.stop="onNextBtnClick"
        >
          NEXT
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import { defineComponent, onMounted } from '@nuxtjs/composition-api'
import { useQuestionnaire } from '@/composables/questionnaire/useQuestionnaire.composable'

export default defineComponent({
  name: 'QuestionnaireQuestion1',

  setup() {
    const { questDataState, questPageData, goToNextPage } = useQuestionnaire()
    const checkboxOptions = questDataState.question1.options || []
    let startTime = dayjs()

    onMounted(() => {
      startTime = dayjs()
    })

    function onNextBtnClick() {
      const endTime = dayjs()
      const totalTime = endTime.diff(startTime, 'seconds')
      questPageData[0].pageTime = totalTime
      goToNextPage()
    }

    return {
      questDataState,
      checkboxOptions,
      onNextBtnClick
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/questionnaire';
</style>
