<template>
  <div class="mb-4">
    <div class="mb-4 d-flex align-center">
      <span class="title-dashboard">
        Art Project
      </span>

      <DownloadButtonLearnPlay class="ml-4" @click="downloadArtFiles" />
    </div>

    <p v-if="getArtProjects.length > 0" class="art-text">
      {{ getArtProjects[0].description }}
    </p>

    <v-row class="mx-1 mt-4">
      <v-card
        v-if="getArtProjects.length > 0"
        class="justify-center"
        width="100%"
      >
        <v-row
          v-for="(art, index) in getArtProjects[0].image"
          :key="`art-project-${index}`"
          justify="center"
          align="center"
          class="my-4"
        >
          <center v-if="art.src">
            <v-img
              :src="art.src"
              max-width="230"
              min-width="230"
              height="153"
            />
          </center>
        </v-row>
      </v-card>
      <v-card v-else class="justify-center ml-2 mr-8" width="100%">
        <v-row
          v-for="n in 3"
          :key="`art-load-project-${n}`"
          justify="center"
          align="center"
          class="my-4"
        >
          <v-card width="70%">
            <v-skeleton-loader type="image" />
          </v-card>
        </v-row>
      </v-card>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, useStore } from '@nuxtjs/composition-api'
import { useLearnPlayV2 } from '@/composables'
import DownloadButtonLearnPlay from './DownloadButtonLearnPlay.vue'

export default defineComponent({
  name: 'ArtProjectLearnPlay',

  components: {
    DownloadButtonLearnPlay
  },

  setup() {
    const store = useStore()
    const learnPlayV2 = useLearnPlayV2({ store })

    function downloadArtFiles() {
      learnPlayV2.computedProps.getArtProjects.value.map((data: any) => {
        const { file } = data
        if (file && window) {
          window.open(file, '_blank')
        }
      })
    }

    return {
      getArtProjects: learnPlayV2.computedProps.getArtProjects,
      downloadArtFiles
    }
  }
})
</script>

<style lang="scss" scoped>
.art-text {
  font-weight: 400;
  font-size: 14px;
  color: #606060;
  @media screen and (min-width: 1264px) {
    font-size: 16px;
  }
}
</style>
