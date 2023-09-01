<template>
  <div class="questionnaire">
    <div class="questionnaire-image">
      <img src="@/assets/jpg/questionnaire/bg-question-3.jpg" />
    </div>

    <div class="questionnaire-card">
      <div class="questionnaire-title pg-mb-5">
        One last thing before you get started!
      </div>

      <div
        class="questionnaire-answers questionnaire-answers--radio pg-mb-5 lg:pg-mb-16"
      >
        <v-radio-group
          v-model="questDataState.question3.answer"
          hide-details
          class="pg-mt-0 !pg-mb-10"
        >
          <div
            class="pg-mb-4 pg-text-[#606060] pg-font-bold pg-text-base pg-leading-[20px]"
          >
            {{ questDataState.question3.text }}
          </div>
          <v-radio
            v-for="(option, index) in questDataState.question3.options"
            :key="`question-3-option-${index + 1}`"
            off-icon="mdi-radiobox-blank primary--text"
            :label="option"
            :value="option"
          />
        </v-radio-group>

        <v-radio-group v-model="questDataState.question4.answer" hide-details>
          <div
            class="pg-mb-4 pg-text-[#606060] pg-font-bold pg-text-base pg-leading-[20px]"
          >
            Would you like to assess your child's progress for free using our
            partner,
            <a
              class="warning--text !pg-underline"
              target="_blank"
              href="https://www.cognitivetoybox.com/"
            >
              cognitive toybox
            </a>?
          </div>
          <v-radio
            v-for="(option, index) in questDataState.question4.options"
            :key="`question-4-option-${index + 1}`"
            off-icon="mdi-radiobox-blank primary--text"
            :label="option"
            :value="option"
          />
        </v-radio-group>
      </div>

      <div class="questionnaire-button questionnaire-button--final">
        <v-btn
          color="#B2E68D"
          class="white--text"
          depressed
          :loading="isSaving"
          :disabled="
            !questDataState.question3.answer || !questDataState.question4.answer
          "
          @click="onSave"
        >
          GO TO FIRST DAY OF LEARNING
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import {
  defineComponent,
  onMounted,
  useStore,
  useRouter
} from '@nuxtjs/composition-api'
import {
  useQuestionnaire,
  useQuestionnaireSave
} from '@/composables/questionnaire/useQuestionnaire.composable'
import { useTutorialDialog } from '@/composables/tutorial/use-tutorial.composable'

export default defineComponent({
  name: 'QuestionnaireQuestion3',

  setup() {
    const store = useStore<unknown>()
    const router = useRouter()
    const { questDataState, questPageData } = useQuestionnaire()
    const { isSaving, handleSave } = useQuestionnaireSave({ store })

    let startTime = dayjs()

    onMounted(() => {
      startTime = dayjs()
    })

    const { showTutorialDialog } = useTutorialDialog()
    async function onSave() {
      try {
        const endTime = dayjs()
        const totalTime = endTime.diff(startTime, 'seconds')
        questPageData[2].pageTime = totalTime
        await handleSave()
        showTutorialDialog()
      } catch {}
    }

    return {
      questDataState,
      isSaving,
      onSave
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/questionnaire';
</style>
