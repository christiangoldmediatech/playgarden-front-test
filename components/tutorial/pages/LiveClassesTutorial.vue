<template>
  <TutorialCard :finish-buttons="currentTutorialStep && currentTutorialStep.step.id === 'step6'">
    <template v-if="currentTutorialStep">
      <div class="pg-text-center">
        <template v-if="currentTutorialStep.step.id === 'step1'">
          <div class="pg-text-[#606060] !pg-font-[Quicksand] pg-font-semibold pg-px-6">
            {{ $localT('step1Ln1') }} <span class="pg-font-bold">{{ $localT('step1Ln2') }}</span>{{ $localT('step1Ln3') }}
          </div>
        </template>
        <template v-if="currentTutorialStep.step.id === 'step2'">
          <div class="pg-text-[#606060] !pg-font-[Quicksand] pg-font-semibold pg-px-6 pg-pt-4">
            {{ $localT('step2Ln1') }} <span class="!pg-text-[#F89838] pg-font-bold">{{ $localT('step2Ln2') }}</span>{{ $localT('step2Ln3') }}
          </div>
        </template>
        <template v-if="currentTutorialStep.step.id === 'step3'">
          <div class="pg-text-[#606060] !pg-font-[Quicksand] pg-font-semibold pg-px-6 pg-pt-4">
            <span class="!pg-text-[#78C383] pg-font-bold">{{ $localT('step3Ln1') }}</span> {{ $localT('step3Ln2') }}
          </div>
        </template>
        <template v-if="currentTutorialStep.step.id === 'step4'">
          <div class="pg-text-[#606060] !pg-font-[Quicksand] pg-font-semibold pg-px-6 pg-pt-4">
            {{ $localT('step4Ln1') }} <span class="pg-font-bold">{{ $localT('step4Ln2') }}</span>{{ $localT('step4Ln3') }}
          </div>
        </template>
        <template v-if="currentTutorialStep.step.id === 'step5'">
          <div class="pg-text-[#606060] !pg-font-[Quicksand] pg-font-semibold pg-px-6 pg-pt-4">
            {{ $localT('step5') }}
          </div>
        </template>
        <template v-if="currentTutorialStep.step.id === 'step6'">
          <div class="pg-text-[#606060] !pg-font-[Quicksand] pg-font-semibold pg-px-6 pg-pt-4">
            {{ $localT('forMoreInformation') }} <span class="pg-text-[#F89838] pg-font-bold">{{ $localT('liveClasses') }}</span>
            {{ $generalTutorialT('visitOurFaqPage') }} <a class="!pg-text-[#F89838] !pg-font-bold" :href="`mailto:${$generalTutorialT('email')}`">
              {{ $generalTutorialT('email') }}
            </a>-
          </div>
        </template>
      </div>
    </template>
  </TutorialCard>
</template>

<script lang="ts">
import { defineComponent, computed, useStore, useRoute, useRouter, onMounted, onUnmounted } from '@nuxtjs/composition-api'
import { useTutorial, useTutorialQuery, useTutorialSteps, useTutorialQuiz } from '@/composables/tutorial/use-tutorial.composable'
import { useAppEventBusHelper } from '@/composables'
import { useLocalLanguageHelper } from '@/composables/i18n/use-local-language-helper.composable'
import TutorialCard from '@/components/tutorial/TutorialCard.vue'
import type { RawLocation } from 'vue-router'

export default defineComponent({
  name: 'LiveClassesTutorial',

  components: {
    TutorialCard
  },

  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const { createTutorial, getTutorial, destroyTutorial } = useTutorial()
    const { addTutorialSteps, currentTutorialStep } = useTutorialSteps()
    const { shouldStartTutorial, isInitialTutorial, getTutorialQueryParams } = useTutorialQuery({ route, router })
    const appEventBus = useAppEventBusHelper()
    const { quizResult } = useTutorialQuiz({ store })
    const { getLocalT } = useLocalLanguageHelper()
    const $generalTutorialT = getLocalT('tutorial.general')
    const $localT = getLocalT('tutorial.liveClasses')

    const doesTutorialEndHere = computed(() => {
      return !quizResult.educationalVideos
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
              element: '#tutorial-music-live-session',
              on: 'right'
            }
          },
          onAdvance() {
            document.querySelector('#tutorial-music-live-session')?.dispatchEvent(new Event('click'))
            tutorial?.next()
          },
          alternateOpeningTargetStyles: { backgroundColor: '#FFFFFF' }
        },
        {
          step: {
            id: 'step2',
            attachTo: {
              element: '#entry-dialog',
              on: 'bottom'
            }
          },
          onHide() {
            appEventBus.$emit('tutorial-close-entry-dialog')
          }
        },
        {
          step: {
            id: 'step3',
            attachTo: {
              element: '#tutorial-playdate',
              on: 'right'
            }
          },
          onAdvance() {
            document.querySelector('#tutorial-art-live-session')?.dispatchEvent(new Event('click'))
            tutorial?.next()
          },
          alternateOpeningTargetStyles: { backgroundColor: '#FFFFFF' }
        },
        {
          step: {
            id: 'step4',
            attachTo: {
              element: '#entry-dialog',
              on: 'bottom'
            }
          },
          onHide() {
            appEventBus.$emit('tutorial-close-entry-dialog')
          }
        },
        {
          step: {
            id: 'step5',
            attachTo: {
              element: '#time-zone-changer',
              on: 'bottom'
            },
            showOn() {
              return !!document.querySelector('#time-zone-changer')
            }
          },
          onBeforeShowPromise() {
            return new Promise((resolve) => {
              appEventBus.$emit('tutorial-close-drawer')
              resolve(true)
            })
          },
          alternateOpeningTargetStyles: { backgroundColor: '#FFFFFF' },
          onAdvance: () => {
            if (!doesTutorialEndHere.value) {
              const { tutorialVirtualPreschoolRedirect } = getTutorialQueryParams()
              router.push({
                name: 'app-virtual-preschool',
                query: { tutorial: true, tutorialStep: 'step4', tutorialIntroDaysRedirect: isInitialTutorial.value, tutorialVirtualPreschoolRedirect }
              } as unknown as RawLocation)
            } else {
              getTutorial()?.next()
            }
          }
        },
        {
          step: {
            id: 'step6'
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
