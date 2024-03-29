<template>
  <TutorialCard>
    <template v-if="currentTutorialStep">
      <div class="pg-text-center">
        <template v-if="currentTutorialStep.step.id === 'step1'">
          <div class="pg-text-[#606060] !pg-font-[Quicksand] pg-font-semibold pg-px-6">
            {{ $localT('step1') }}
          </div>
        </template>
        <template v-if="currentTutorialStep.step.id === 'step2'">
          <div class="pg-text-[#606060] !pg-font-[Quicksand] pg-font-semibold pg-px-6 pg-pt-4">
            {{ $localT('step2Ln1') }} <span class="!pg-text-[#F6B7D2] pg-font-bold">{{ $localT('kidsCorner') }}</span> {{ $localT('step2Ln2') }}
          </div>
        </template>
      </div>
    </template>
  </TutorialCard>
</template>

<script lang="ts">
import { defineComponent, useStore, useRoute, useRouter, onMounted, onUnmounted, nextTick } from '@nuxtjs/composition-api'
import { useTutorial, useTutorialQuery, useTutorialSteps } from '@/composables/tutorial/use-tutorial.composable'
import { useLocalLanguageHelper } from '@/composables/i18n/use-local-language-helper.composable'
import TutorialCard from '@/components/tutorial/TutorialCard.vue'

export default defineComponent({
  name: 'LibraryTutorial',

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
    const { getLocalT } = useLocalLanguageHelper()
    const $localT = getLocalT('tutorial.library')

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
              element: '#library-search',
              on: 'right'
            },
            modalOverlayOpeningRadius: 24
          },
          onBeforeShowPromise() {
            // This is required because there is a strange rendering artifact on the library page
            // On first render, the search bar is incorrectly placed, and if we don't wait some time
            // The tool tip is incorrectly positioned.
            // The cause of this remains unknown
            return nextTick()
          },
          alternateOpeningTargetStyles: { backgroundColor: '#FFFFFF', padding: '1px 4px 5px 4px' }
        },
        {
          step: {
            id: 'step2',
            attachTo: {
              element: '#kids-corner-button',
              on: 'bottom'
            }
          },
          onAdvance() {
            const { tutorialVirtualPreschoolRedirect } = getTutorialQueryParams()
            window.open(`${process.env.kidsCornerUrl}?atoken=${store.getters['auth/getAccessToken']}&tutorial=true&tutorialStep=step1${isInitialTutorial.value ? '&tutorialIntroDaysRedirect=true' : ''}${tutorialVirtualPreschoolRedirect ? '&tutorialVirtualPreschoolRedirect=true' : ''}`, '_self')
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
      $localT
    }
  }
})
</script>
