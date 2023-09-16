<template>
  <div class="w-100 d-flex my-4 pa-0 pa-md-4 scrollable-container">
    <worksheet-card
      v-for="(worksheet, index) in worksheets"
      :key="`worksheet-card-${index}`"
      class="mr-4 mb-4 mb-md-0 worksheet-card"
      :horizontal-mode="isMobile"
      :name="worksheet.name"
      :thumbnail="worksheet.pdfThumbnail"
      @click:download="handleDownloadWorksheetClick(worksheet)"
    />
  </div>
</template>

<script lang="ts">
import { useVuetifyHelper } from '@/composables'
import { Lesson } from '@/models'
import { defineComponent, PropType, computed } from '@nuxtjs/composition-api'
import WorksheetCard from '../learn-play/WorksheetCard.vue'

export default defineComponent({
  name: 'WorksheetsWrapper',
  props: {
    worksheets: {
      type: Array as PropType<Array<Lesson & { pdfThumbnail: string }>>,
      default: () => [] as Lesson[]
    }
  },
  components: { WorksheetCard },
  setup() {
    const vuetify = useVuetifyHelper()

    const isMobile = computed(() => vuetify.breakpoint.smAndDown)

    const handleDownloadWorksheetClick = (item: any) => {
      window.open(item.pdfUrl, '_blank')
    }

    return { handleDownloadWorksheetClick, isMobile }
  }
})
</script>

<style lang="scss" scoped>
.scrollable-container {
  flex-direction: column !important;

  @media (min-width: $breakpoint-sm) {
    overflow-x: scroll;
    flex-direction: row !important;
  }
}

.worksheet-card {
  width: 100%;

  @media (min-width: $breakpoint-sm) {
    width: 25%;
  }
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #F2F2F2;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #68C453;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
