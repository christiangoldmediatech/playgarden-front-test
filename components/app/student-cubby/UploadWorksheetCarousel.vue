<template>
  <v-sheet
    class="mx-auto"
    elevation="0"
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
            v-for="(worksheet, worksheetIndex) in worksheetsPaginate"
            :key="`worksheet-card-item-${worksheetIndex}`"
            xs="12"
            sm="6"
            md="6"
            lg="4"
            xl="3"
          >
            <uploaded-card v-if="worksheet.type === 'worksheet'" :child="child" :worksheet="worksheet" />
            <v-card
              v-else
              elevation="0"
              height="210"
              width="200"
              class="d-flex flex-column items-center justify-center"
              :class="{
                'ml-6': worksheetsData && worksheetsData.length
              }"
              @click="$emit('click:upload')"
            >
              <v-progress-circular
                v-if="loading"
                color="success"
                indeterminate
                size="42"
                width="4"
                class="mb-4"
              />
              <v-icon v-else size="140" color="primary">
                mdi-plus-circle
              </v-icon>
              <span class="add-upload-text font-bold ">
                {{ loadingText }}
              </span>
            </v-card>
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
import { useLanguageHelper, useVuetifyHelper } from '@/composables'
import { defineComponent, onMounted, ref, computed, watch } from '@nuxtjs/composition-api'
import WorksheetCard from '../learn-play/WorksheetCard.vue'
import UploadedCard from './UploadedCard.vue'

export default defineComponent({
  name: 'UploadWorksheetCarousel',

  components: {
    WorksheetCard,
    UploadedCard
  },

  props: {
    loading: {
      type: Boolean,
      default: false
    },
    child: {
      type: Object,
      default: () => {}
    },
    worksheetsData: {
      type: Array,
      default: () => []
    },
    previewMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click:upload'],
  setup(props) {
    const language = useLanguageHelper()

    const worksheetsPaginate = ref<any[]>([])
    const vuetify = useVuetifyHelper()
    const currentPage = ref(1)

    const worksheetsWithUploadButton = computed(() => {
      if (!props.worksheetsData) {
        return [{ type: 'upload-btn' }]
      }

      const formattedWorksheets = props.worksheetsData.map((worksheet: any) => ({ ...worksheet, type: 'worksheet' }))

      return [...formattedWorksheets, { type: 'upload-btn' }]
    })

    const loadingText = computed(() => props.loading ? language.t('studentCubby.portfolio.verifying') : language.t('studentCubby.portfolio.upload'))

    function handleDownloadWorksheetClick(item: any) {
      window.open(item.pdfUrl, '_blank')
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
      const total = (worksheetsWithUploadButton.value && worksheetsWithUploadButton.value.length > 0) ? (worksheetsWithUploadButton.value.length / size.value) : 0
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

    function paginate(pageNumber: number) {
      worksheetsPaginate.value = worksheetsWithUploadButton.value.slice((pageNumber - 1) * size.value, pageNumber * size.value)
    }

    onMounted(() => {
      paginate(currentPage.value)
    })

    return {
      worksheetsPaginate,
      handleDownloadWorksheetClick,
      nextWorksheets,
      previousWorksheets,
      loadingText
    }
  }
})
</script>
