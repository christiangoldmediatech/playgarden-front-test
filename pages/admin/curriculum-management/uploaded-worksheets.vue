<template>
  <v-container>
    <v-row>
      upload worksheets
      <portfolio-carousel
        v-for="category in categoriesWorksheet"
        :key="`portfolio-category-${category.id}`"
        v-bind="{ category }"
      />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, useRoute, computed, onMounted } from '@nuxtjs/composition-api'
import PortfolioCarousel from '@/components/app/student-cubby/PortfolioCarousel.vue'
import { useWorksheetsCategories } from '@/composables/worksheets'
export default defineComponent({
  name: 'UploadedWorksheets',

  layout: 'admin',

  components: {
    PortfolioCarousel
  },

  setup () {
    const route = useRoute()
    const lessonId = computed(() => Number(route.value.query.lessonId))
    computed(async () => await getLessonById(lessonId.value))

    const { lesson, getLessonById, categoriesWorksheet } = useWorksheetsCategories()

    onMounted(async () => {
      await getLessonById(lessonId.value)
    })

    return {
      categoriesWorksheet
    }
  }
})
</script>
