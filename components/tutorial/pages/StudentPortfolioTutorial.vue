<template>
  <TutorialCard :finish-buttons="currentTutorialStep && currentTutorialStep.step.id === 'step2'">
    <template v-if="currentTutorialStep">
      <div class="pg-text-center">
        <template v-if="currentTutorialStep.step.id === 'step1'">
          <div class="pg-text-[#606060] !pg-font-[Quicksand] pg-font-semibold pg-px-6">
            {{ $localT('step1Ln1') }} <span class="pg-text-[#FFAB37] pg-font-bold">{{ $generalTutorialT('studentCubby') }}</span>{{ $localT('step1Ln2') }}
          </div>
        </template>
        <template v-if="currentTutorialStep.step.id === 'step2'">
          <div class="pg-text-[#606060] !pg-font-[Quicksand] pg-font-semibold pg-px-6 pg-pt-4">
            {{ $generalTutorialT('forMoreInformation') }} <span class="pg-text-[#F89838] pg-font-bold">{{ $localT('worksheets') }}</span>{{ $generalTutorialT('visitOurFaqPage') }}<br />
            <a
              class="!pg-text-[#F89838] !pg-font-bold"
              :href="`mailto:${$generalTutorialT('email')}`"
            >
              {{ $generalTutorialT('email') }}
            </a>
          </div>
        </template>
      </div>
    </template>
  </TutorialCard>
</template>

<script lang="ts">
import { defineComponent, computed, useRoute, useRouter, onMounted, onUnmounted, useStore } from '@nuxtjs/composition-api'
import { useTutorial, useTutorialQuery, useTutorialSteps, useTutorialQuiz } from '@/composables/tutorial/use-tutorial.composable'
import { useLocalLanguageHelper } from '@/composables/i18n/use-local-language-helper.composable'
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
    const { shouldStartTutorial, isInitialTutorial, getTutorialQueryParams } = useTutorialQuery({ route, router })
    const { quizResult } = useTutorialQuiz({ store })
    const { getLocalT } = useLocalLanguageHelper()
    const $generalTutorialT = getLocalT('tutorial.general')
    const $localT = getLocalT('tutorial.studentPortfolio')

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
              const { tutorialVirtualPreschoolRedirect } = getTutorialQueryParams()
              if (quizResult.liveClasses) {
                router.push({
                  name: 'app-virtual-preschool',
                  query: { tutorial: true, tutorialStep: 'step2', tutorialIntroDaysRedirect: isInitialTutorial.value, tutorialVirtualPreschoolRedirect }
                } as unknown as RawLocation)
              } else if (quizResult.educationalVideos) {
                router.push({
                  name: 'app-virtual-preschool',
                  query: { tutorial: true, tutorialStep: 'step4', tutorialIntroDaysRedirect: isInitialTutorial.value, tutorialVirtualPreschoolRedirect }
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
      currentTutorialStep,
      $generalTutorialT,
      $localT
    }
  }
})
</script>

<i18n src="@/lang/tutorial/tutorial.en.json"></i18n>

<i18n src="@/lang/tutorial/tutorial.es.json"></i18n>
