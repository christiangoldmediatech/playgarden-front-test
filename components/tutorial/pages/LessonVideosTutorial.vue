<template>
  <TutorialCard
    :finish-buttons="
      currentTutorialStep && currentTutorialStep.step.id === 'step8'
    "
  >
    <template v-if="currentTutorialStep">
      <div class="pg-text-center">
        <div
          class="pg-text-[#606060] !pg-font-[Quicksand] pg-font-semibold pg-pt-4"
        >
          <template v-if="currentTutorialStep.step.id === 'step1'">
            {{ $localT('step1') }}
          </template>
          <template v-if="currentTutorialStep.step.id === 'step2'">
            {{ $localT('step2Ln1') }}
            <span class="pg-text-[#F89838] pg-font-bold">
              {{ $localT('downloadWorksheets') }}
            </span>{{ $localT('step2Ln2') }}
          </template>
          <template v-if="currentTutorialStep.step.id === 'step3'">
            {{ $localT('step3Ln1') }} <span class="pg-text-[#F89838] pg-font-bold">{{ $localT('uploadWorksheet') }}</span>.
            {{ $localT('step3Ln2') }}
          </template>
          <template v-if="currentTutorialStep.step.id === 'step4'">
            {{ $localT('step4') }} <span class="pg-text-[#68C453] pg-font-bold">{{ $generalTutorialT('studentCubby') }}</span>.
          </template>
          <template v-if="currentTutorialStep.step.id === 'step5'">
            {{ $localT('step5') }}
          </template>
          <template v-if="currentTutorialStep.step.id === 'step6'">
            {{ $localT('step6') }}
            <span class="pg-text-[#68C453] pg-font-bold">{{ $generalTutorialT('studentCubby') }}</span>.
          </template>
          <template v-if="currentTutorialStep.step.id === 'step7'">
            {{ $localT('step7') }}
          </template>
          <template v-if="currentTutorialStep.step.id === 'step8'">
            {{ $generalTutorialT('forMoreInformation') }}
            <span class="pg-text-[#359645] pg-font-bold">{{ $localT('step8') }}</span>,
            {{ $generalTutorialT('visitOurFaqPage') }}<br />
            <a
              class="!pg-text-[#F89838] !pg-font-bold"
              :href="`mailto:${$generalTutorialT('email')}`"
            >
              {{ $generalTutorialT('email') }}
            </a>
          </template>
        </div>
      </div>
    </template>
  </TutorialCard>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  useRoute,
  useRouter,
  onMounted,
  onUnmounted,
  useStore
} from '@nuxtjs/composition-api'
import {
  useTutorial,
  useTutorialQuery,
  useTutorialSteps,
  useTutorialQuiz
} from '@/composables/tutorial/use-tutorial.composable'
import { useLocalLanguageHelper } from '@/composables/i18n/use-local-language-helper.composable'
import TutorialCard from '@/components/tutorial/TutorialCard.vue'
import type { RawLocation } from 'vue-router'

export default defineComponent({
  name: 'LessonVideosTutorial',

  components: {
    TutorialCard
  },

  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const { createTutorial, getTutorial, destroyTutorial } = useTutorial()
    const { addTutorialSteps, currentTutorialStep } = useTutorialSteps()
    const { shouldStartTutorial, tutorialStartStep, isInitialTutorial, getTutorialQueryParams } = useTutorialQuery({
      route,
      router
    })
    const { quizResult } = useTutorialQuiz({ store })
    const { getLocalT } = useLocalLanguageHelper()
    const $generalTutorialT = getLocalT('tutorial.general')
    const $localT = getLocalT('tutorial.lessonVideos')

    const doesTutorialEndHere = computed(() => {
      return (
        !quizResult.liveClasses &&
        !quizResult.printableWorksheets &&
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
              element: '#lesson-video-lessons',
              on: 'right'
            },
            showOn() {
              return tutorialStartStep.value === this.id
            }
          },
          alternateOpeningTarget: '#lesson-dashboard-panel',
          alternateOpeningTargetStyles: { backgroundColor: '#FFFFFF' }
        },
        {
          step: {
            id: 'step2',
            attachTo: {
              element: '#lesson-weekly-letter-worksheets',
              on: 'right'
            }
          },
          alternateOpeningTarget: '#lesson-dashboard-panel',
          alternateOpeningTargetStyles: { backgroundColor: '#FFFFFF' }
        },
        {
          step: {
            id: 'step3',
            attachTo: {
              element: '#upload-worksheets-button',
              on: 'right'
            }
          },
          alternateOpeningTarget: '#lesson-dashboard-panel',
          alternateOpeningTargetStyles: { backgroundColor: '#FFFFFF' }
        },
        {
          step: {
            id: 'step4',
            attachTo: {
              element: '#student-cubby-button',
              on: 'bottom'
            }
          }
        },
        // Won't show up because intro day lessons do not have activities
        {
          step: {
            id: 'step5',
            attachTo: {
              element: '#lesson-activities',
              on: 'right'
            },
            showOn() {
              return !!document.querySelector('#lesson-activities')
            }
          },
          alternateOpeningTarget: '#lesson-dashboard-panel',
          alternateOpeningTargetStyles: { backgroundColor: '#FFFFFF' }
        },
        {
          step: {
            id: 'step6',
            attachTo: {
              element: '#win-a-puzzle-piece',
              on: 'right'
            }
          },
          alternateOpeningTarget: '#lesson-dashboard-panel',
          alternateOpeningTargetStyles: { backgroundColor: '#FFFFFF' },
          onAdvance: () => {
            if (quizResult.structuredLessons) {
              getTutorial()?.next()
              return
            }

            if (!doesTutorialEndHere.value && quizResult.printableWorksheets) {
              const { tutorialVirtualPreschoolRedirect } = getTutorialQueryParams()
              router.push({
                name: 'app-student-cubby-student-portfolio',
                query: { tutorial: true, tutorialStep: 'step1', tutorialIntroDaysRedirect: isInitialTutorial.value, tutorialVirtualPreschoolRedirect }
              } as unknown as RawLocation)
              return
            }

            getTutorial()?.next()
          }
        },
        {
          step: {
            id: 'step7',
            attachTo: {
              element: '#lesson-letter-carousel',
              on: 'bottom'
            }
          },
          alternateOpeningTargetStyles: { backgroundColor: '#FFFFFF' },
          onAdvance: () => {
            if (!doesTutorialEndHere.value) {
              const { tutorialVirtualPreschoolRedirect } = getTutorialQueryParams()
              if (quizResult.printableWorksheets) {
                router.push({
                  name: 'app-student-cubby-student-portfolio',
                  query: { tutorial: true, tutorialStep: 'step1', tutorialIntroDaysRedirect: isInitialTutorial.value, tutorialVirtualPreschoolRedirect }
                } as unknown as RawLocation)
              } else if (quizResult.liveClasses) {
                router.push({
                  name: 'app-virtual-preschool',
                  query: { tutorial: true, tutorialStep: 'step2', tutorialIntroDaysRedirect: isInitialTutorial.value, tutorialVirtualPreschoolRedirect }
                } as unknown as RawLocation)
              } else if (quizResult.educationalVideos) {
                router.push({
                  name: 'app-virtual-preschool',
                  query: { tutorial: true, tutorialStep: 'step4', tutorialIntroDaysRedirect: isInitialTutorial.value, tutorialVirtualPreschoolRedirect }
                } as unknown as RawLocation)
              } else {
                getTutorial()?.next()
              }
            } else {
              getTutorial()?.next()
            }
          }
        },
        {
          step: {
            id: 'step8'
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
