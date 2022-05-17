<template>
  <div>
    <div class="mb-4 d-flex align-center">
      <span class="title-dashboard">
        DIY Project
      </span>

      <DownloadButtonLearnPlay class="ml-4" @click="downloadDiyFiles" />
    </div>

    <p v-if="getDiyProject.length > 0" class="diy-text">
      {{ getDiyProject[0].description }}
    </p>

    <v-card>
      <div
        v-if="getDiyProject.length > 0"
        class="diy-images-container mx-2 my-2"
      >
        <div
          v-for="(diy, index) in getDiyProject"
          :key="`diy-item-${index}`"
          class="pa-3"
        >
          <img :src="diy.image" height="100%">
        </div>
      </div>
      <v-row v-else class="mx-2 my-2">
        <v-col v-for="n in 3" :key="`diy-load-item-${n}`" cols="4">
          <v-skeleton-loader type="image" />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, useStore } from '@nuxtjs/composition-api'
import { useLearnPlayV2 } from '@/composables'
import DownloadButtonLearnPlay from './DownloadButtonLearnPlay.vue'

export default defineComponent({
  name: 'DiyProjectLearnPlay',

  components: {
    DownloadButtonLearnPlay
  },

  setup() {
    const store = useStore()
    const learnPlayV2 = useLearnPlayV2({ store })

    function downloadDiyFiles() {
      learnPlayV2.computedProps.getDiyProject.value.map(({ file }: any) => {
        if (file && window) {
          window.open(file, '_blank')
        }
      })
    }

    return {
      getDiyProject: learnPlayV2.computedProps.getDiyProject,
      downloadDiyFiles
    }
  }
})
</script>

<style lang="scss" scoped>
.diy-text {
  font-weight: 400;
  font-size: 14px;
  color: #606060;
  @media screen and (min-width: 1264px) {
    font-size: 16px;
  }
}

.diy-images-container {
  display: flex;

  @media screen and (min-width: 1264px) {
    aspect-ratio: 2.133;
    width: 100%;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
  }
}
</style>
