<template>
  <v-container>
    <v-row>
      <v-card width="100%">
        <v-col cols="12">
          <h3 v-if="lesson">
            {{ `${lesson.name} - Day ${lesson.day}` }}
          </h3>
        </v-col>
        <v-col v-if="loading" cols="12">
          <v-row v-for="n in 5" :key="n">
            <v-col cols="12">
              <v-skeleton-loader
                v-bind="attrs"
                type="list-item-avatar, divider"
              />
            </v-col>

            <v-col v-for="i in 4" :key="i" cols="3">
              <v-skeleton-loader
                v-bind="attrs"
                type="card"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col v-else cols="12">
          <portfolio-carousel
            v-for="category in categories"
            :key="`portfolio-category-${category.id}`"
            :show-child="true"
            v-bind="{ category }"
          />

          <portfolio-overlay :no-share="true" />
        </v-col>
      </v-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, useRoute, computed, onMounted, watch } from '@nuxtjs/composition-api'
import PortfolioCarousel from '@/components/app/student-cubby/PortfolioCarousel.vue'
import PortfolioOverlay from '@/components/app/student-cubby/PortfolioOverlay.vue'
import { useWorksheetsCategories } from '@/composables/worksheets'
import { useSnotifyHelper } from '@/composables'
import { OfflineWorksheet } from '@/models'

export default defineComponent({
  name: 'UploadedWorksheets',

  layout: 'admin',

  components: {
    PortfolioCarousel,
    PortfolioOverlay
  },

  setup () {
    const route = useRoute()
    const snotify = useSnotifyHelper()
    const lessonId = computed(() => Number(route.value.query.lessonId))
    const uploadedWorksheets = ref<OfflineWorksheet[]>([])
    const loading = ref<Boolean>()

    const { lesson, getUploadedByLesson, getLessonById } = useWorksheetsCategories()
    loading.value = false
    const categories = computed(() => {
      return uploadedWorksheets.value.filter(({ worksheetUploads }) => worksheetUploads.length > 0)
    })

    watch(lessonId, (val) => {
      if (val) {
        refresh()
      }
    })

    const refresh = async () => {
      if (!lessonId.value) {
        return
      }

      try {
        loading.value = true
        uploadedWorksheets.value = await getUploadedByLesson(lessonId.value)
      } catch (error) {
        snotify.error('Sorry! There was an error loading the page.')
      } finally {
        loading.value = false
      }
    }

    onMounted(async () => {
      refresh()
      await getLessonById(lessonId.value)
    })

    return {
      lesson,
      categories,
      loading
    }
  }
})
</script>
