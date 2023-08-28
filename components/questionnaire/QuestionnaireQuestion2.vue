<template>
  <div class="questionnaire">
    <div class="questionnaire-image">
      <img src="@/assets/jpg/questionnaire/bg-question-2.jpg" />
    </div>

    <div class="questionnaire-card">
      <div class="questionnaire-title pg-mb-5">
        {{ questDataState.question2.text }}
      </div>

      <div class="questionnaire-text pg-mb-6 lg:pg-mb-8">
        {{ questDataState.question2.instructions }}
      </div>

      <div class="questionnaire-answers questionnaire-answers__days-per-week pg-mb-5 lg:pg-mb-16">
        <div
          class="option-card"
          :class="{ 'option-card--selected': questDataState.question2.answer === `${radioOptions[0] || ''}` }"
          @click="() => handleClick(radioOptions[0])"
        >
          <div class="pg-flex pg-w-full pg-h-full pg-items-center pg-justify-center pg-mb-2">
            <img src="@/assets/png/questionnaire/days-per-week-option-1.png" />
          </div>
          DAY PER WEEK OR LESS
        </div>

        <div
          class="option-card option-card--double"
          :class="{ 'option-card--selected': questDataState.question2.answer === radioOptions[1] }"
          @click="() => handleClick(radioOptions[1])"
        >
          <div class="pg-flex pg-w-full pg-h-full pg-items-center pg-justify-center pg-mb-4">
            <img src="@/assets/png/questionnaire/days-per-week-option-2.png" />
          </div>
          DAYS PER WEEK
        </div>

        <div
          class="option-card option-card--double"
          :class="{ 'option-card--selected': questDataState.question2.answer === radioOptions[2] }"
          @click="() => handleClick(radioOptions[2])"
        >
          <div class="pg-flex pg-w-full pg-h-full pg-items-center pg-justify-center pg-mb-4">
            <img src="@/assets/png/questionnaire/days-per-week-option-3.png" />
          </div>
          DAYS PER WEEK
        </div>

        <div
          class="option-card"
          :class="{ 'option-card--selected': questDataState.question2.answer === radioOptions[3] }"
          @click="() => handleClick(radioOptions[3])"
        >
          <div class="pg-flex pg-w-full pg-h-full pg-items-center pg-justify-center pg-mb-1">
            <img src="@/assets/png/questionnaire/days-per-week-option-4.png" />
          </div>
          DAYS PER WEEK
        </div>
      </div>

      <div class="questionnaire-button">
        <v-btn
          color="#B2E68D"
          class="white--text"
          depressed
          :disabled="!questDataState.question2.answer"
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
  name: 'QuestionnaireQuestion2',

  setup() {
    const { questDataState, questPageData, goToNextPage } = useQuestionnaire()
    const radioOptions = questDataState.question2.options || []

    let startTime = dayjs()

    onMounted(() => {
      startTime = dayjs()
    })

    function onNextBtnClick() {
      const endTime = dayjs()
      const totalTime = endTime.diff(startTime, 'seconds')
      questPageData[1].pageTime = totalTime
      goToNextPage()
    }

    function handleClick(option: string) {
      if (questDataState.question2.answer === option) {
        questDataState.question2.answer = ''
        return
      }
      questDataState.question2.answer = option
    }

    return {
      questDataState,
      radioOptions,
      onNextBtnClick,
      handleClick
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/questionnaire';
</style>
