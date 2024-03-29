<template>
  <v-sheet
    class="mx-auto"
    elevation="8"
  >
    <v-row
      class="mb-6"
      no-gutters
    >
      <v-col cols="1">
        <div class="d-flex fill-height align-center justify-center">
          <v-btn icon @click="previousWorksheets">
            <v-img :src="require('@/assets/png/arrow-left.png')" max-width="12px" />
          </v-btn>
        </div>
      </v-col>
      <v-col
        cols="10"
      >
        <v-row>
          <v-col
            v-for="(offlineWorksheet, offlineWorksheetIndex) in worksheetsPaginate"
            :key="`offlineworksheet-card-item-${offlineWorksheetIndex}`"
            xs="12"
            sm="6"
            md="6"
            lg="4"
            xl="3"
          >
            <worksheet-card
              class="mx-auto ma-4"
              :thumbnail="offlineWorksheet.pdfThumbnail"
              :name="offlineWorksheet.name"
              @click:download="handleDownloadWorksheetClick(offlineWorksheet)"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col
        cols="1"
        class="text-right"
      >
        <div class="d-flex fill-height align-center justify-center">
          <v-btn icon @click="nextWorksheets">
            <v-img
              :src="require('@/assets/png/arrow-right.png')"
              max-width="12px"
            />
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script lang="ts">
import { useLearnPlayV2, useChild, useVuetifyHelper } from '@/composables'
import { defineComponent, useStore, onMounted, ref, computed, watch } from '@nuxtjs/composition-api'
import { TypedStore } from '@/models'
import WorksheetCard from './WorksheetCard.vue'

export default defineComponent({
  name: 'WorksheetCarousel',

  components: {
    WorksheetCard
  },

  props: {
    worksheetsData: {
      type: Array,
      default: () => []
    },
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
    const worksheetsPaginate = ref<any[]>([])
    const vuetify = useVuetifyHelper()
    const currentPage = ref(1)

    function handleDownloadWorksheetClick(item: any) {
      window.open(item.pdfUrl, '_blank')
      saveProgress(item)
    }

    const size = computed(() => {
      switch (vuetify.breakpoint.name) {
        case 'xs': return 1
        case 'sm': return 2
        case 'md': return 2
        case 'lg': return 3
        case 'xl': return 4
      }
    })
    const totalPage = computed(() => {
      const total = (props.worksheetsData && props.worksheetsData.length > 0) ? (props.worksheetsData.length / size.value) : 0
      return Math.ceil(total)
    })

    watch(vuetify.breakpoint, (val:any) => {
      if (val) {
        paginate(currentPage.value)
      }
    })

    const nextWorksheets = () => {
      if (currentPage.value < totalPage.value) {
        currentPage.value++
        paginate(currentPage.value)
      }
    }
    const previousWorksheets = () => {
      if (currentPage.value > 1) {
        currentPage.value--
        paginate(currentPage.value)
      }
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

    function paginate(pageNumber: number) {
      worksheetsPaginate.value = props.worksheetsData.slice((pageNumber - 1) * size.value, pageNumber * size.value)
    }

    onMounted(() => {
      paginate(currentPage.value)
    })

    return {
      worksheetsPaginate,
      handleDownloadWorksheetClick,
      nextWorksheets,
      previousWorksheets
    }
  }
})
</script>
