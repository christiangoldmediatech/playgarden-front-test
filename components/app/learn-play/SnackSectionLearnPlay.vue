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

    <v-card v-if="getSnacks.length > 0" width="93%" class="mt-5 ml-3">
      <v-row v-if="getSnacks.length > 0" class="mx-2 my-2">
        <v-col
          v-for="(diy, index) in getSnacks[0].image"
          :key="`diy-item-${index}`"
          cols="4"
          md="4"
        >
          <center v-if="diy.src">
            <v-img :src="diy.src" height="150px" class="pg-rounded" />
          </center>
        </v-col>
      </v-row>
    </v-card>
    <v-card v-else class="justify-center ml-2 mr-8" width="100%">
      <v-row
        v-for="n in 3"
        :key="`snack-load-project-${n}`"
        justify="center"
        align="center"
        class="my-4"
      >
        <v-card width="70%">
          <v-skeleton-loader type="image" />
        </v-card>
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

    function downloadSnackFiles() {
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
