<template>
  <TutorialDialog @start="onTutorialStart" />
</template>

<script lang="ts">
import { defineComponent, useStore, PropType, useRoute, useRouter } from '@nuxtjs/composition-api'
import { useTutorialQuiz } from '@/composables/tutorial/use-tutorial.composable'
import TutorialDialog from '@/components/tutorial/TutorialDialog.vue'
import type { RawLocation } from 'vue-router'

export default defineComponent({
  name: 'LiveClassesTutorialDialog',

  components: {
    TutorialDialog
  },

  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const { turnOffQuiz } = useTutorialQuiz({ store })
    function onTutorialStart() {
      // Tutorial needs to be lesson specific
      turnOffQuiz()
      router.push({
        name: 'app-live-classes',
        query: {
          tutorial: true,
          tutorialStep: 'step1'
        }
      } as unknown as RawLocation, () => {
        window.open(route.value.fullPath, '_self')
      })
    }

    return {
      onTutorialStart
    }
  }
})
</script>
