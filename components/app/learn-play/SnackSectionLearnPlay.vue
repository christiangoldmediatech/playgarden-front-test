<template>
  <div>
    <div class="mb-4 d-flex align-center">
      <span class="title-dashboard">
        Snack
      </span>

      <DownloadButtonLearnPlay class="ml-4" @click="downloadSnackFiles" />
    </div>

    <p v-if="getSnacks.length > 0" class="snack-text">
      {{ getSnacks[0].description }}
    </p>

    <v-card>
      <div
        v-if="getSnacks.length > 0"
        class="diy-images-container mx-2 my-2"
      >
        <div
          v-for="(snack, index) in getSnacks"
          :key="`snack-item-${index}`"
          class="pa-3"
        >
          <img :src="snack.image" height="100%">
        </div>
      </div>
      <v-row v-else class="mx-2 my-2">
        <v-col
          v-for="n in 3"
          :key="`snack-load-item-${n}`"
          cols="12"
          md="4"
        >
          <v-skeleton-loader
            type="image"
          />
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
  name: 'SnackSectionLearnPlay',

  components: {
    DownloadButtonLearnPlay
  },

  setup() {
    const store = useStore()
    const learnPlayV2 = useLearnPlayV2({ store })

    function downloadSnackFiles () {
      learnPlayV2.computedProps.getSnacks.value.map(({ file }: any) => {
        if (file && window) {
          window.open(file, '_blank')
        }
      })
    }

    return {
      getSnacks: learnPlayV2.computedProps.getSnacks,
      downloadSnackFiles
    }
  }
})
</script>

<style lang="scss" scoped>
.snack-text {
  font-weight: 400;
  font-size: 14px;
  color: #606060;
  @media screen and (min-width: 1264px) {
    font-size: 16px;
  }
}

.snack-images-container {
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
