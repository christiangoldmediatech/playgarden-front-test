<template>
  <v-container>
    <v-row>
      <v-card width="100%">
        <v-col cols="12">
          <h3 v-if="lesson">
            {{ `${lesson.name} - Day ${lesson.day}` }}
          </h3>
        </v-col>
        <v-col cols="12">
          <portfolio-carousel
            v-for="category in categories"
            :key="`portfolio-category-${category.id}`"
            v-bind="{ category }"
          />
        </v-col>
      </v-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, useRoute, computed, onMounted, watch } from '@nuxtjs/composition-api'
import PortfolioCarousel from '@/components/app/student-cubby/PortfolioCarousel.vue'
import { useWorksheetsCategories } from '@/composables/worksheets'
import { useSnotifyHelper } from '@/composables'
import { OfflineWorksheet } from '@/models'

export default defineComponent({
  name: 'UploadedWorksheets',

  layout: 'admin',

  components: {
    PortfolioCarousel
  },

  setup () {
    const route = useRoute()
    const snotify = useSnotifyHelper()
    const lessonId = computed(() => Number(route.value.query.lessonId))
    const uploadedWorksheets = ref<OfflineWorksheet[]>([])

    const { lesson, getUploadedByLesson, getLessonById } = useWorksheetsCategories()

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
        uploadedWorksheets.value = await getUploadedByLesson(lessonId.value)
      } catch (error) {
        snotify.error('Sorry! There was an error loading your progress.')
      }
    }

    onMounted(async () => {
      refresh()
      await getLessonById(lessonId.value)
    })

    return {
      lesson,
      categories
    }
  }
})
</script>
