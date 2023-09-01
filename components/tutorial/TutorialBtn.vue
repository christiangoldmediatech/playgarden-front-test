<template>
  <VBtn
    class="!pg-h-auto !pg-normal-case !pg-px-4 !pg-py-2 !pg-rounded-[10px] !pg-shadow-[0px_4px_4px_rgba(0,0,0,0.15)]"
    color="white"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <div class="pg-flex pg-flex-nowrap pg-items-center">
      <img class="pg-mr-[5px] pg-h-[48px]" src="@/assets/webp/tutorial/icon-tutorial-button.webp" />
      <div class="pg-text-center !pg-font-[Quicksand] pg-font-bold pg-text-[#68C453] !pg-text-base !pg-tracking-normal">
        Interactive<br />
        Tutorial
      </div>
    </div>
  </VBtn>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'TutorialBtn'
})
</script>
