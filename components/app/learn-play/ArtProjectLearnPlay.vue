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

    <v-card>
      <v-row v-if="getArtProjects.length > 0" class="mx-0">
        <v-col v-for="(art, index) in getArtProjects" :key="`art-project-${index}`" cols="12">
          <v-img
            contain
            :src="art.image"
          />
        </v-col>
      </v-row>
      <template v-else>
        <v-row
          v-for="n in 3"
          :key="`art-load-project-${n}`"
          justify="center"
          align="center"
          class="mb-3"
        >
          <v-card width="70%">
            <v-skeleton-loader
              type="image"
            />
          </v-card>
        </v-row>
      </template>
    </v-card>
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

    function downloadArtFiles () {
      learnPlayV2.computedProps.getArtProjects.value.map((file: any) => {
        if (window && file) {
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
