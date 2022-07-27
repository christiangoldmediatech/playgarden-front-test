<template>
  <div>
    <div class="mb-4 d-flex align-center">
      <span class="title-dashboard">
        Worksheets
      </span>
    </div>

    <div v-if="getOfflineWorksheet.length > 0" class="card-offline">
      <v-card
        v-for="(
          offlineWorksheet, offlineWorksheetIndex
        ) in getOfflineWorksheet"
        :key="`offlineworksheet-card-item-${offlineWorksheetIndex}`"
        class="mb-3"
        :enabled="true"
        width="100%"
        elevation="6"
        :ripple="false"
        @click.stop="handleDownloadWorksheetClick(offlineWorksheet)"
      >
        <div class="d-flex flex-nowrap pa-2 align-center">
          <div class="text-uppercase dashboard-item-title flex-grow-1">
            {{ offlineWorksheet.name }}
          </div>

          <div>
            <DownloadButtonLearnPlay @click.stop="handleDownloadWorksheetClick(offlineWorksheet)" />
          </div>
        </div>
      </v-card>
    </div>
    <div v-else>
      <v-card
        v-for="n in 3"
        :key="`worksheet-load-item-${n}`"
        class="my-3"
        cols="4"
      >
        <v-skeleton-loader
          type="list-item-avatar"
        />
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import { useLearnPlayV2, useChild } from '@/composables'
import { defineComponent, useStore } from '@nuxtjs/composition-api'
import { TypedStore } from '@/models'
import DownloadButtonLearnPlay from './DownloadButtonLearnPlay.vue'

export default defineComponent({
  name: 'OfflineWorksheetsLearnPlay',

  components: {
    DownloadButtonLearnPlay
  },

  setup() {
    const store = useStore()
    const learnPlayV2 = useLearnPlayV2({ store })
    const childStore = useStore<TypedStore>()
    const child = useChild({ store: childStore })

    function handleDownloadWorksheetClick(item: any) {
      window.open(item.pdfUrl, '_blank')
      saveProgress(item)
    }

    const saveProgress = async (item: any) => {
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
      getOfflineWorksheet: learnPlayV2.computedProps.getOfflineWorksheet
    }
  }
})
</script>
