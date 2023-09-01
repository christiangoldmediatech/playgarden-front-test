<template>
  <v-main class="!pg-px-6 lg:pg-mt-8">
    <div class="pg-max-w-[1650px] pg-mx-auto">
      <BackButton class="pg-my-8" :class="{ 'pg-invisible': activeQuestionnairePage === 0 }" @click="goToPrevPage" />

      <QuestionnaireQuestion1 v-if="activeQuestionnairePage === 0" />
      <QuestionnaireQuestion2 v-if="activeQuestionnairePage === 1" />
      <QuestionnaireQuestion3 v-if="activeQuestionnairePage === 2" />
    </div>

    <TutorialDialog @close="startIntroDays" @remind="startIntroDays" @start="startTutorial" />
  </v-main>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, useRouter, useRoute, useStore } from '@nuxtjs/composition-api'
import BackButton from '@/components/shared/BackButton/BackButton.vue'
import { useQuestionnaire } from '@/composables/questionnaire/useQuestionnaire.composable'
import { useTutorialDialog, useTutorialQuiz, useTutorialQuery } from '@/composables/tutorial/use-tutorial.composable'
import QuestionnaireQuestion1 from '@/components/questionnaire/QuestionnaireQuestion1.vue'
import QuestionnaireQuestion2 from '@/components/questionnaire/QuestionnaireQuestion2.vue'
import QuestionnaireQuestion3 from '@/components/questionnaire/QuestionnaireQuestion3.vue'
import TutorialDialog from '@/components/tutorial/TutorialDialog.vue'

import type { RawLocation } from 'vue-router'

export default defineComponent({
  name: 'Questionnaire',

  components: {
    BackButton,
    QuestionnaireQuestion1,
    QuestionnaireQuestion2,
    QuestionnaireQuestion3,
    TutorialDialog
  },

  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const { activeQuestionnairePage, resetQuestionnaire, goToPrevPage } = useQuestionnaire()
    const { getQuizResults, quizResult } = useTutorialQuiz({ store })
    const { dialogLoading } = useTutorialDialog()
    const { startIntroDays } = useTutorialQuery({ route, router })

    onBeforeMount(() => {
      resetQuestionnaire()
    })

    async function startTutorial() {
      try {
        dialogLoading.value = true
        await getQuizResults()

        let step = ''

        if (quizResult.structuredLessons) {
          step = 'step1'
        } else if (quizResult.liveClasses) {
          step = 'step2'
        } else if (quizResult.printableWorksheets) {
          step = 'step3'
        } else if (quizResult.educationalVideos) {
          step = 'step4'
        }

        router.push({
          name: 'app-virtual-preschool',
          query: {
            tutorial: true,
            tutorialStep: step,
            tutorialWelcome: true,
            tutorialIntroDaysRedirect: true
          }
        } as unknown as RawLocation)
      } finally {
        dialogLoading.value = false
      }
    }

    return {
      activeQuestionnairePage,
      goToPrevPage,
      startIntroDays,
      startTutorial
    }
  }
})
</script>
