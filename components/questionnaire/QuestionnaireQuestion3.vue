<template>
  <div class="questionnaire">
    <div class="questionnaire-image">
      <img src="@/assets/jpg/questionnaire/bg-question-3.jpg" />
    </div>

    <div class="questionnaire-card">
      <div class="questionnaire-title pg-mb-5">
        {{ $t('title') }}
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
            {{ $t('question3.text') }}
          </div>
          <v-radio
            v-for="(option, index) in question3Options"
            :key="`question-3-option-${index + 1}`"
            off-icon="mdi-radiobox-blank primary--text"
            :label="option"
            :value="question3OptionsValues[index]"
          />
        </v-radio-group>

        <v-radio-group v-model="questDataState.question4.answer" hide-details>
          <div
            class="pg-mb-4 pg-text-[#606060] pg-font-bold pg-text-base pg-leading-[20px]"
          >
            {{ $t('question4.textComp') }}
            <a
              class="warning--text !pg-underline"
              target="_blank"
              href="https://www.cognitivetoybox.com/"
            >
              {{ $t('question4.cognitiveToybox') }}
            </a>?
          </div>
          <v-radio
            v-for="(option, index) in question4Options"
            :key="`question-4-option-${index + 1}`"
            off-icon="mdi-radiobox-blank primary--text"
            :label="option"
            :value="question4OptionsValues[index]"
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
          {{ $t('goToFirstDayOfLearning') }}
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
  computed,
  useStore,
  useRouter
} from '@nuxtjs/composition-api'
import {
  useQuestionnaire,
  useQuestionnaireSave
} from '@/composables/questionnaire/useQuestionnaire.composable'
import { useLanguageHelper } from '@/composables'
import type { RawLocation } from 'vue-router'

export default defineComponent({
  name: 'QuestionnaireQuestion3',

  setup() {
    const store = useStore<unknown>()
    const router = useRouter()
    const language = useLanguageHelper()
    const { questDataState, questPageData } = useQuestionnaire()
    const { isSaving, handleSave } = useQuestionnaireSave({ store })

    const question3Options = computed(() => {
      return language.t('question3.options') as unknown as Array<string>
    })

    const question3OptionsValues = computed(() => {
      return language.t('question3.options', 'en', undefined) as unknown as Array<string>
    })

    const question4Options = computed(() => {
      return language.t('question4.options') as unknown as Array<string>
    })

    const question4OptionsValues = computed(() => {
      return language.t('question4.options', 'en', undefined) as unknown as Array<string>
    })

    let startTime = dayjs()
    onMounted(() => {
      startTime = dayjs()
    })

    async function onSave() {
      try {
        const endTime = dayjs()
        const totalTime = endTime.diff(startTime, 'seconds')
        questPageData[2].pageTime = totalTime
        await handleSave()
        router.push({ name: 'app-virtual-preschool', query: { promptTutorial: true } } as unknown as RawLocation)
      } catch {}
    }

    return {
      questDataState,
      isSaving,
      question3Options,
      question3OptionsValues,
      question4Options,
      question4OptionsValues,
      onSave
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/questionnaire';
</style>

<i18n src="./locales/question3.locales.json"></i18n>
