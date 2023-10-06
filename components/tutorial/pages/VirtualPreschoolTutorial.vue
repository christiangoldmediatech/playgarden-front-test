<template>
  <TutorialCard>
    <template v-if="currentTutorialStep">
      <div class="pg-text-center">
        <div v-if="showWelcome" class="pg-text-[#707070] pg-font-[Poppins] pg-font-bold pg-text-2xl pg-mb-4">
          {{ $generalTutorialT('welcome') }}
        </div>
        <template v-if="currentTutorialStep.step.id === 'step1'">
          <div class="pg-text-[#606060] !pg-font-[Quicksand] pg-font-semibold pg-px-6">
            {{ $localT('step1') }}
          </div>
        </template>
        <template v-if="currentTutorialStep.step.id === 'step2'">
          <div
            class="pg-text-[#606060] !pg-font-[Quicksand] pg-font-semibold pg-px-6"
            :class="{ 'pg-pt-4': !showWelcome }"
          >
            {{ $localT('step2Ln1') }}<br />
            <span class="pg-text-[#F89838] pg-font-bold">{{ $localT('step2Ln2') }}</span>
          </div>
        </template>
        <template v-if="currentTutorialStep.step.id === 'step3'">
          <div class="pg-text-[#606060] !pg-font-[Quicksand] pg-font-semibold pg-px-6">
            {{ $localT('step3') }}
          </div>
        </template>
        <template v-if="currentTutorialStep.step.id === 'step4'">
          <div
            class="pg-text-[#606060] !pg-font-[Quicksand] pg-font-semibold pg-px-6"
            :class="{ 'pg-pt-4': !showWelcome }"
          >
            {{ $localT('step4Ln1') }} <span class="pg-text-[#A4A4EB] pg-font-bold">{{ $localT('step4Ln2') }}</span>.
          </div>
        </template>
      </div>
    </template>
  </TutorialCard>
</template>

<script lang="ts">
import { defineComponent, computed, useStore, useRoute, useRouter, onMounted, onUnmounted } from '@nuxtjs/composition-api'
import { RawLocation } from 'vue-router'
import { useTutorial, useTutorialQuery, useTutorialSteps, useTutorialQuiz } from '@/composables/tutorial/use-tutorial.composable'
import { useLocalLanguageHelper } from '@/composables/i18n/use-local-language-helper.composable'
import TutorialCard from '@/components/tutorial/TutorialCard.vue'

export default defineComponent({
  name: 'VirtualPreschoolTutorial',

  components: {
    TutorialCard
  },

  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const { createTutorial, getTutorial, destroyTutorial } = useTutorial()
    const { addTutorialSteps, currentTutorialStep } = useTutorialSteps()
    const { shouldStartTutorial, tutorialStartStep, isInitialTutorial, getTutorialQueryParams } = useTutorialQuery({ route, router })
    const { resetQuizResults } = useTutorialQuiz({ store })
    const { getLocalT } = useLocalLanguageHelper()
    const $generalTutorialT = getLocalT('tutorial.general')
    const $localT = getLocalT('tutorial.virtualPreschool')

    const showWelcome = computed(() => {
      return !!route.value.query.tutorialWelcome
    })

    onMounted(() => {
      if (!shouldStartTutorial.value) {
        return
      }

      createTutorial()
      const tutorial = getTutorial()

      if (!isInitialTutorial.value) {
        resetQuizResults()
      }

      addTutorialSteps([
        {
          step: {
            id: 'step1',
            attachTo: {
              element: '#pg-tutorial__step-1',
              on: 'right'
            },
            canClickTarget: true,
            showOn() {
              return tutorialStartStep.value === this.id
            }
          },
          onAdvance: () => {
            const { tutorialVirtualPreschoolRedirect } = getTutorialQueryParams()
            router.push({ name: 'app-dashboard', query: { tutorial: true, tutorialStep: 'step1', tutorialIntroDaysRedirect: isInitialTutorial.value, tutorialVirtualPreschoolRedirect } } as unknown as RawLocation)
          }
        },
        {
          step: {
            id: 'step2',
            attachTo: {
              element: '#pg-tutorial__step-2',
              on: 'left'
            },
            canClickTarget: true,
            showOn() {
              return tutorialStartStep.value === this.id
            }
          },
          onAdvance: () => {
            const { tutorialVirtualPreschoolRedirect } = getTutorialQueryParams()
            router.push({ name: 'app-live-classes', query: { tutorial: true, tutorialStep: 'step1', tutorialIntroDaysRedirect: isInitialTutorial.value, tutorialVirtualPreschoolRedirect } } as unknown as RawLocation)
          }
        },
        {
          step: {
            id: 'step3',
            attachTo: {
              element: '#pg-tutorial__step-1',
              on: 'right'
            },
            canClickTarget: true,
            showOn() {
              return tutorialStartStep.value === this.id
            }
          },
          onAdvance: () => {
            const { tutorialVirtualPreschoolRedirect } = getTutorialQueryParams()
            router.push({ name: 'app-dashboard', query: { tutorial: true, tutorialStep: 'step2', tutorialIntroDaysRedirect: isInitialTutorial.value, tutorialVirtualPreschoolRedirect } } as unknown as RawLocation)
          }
        },
        {
          step: {
            id: 'step4',
            attachTo: {
              element: '#pg-tutorial__step-3',
              on: 'top'
            },
            canClickTarget: true,
            showOn() {
              return tutorialStartStep.value === this.id
            }
          },
          onAdvance: () => {
            const { tutorialVirtualPreschoolRedirect } = getTutorialQueryParams()
            router.push({ name: 'app-library', query: { tutorial: true, tutorialStep: 'step1', tutorialIntroDaysRedirect: isInitialTutorial.value, tutorialVirtualPreschoolRedirect } } as unknown as RawLocation)
          }
        }
      ])

      window.setTimeout(() => {
        tutorial?.start()
      }, 500)
    })

    onUnmounted(() => {
      destroyTutorial()
    })

    return {
      currentTutorialStep,
      showWelcome,
      $generalTutorialT,
      $localT
    }
  }
})
</script>

<i18n src="@/lang/tutorial/tutorial.en.json"></i18n>

<i18n src="@/lang/tutorial/tutorial.es.json"></i18n>
