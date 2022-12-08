<template>
  <v-sheet
    class="mx-auto"
    elevation="8"
  >
    <v-container class="">
      <v-row
        class="mb-6"
        no-gutters
      >
        <v-col
          cols="1"
        >
          <div class="d-flex fill-height align-center justify-center">
            <v-btn icon>
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
              cols="4"
              sm="12"
              lg="4"
              xl="3"
            >
              <v-card
                class="mx-auto worksheet-card"
              >
                <v-img :src="offlineWorksheet.pdfThumbnail || require('@/assets/png/pdf-thumbnail-placeholder.png')" max-height="200px" contain />

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
            </v-col>
          </v-row>
        </v-col>
        <v-col
          cols="1"
          class="text-right"
        >
          <div class="d-flex fill-height align-center justify-center">
            <v-btn icon>
              <v-img
                :src="require('@/assets/png/arrow-right.png')"
                max-width="12px"
              />
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script lang="ts">
import { useLearnPlayV2, useChild, useVuetifyHelper } from '@/composables'
import { defineComponent, useStore, onMounted, ref, computed } from '@nuxtjs/composition-api'
import { TypedStore } from '@/models'
import DownloadButtonLearnPlay from './DownloadButtonLearnPlay.vue'

export default defineComponent({
  name: 'WorksheetCarousel',

  components: {
    DownloadButtonLearnPlay
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
    console.log(props)
    const store = useStore()
    const learnPlayV2 = useLearnPlayV2({ store })
    const childStore = useStore<TypedStore>()
    const child = useChild({ store: childStore })
    const worksheetsPaginate = ref<any[]>([])
    const vuetify = useVuetifyHelper()

    function handleDownloadWorksheetClick(item: any) {
      window.open(item.pdfUrl, '_blank')
      saveProgress(item)
    }

    const size = computed(() => {
      switch (vuetify.breakpoint.name) {
        case 'xs': return 1
        case 'sm': return 1
        case 'md': return 3
        case 'lg': return 3
        case 'xl': return 4
      }
    })

    const nextWorksheets = () => {
      paginate(1)
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
      paginate(1)
    })

    return {
      worksheetsPaginate,
      handleDownloadWorksheetClick,
      nextWorksheets
    }
  }
})
</script>

<style lang="scss" scoped>
.worksheet-title {
  font-family: 'Poppins';
  font-weight: 700;
  line-height: 1.3;
  text-overflow: ellipsis;
  color: #606060;
  overflow: hidden;
}
.worksheet-card{
  min-height: 280px !important;
  max-height: 280px !important;
}

</style>
