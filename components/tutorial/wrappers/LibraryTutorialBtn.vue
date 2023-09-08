<template>
  <TutorialBtn @click="onClickTutorialBtn" />
</template>

<script lang="ts">
import { defineComponent, useStore, PropType, useRoute, useRouter } from '@nuxtjs/composition-api'
import { useTutorialQuiz } from '@/composables/tutorial/use-tutorial.composable'
import TutorialBtn from '@/components/tutorial/TutorialBtn.vue'
import type { RawLocation } from 'vue-router'

export default defineComponent({
  name: 'DashboardTutorialBtn',

  components: {
    TutorialBtn
  },

  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const { turnOffQuiz } = useTutorialQuiz({ store })
    function onClickTutorialBtn() {
      turnOffQuiz()
      router.push({
        name: 'app-library',
        query: {
          tutorial: true,
          tutorialStep: 'step1'
        }
      } as unknown as RawLocation, () => {
        window.setTimeout(() => {
          window.open(route.value.fullPath, '_self')
        }, 0)
      })
    }

    return {
      onClickTutorialBtn
    }
  }
})
</script>
