<template>
  <TutorialBtn @click="onClickTutorialBtn" />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useTutorialDialog } from '@/composables/tutorial/use-tutorial.composable'
import TutorialBtn from '@/components/tutorial/TutorialBtn.vue'

export default defineComponent({
  name: 'TutorialBtnWrapper',

  components: {
    TutorialBtn
  },

  setup() {
    const { showTutorialDialog } = useTutorialDialog()
    function onClickTutorialBtn() {
      showTutorialDialog()
    }

    return {
      onClickTutorialBtn
    }
  }
})
</script>
