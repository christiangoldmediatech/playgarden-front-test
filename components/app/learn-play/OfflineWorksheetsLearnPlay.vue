<template>
  <div>
    <div class="mb-4 d-flex align-center">
      <span class="title-dashboard">
        Worksheets
      </span>
    </div>
    <div v-if="getOfflineWorksheet.length > 0" class="card-offline">
      <v-slide-group show-arrows="always">
        <template #prev>
          <v-btn icon>
            <v-img :src="require('@/assets/png/arrow-left.png')" max-width="12px" />
          </v-btn>
        </template>
        <v-slide-item
          v-for="(offlineWorksheet, offlineWorksheetIndex) in getOfflineWorksheet"
          :key="`offlineworksheet-card-item-${offlineWorksheetIndex}`"
          class="mx-auto"
        >
          <v-card class="ma-sm-4 ma-xl-6" :max-width="maxWidth">
            <v-img :src="offlineWorksheet.pdfThumbnail || require('@/assets/png/pdf-thumbnail-placeholder.png')" width="300px" height="200px" contain />
            <div class="d-flex flex-nowrap pa-2 align-center">
              <div class="worksheet-title flex-grow-1 pr-2">
                {{ offlineWorksheet.name }}
              </div>

              <div>
                <DownloadButtonLearnPlay
                  @click.stop="handleDownloadWorksheetClick(offlineWorksheet)"
                />
              </div>
            </div>
          </v-card>
        </v-slide-item>
        <template #next>
          <v-btn icon>
            <v-img
              :src="require('@/assets/png/arrow-right.png')"
              max-width="12px"
            />
          </v-btn>
        </template>
      </v-slide-group>
    </div>
    <div v-else>
      <v-card
        v-for="n in 3"
        :key="`worksheet-load-item-${n}`"
        class="my-3"
        cols="4"
      >
        <v-skeleton-loader type="card" />
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import { useLearnPlayV2, useChild, useVuetifyHelper } from '@/composables'
import { defineComponent, useStore, computed } from '@nuxtjs/composition-api'
import { TypedStore } from '@/models'
import DownloadButtonLearnPlay from './DownloadButtonLearnPlay.vue'

export default defineComponent({
  name: 'OfflineWorksheetsLearnPlay',

  components: {
    DownloadButtonLearnPlay
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
    const vuetify = useVuetifyHelper()

    const maxWidth = computed(() => {
      switch (vuetify.breakpoint.name) {
        case 'xs': return 300
        case 'sm': return 300
        case 'md': return 280
        case 'lg': return 280
        case 'xl': return 295
      }
    })

    function handleDownloadWorksheetClick(item: any) {
      window.open(item.pdfUrl, '_blank')
      saveProgress(item)
    }

    const saveProgress = async (item: any) => {
      if (props.previewMode) {
        return
      }

      if (child.currentChildren.value) {
        const childId = child.currentChildren.value[0].id
        const worksheetProgress = { id: item.id, downloaded: true }
        const { id } = learnPlayV2.learnPlayData.value
        const data = {
          worksheets: [worksheetProgress]
        }
        await learnPlayV2.updateProgress({ playAndLearnId: id, childId, data })
      }
    }

    return {
      handleDownloadWorksheetClick,
      getOfflineWorksheet: learnPlayV2.computedProps.getOfflineWorksheet,
      maxWidth
    }
  }
})
</script>

<style lang="scss" scoped>
.worksheet-title {
  font-family: 'Poppins';
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #606060;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
