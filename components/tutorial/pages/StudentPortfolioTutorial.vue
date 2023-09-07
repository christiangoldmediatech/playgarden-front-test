<template>
  <TutorialCard :finish-buttons="currentTutorialStep && currentTutorialStep.step.id === 'step2'">
    <template v-if="currentTutorialStep">
      <div class="pg-text-center">
        <template v-if="currentTutorialStep.step.id === 'step1'">
          <div class="pg-text-[#606060] !pg-font-[Quicksand] pg-font-semibold pg-px-6">
            In your <span class="pg-text-[#FFAB37] pg-font-bold">STUDENT CUBBY</span>, you may also download worksheets in advance to be prepared for the next day of lessons.
          </div>
        </template>
        <template v-if="currentTutorialStep.step.id === 'step2'">
          <div class="pg-text-[#606060] !pg-font-[Quicksand] pg-font-semibold pg-px-6 pg-pt-4">
            For more information on how to use <span class="pg-text-[#F89838] pg-font-bold">Worksheets</span>, visit our FAQ page, or email us at <a class="!pg-text-[#F89838] !pg-font-bold" href="mailto:Hello@PlaygardenPrep.com">Hello@PlaygardenPrep.com</a>.
          </div>
        </template>
      </div>
    </template>
  </TutorialCard>
</template>

<script lang="ts">
import { defineComponent, computed, useRoute, useRouter, onMounted, onUnmounted, useStore } from '@nuxtjs/composition-api'
import { useTutorial, useTutorialQuery, useTutorialSteps, useTutorialQuiz } from '@/composables/tutorial/use-tutorial.composable'
import TutorialCard from '@/components/tutorial/TutorialCard.vue'
import type { RawLocation } from 'vue-router'

export default defineComponent({
  name: 'StudentPortfolioTutorial',

  components: {
    TutorialCard
  },

  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const { createTutorial, getTutorial, destroyTutorial } = useTutorial()
    const { addTutorialSteps, currentTutorialStep } = useTutorialSteps()
    const { shouldStartTutorial, isInitialTutorial } = useTutorialQuery({ route, router })
    const { quizResult } = useTutorialQuiz({ store })

    const doesTutorialEndHere = computed(() => {
      return (
        !quizResult.liveClasses &&
        !quizResult.educationalVideos
      )
    })

    onMounted(() => {
      if (!shouldStartTutorial.value) {
        return
      }

      createTutorial()
      const tutorial = getTutorial()

      addTutorialSteps([
        {
          step: {
            id: 'step1',
            attachTo: {
              element: '#student-portfolio-worksheet-cards',
              on: 'right'
            }
          },
          onAdvance: () => {
            if (!doesTutorialEndHere.value) {
              if (quizResult.liveClasses) {
                router.push({
                  name: 'app-virtual-preschool',
                  query: { tutorial: true, tutorialStep: 'step2', tutorialIntroDaysRedirect: isInitialTutorial.value }
                } as unknown as RawLocation)
              } else if (quizResult.educationalVideos) {
                router.push({
                  name: 'app-virtual-preschool',
                  query: { tutorial: true, tutorialStep: 'step4', tutorialIntroDaysRedirect: isInitialTutorial.value }
                } as unknown as RawLocation)
              }
            } else {
              getTutorial()?.next()
            }
          }
        },
        {
          step: {
            id: 'step2'
          }
        }
      ])

      tutorial?.start()
    })

    onUnmounted(() => {
      destroyTutorial()
    })

    return {
      currentTutorialStep
    }
  }
})
</script>
