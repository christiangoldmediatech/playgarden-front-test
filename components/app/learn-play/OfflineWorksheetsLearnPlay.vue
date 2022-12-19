<template>
  <div>
    <div class="mb-4 d-flex align-center">
      <span class="title-dashboard">
        Worksheets
      </span>
    </div>
    <div v-if="getOfflineWorksheet.length > 0" class="card-offline">
      <workshhet-carousel :worksheets-data="getOfflineWorksheet" />
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
import { defineComponent, useStore } from '@nuxtjs/composition-api'
import { TypedStore } from '@/models'
import WorkshhetCarousel from './WorksheetCarousel.vue'

export default defineComponent({
  name: 'OfflineWorksheetsLearnPlay',

  components: {
    WorkshhetCarousel
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
    const selectedWorksheet = null

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
      selectedWorksheet
    }
  }
})
</script>

<style lang="scss" scoped>
.worksheet-title {
  font-family: 'Poppins';
  font-weight: 700;
  font-size: 16px;
  color: #606060;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.worksheet-card{
  width: calc(38.5vw - 256px)!important;
}
</style>
