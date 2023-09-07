<template>
  <TutorialBtn @click="onClickTutorialBtn" />
</template>

<script lang="ts">
import { defineComponent, useStore, useRoute, useRouter } from '@nuxtjs/composition-api'
import { useTutorialQuiz } from '@/composables/tutorial/use-tutorial.composable'
import TutorialBtn from '@/components/tutorial/TutorialBtn.vue'
import type { RawLocation } from 'vue-router'

export default defineComponent({
  name: 'LiveClassesTutorialBtn',

  components: {
    TutorialBtn
  },

  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const { turnOffQuiz } = useTutorialQuiz({ store })
    function onClickTutorialBtn() {
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
      onClickTutorialBtn
    }
  }
})
</script>
