<template>
  <v-container>
    <v-row>
      <v-card v-if="categories.length === 0 && !loading" width="100%">
        <v-card-title>
          <underlined-title
            class="text-h6 text-md-h5"
            text="There is not any uploaded worksheet"
          />

          <v-spacer />

          <v-btn
            class="ml-3 text-none"
            color="accent darken-1"
            depressed
            nuxt
            small
            @click="goToBack"
          >
            Back
          </v-btn>
        </v-card-title>
      </v-card>
      <v-row v-else class="mx-2" width="100%">
        <v-col cols="12">
          <v-card v-if="lesson" width="100%">
            <v-card-title>
              <underlined-title
                class="text-h6 text-md-h5"
                :text="`${lesson.name} - Day ${lesson.day}`"
              />

              <v-spacer />

              <v-btn
                class="ml-3 text-none"
                color="accent darken-1"
                depressed
                nuxt
                small
                @click="goToBack"
              >
                Back
              </v-btn>
            </v-card-title>
          </v-card>
        </v-col>
        <v-col v-if="loading" cols="12">
          <v-row v-for="n in 5" :key="n">
            <v-col cols="12">
              <v-skeleton-loader type="list-item-avatar, divider" />
            </v-col>

            <v-col v-for="i in 4" :key="i" cols="3">
              <v-skeleton-loader type="card" />
            </v-col>
          </v-row>
        </v-col>
        <v-col v-else cols="12">
          <v-card v-if="lesson" width="100%">
            <portfolio-carousel
              v-for="category in categories"
              :key="`portfolio-category-${category.id}`"
              class="mx-2 pt-3"
              :show-child="true"
              v-bind="{ category }"
            />

            <portfolio-overlay :no-share="true" :info-user="true" />
          </v-card>
        </v-col>
      </v-row>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useRoute,
  computed,
  onMounted,
  watch, onBeforeUnmount
} from '@nuxtjs/composition-api'
import PortfolioCarousel from '@/components/app/student-cubby/PortfolioCarousel.vue'
import PortfolioOverlay from '@/components/app/student-cubby/PortfolioOverlay.vue'
import { useWorksheetsCategories } from '@/composables/worksheets'
import { useNuxtHelper, useSnotifyHelper } from '@/composables'
import { OfflineWorksheet } from '@/models'

export default defineComponent({
  name: 'UploadedWorksheets',

  layout: 'admin',

  components: {
    PortfolioCarousel,
    PortfolioOverlay
  },

  setup(props, context) {
    const route = useRoute()
    const snotify = useSnotifyHelper()
    const nuxt = useNuxtHelper()
    const lessonId = computed(() => Number(route.value.query.lessonId))
    const uploadedWorksheets = ref<OfflineWorksheet[]>([])
    const loading = ref<Boolean>()

    const { lesson, getUploadedByLesson, getLessonById } =
      useWorksheetsCategories()
    loading.value = false
    const categories = computed(() => {
      return uploadedWorksheets.value.filter(
        ({ worksheetUploads }) => worksheetUploads.length > 0
      )
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
        uploadedWorksheets.value = await getUploadedByLesson(lessonId.value, 20, 1)
      } catch (error) {
        snotify.error('Sorry! There was an error loading the page.')
      } finally {
        loading.value = false
      }
    }

    onMounted(async () => {
      refresh()
      await getLessonById(lessonId.value)
      nuxt.$on('update-list-worksheets-uploads', async ({ page }: {page: number}) => {
        const data: any = await getUploadedByLesson(lessonId.value, 20, page)
        if (data[0].worksheetUploads.length > 0) {
          uploadedWorksheets.value = data
        }
      })
    })

    onBeforeUnmount(() => {
      nuxt.$off('update-list-worksheets-uploads')
    })

    return {
      lesson,
      categories,
      loading
    }
  },
  methods: {
    goToBack() {
      this.$router.go(-1)
    }
  }
})
</script>
