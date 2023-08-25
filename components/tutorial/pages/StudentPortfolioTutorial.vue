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
import { defineComponent, useRoute, useRouter, onMounted, onUnmounted } from '@nuxtjs/composition-api'
import { useTutorial, useTutorialQuery, useTutorialSteps } from '@/composables/tutorial/use-tutorial.composable'
import TutorialCard from '@/components/tutorial/TutorialCard.vue'

export default defineComponent({
  name: 'StudentPortfolioTutorial',

  components: {
    TutorialCard
  },

  setup() {
    const router = useRouter()
    const route = useRoute()
    const { createTutorial, getTutorial, destroyTutorial } = useTutorial()
    const { addTutorialSteps, currentTutorialStep } = useTutorialSteps()
    const { shouldStartTutorial } = useTutorialQuery({ route, router })

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
