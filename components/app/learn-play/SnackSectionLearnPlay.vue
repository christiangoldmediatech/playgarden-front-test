<template>
  <div v-if="loading || getSnacks.length > 0">
    <div class="mb-4 d-flex align-center">
      <span class="title-dashboard">
        {{ $t('socialEmotional.common.snack') }}
      </span>

      <section-btn
        class="ml-4"
        :is-download-btn="true"
        :text="`${$t('socialEmotional.common.downloadPdf')}`"
        @click="downloadSnackFiles"
      />
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
            <v-img :src="diy.src" height="200px" class="pg-rounded" />
          </center>
        </v-col>
      </v-row>
    </v-card>
    <v-card v-if="loading" class="justify-center ml-2 mr-8" width="100%">
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
import { useLearnPlayV2, useChild } from '@/composables'
import { FileType, TypedStore } from '@/models'
import SectionBtn from './SectionBtn.vue'

export default defineComponent({
  name: 'SnackSectionLearnPlay',

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

    function downloadSnackFiles() {
      learnPlayV2.computedProps.getSnacks.value.map(({ file, id }: any) => {
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
          type: FileType.SNACK
        }
        const { id } = learnPlayV2.learnPlayData.value
        const data = {
          files: [fileProgress]
        }
        await learnPlayV2.updateProgress({ playAndLearnId: id, childId, data })
      }
    }

    return {
      getSnacks: learnPlayV2.computedProps.getSnacks,
      loading: learnPlayV2.loadingPlayAndLearnFiles,
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
