<template>
  <div>
    <div v-if="loading || getDiyProject.length > 0" class="mb-4 d-flex align-center">
      <span class="title-dashboard">
        {{ $t('socialEmotional.common.diyProject') }}
      </span>

      <section-btn class="ml-4" :text="`${$t('socialEmotional.common.goToProject')}`" :is-download-btn="false" @click="downloadDiyFiles" />
    </div>

    <p v-if="getDiyProject.length > 0" class="diy-text">
      {{ getDiyProject[0].description }}
    </p>

    <v-card width="93%" class="mt-5 ml-3">
      <v-row v-if="getDiyProject.length > 0" class="mx-2 my-2">
        <v-col
          v-for="(diy, index) in getDiyProject[0].image"
          :key="`diy-item-${index}`"
          cols="4"
          md="4"
        >
          <center v-if="diy.src">
            <v-img :src="diy.src" height="200px" class="pg-rounded" />
          </center>
        </v-col>
      </v-row>
      <v-row v-if="loading" class="mx-2 my-2">
        <v-col v-for="n in 3" :key="`diy-load-item-${n}`" cols="4">
          <v-skeleton-loader type="image" />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, useStore } from '@nuxtjs/composition-api'
import { useLearnPlayV2, useChild } from '@/composables'
import { FileType, TypedStore } from '@/models'
import SectionBtn from './SectionBtn.vue'

export default defineComponent({
  name: 'DiyProjectLearnPlay',

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

    function downloadDiyFiles() {
      learnPlayV2.computedProps.getDiyProject.value.map(({ file, id }: any) => {
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
          type: FileType.DIY_PROJECT
        }
        const { id } = learnPlayV2.learnPlayData.value
        const data = {
          files: [fileProgress]
        }
        await learnPlayV2.updateProgress({ playAndLearnId: id, childId, data })
      }
    }

    return {
      getDiyProject: learnPlayV2.computedProps.getDiyProject,
      loading: learnPlayV2.loadingPlayAndLearnFiles,
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
