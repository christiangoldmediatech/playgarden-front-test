<template>
  <div v-if="loading || getArtProjects.length > 0" class="mb-4">
    <div class="mb-4 d-flex align-center">
      <span class="title-dashboard">
        Sensory Play
      </span>

      <section-btn class="ml-4" :is-download-btn="true" text="Download PDF" @click="downloadArtFiles" />
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
      <v-card v-if="loading" class="justify-center ml-2 mr-8" width="100%">
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
import { useLearnPlayV2, useChild } from '@/composables'
import { FileType, TypedStore } from '@/models'
import SectionBtn from './SectionBtn.vue'

export default defineComponent({
  name: 'ArtProjectLearnPlay',

  components: {
    SectionBtn
  },

  props: {
    previewMode: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const store = useStore()
    const learnPlayV2 = useLearnPlayV2({ store })
    const childStore = useStore<TypedStore>()
    const child = useChild({ store: childStore })

    function downloadArtFiles() {
      learnPlayV2.computedProps.getArtProjects.value.map((data: any) => {
        const { file, id } = data
        if (file && window) {
          saveProgress(id)
          window.open(file, '_blank')
        }
      })
    }

    const saveProgress = async (fileId: number) => {
      if (props.previewMode) {
        return
      }

      if (child.currentChildren.value) {
        const childId = child.currentChildren.value[0].id
        const fileProgress = {
          id: fileId,
          downloaded: true,
          type: FileType.ART_PROJECT
        }
        const { id } = learnPlayV2.learnPlayData.value
        const data = {
          files: [fileProgress]
        }
        await learnPlayV2.updateProgress({ playAndLearnId: id, childId, data })
      }
    }

    return {
      getArtProjects: learnPlayV2.computedProps.getArtProjects,
      loading: learnPlayV2.loadingPlayAndLearnFiles,
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
