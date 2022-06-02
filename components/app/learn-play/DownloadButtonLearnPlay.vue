<template>
  <!-- <a :href="fileUrl" :download="fileName"> -->
  <div
    class="download-button"
    :class="{ 'download-button-scaled': scaleIcon }"
    v-on="$listeners"
    @mouseenter="scaleUp"
    @mouseleave="scaleDown"
  >
    <v-img
      height="32px"
      aspect-ratio="1"
      contain
      :src="
        require('@/assets/png/dashboard/download-ico.png')
      "
    />
  </div>
  <!-- </a> -->
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'
import { useIconScale } from '@/composables'

export default defineComponent({
  name: 'DownloadButtonLearnPlay',

  // props: {
  //   fileUrl: {
  //     type: String,
  //     required: true
  //   }
  // },

  setup() {
    const iconScale = useIconScale()
    // const fileName = computed(() => {
    //   return new URL(props.fileUrl).pathname.split('/').pop()
    // })

    return {
      ...iconScale
      // fileName
    }
  }
})
</script>

<style lang="scss" scoped>
.download-button {
  display: inline-block;
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: transform 250ms ease-in-out;

  &.download-button-scaled {
    transform: scale(1.25);
  }
}
</style>
