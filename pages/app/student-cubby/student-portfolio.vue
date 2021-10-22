<template>
  <v-card flat>
    <v-card-text>
      <div class="text-center">
        <!-- Section Title and Description -->
        <div class="d-flex align-center justify-center">
          <img height="80px" src="@/assets/png/student-cubby/group.png">
          <span class="ml-4 text-h4 text-md-h3">PORTFOLIO</span>
        </div>
        <div class="my-6 text-md-h6 text-body-1">
          Keep track of your worksheets and progress!
        </div>
      </div>
    </v-card-text>

    <template
      v-if="!loading && (!uploadedWorksheets || !uploadedWorksheets.length)"
    >
      <v-row justify="center">
        <v-col cols="8">
          <v-row align="center" justify="center">
            <v-col cols="4">
              <v-img
                :src="
                  require('@/assets/png/student-cubby/portfolio/placeholder1.png')
                "
                contain
              />
            </v-col>

            <v-col cols="4">
              <v-img
                :src="
                  require('@/assets/png/student-cubby/portfolio/placeholder2.png')
                "
                contain
              />
            </v-col>

            <v-col cols="4">
              <v-img
                :src="
                  require('@/assets/png/student-cubby/portfolio/placeholder3.png')
                "
                contain
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="8">
          <p class="portfolio-no-uploads">
            You do not have any worksheets uploaded at this time.
          </p>
        </v-col>

        <v-col cols="8">
          <p class="text-justify">
            Take a photo of the completed worksheets and upload them here to
            keep track of progress in tracing, math, science, language and
            cognitive activities.
          </p>
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <div v-if="loading">
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
      </div>

      <div v-else>
        <portfolio-carousel
          v-for="category in categories"
          :key="`portfolio-category-${category.id}`"
          v-bind="{ category }"
        />

        <portfolio-overlay :child="child" />
      </div>
    </template>
  </v-card>
</template>

<script lang="ts">
import PortfolioCarousel from '@/components/app/student-cubby/PortfolioCarousel.vue'
import PortfolioOverlay from '@/components/app/student-cubby/PortfolioOverlay.vue'

import { computed, defineComponent, ref, useRoute, useRouter, useStore, watch } from '@nuxtjs/composition-api'
import { useChild, useChildRoute, useOfflineWorksheet, useSnotifyHelper } from '@/composables'
import { OfflineWorksheet, TypedStore } from '@/models'

export default defineComponent({
  name: 'StudentPortfolio',

  components: {
    PortfolioCarousel,
    PortfolioOverlay
  },

  setup () {
    const route = useRoute()
    const router = useRouter()
    const store = useStore<TypedStore>()
    const snotify = useSnotifyHelper()
    const { childId: studentId } = useChildRoute({ store, route, router })
    const { children } = useChild({ store })
    const { getUploaded } = useOfflineWorksheet({ store })

    const loading = ref(false)
    const uploadedWorksheets = ref<OfflineWorksheet[]>([])

    const categories = computed(() => {
      return uploadedWorksheets.value.filter(({ worksheetUploads }) => worksheetUploads.length > 0)
    })

    const refresh = async () => {
      if (!studentId.value) {
        return
      }

      try {
        loading.value = true
        uploadedWorksheets.value = await getUploaded(studentId.value)
      } catch (error) {
        snotify.error('Sorry! There was an error loading your progress.')
      } finally {
        loading.value = false
      }
    }

    const child = computed(() => children.value.find(({ id }) => id === studentId.value))

    watch(studentId, (val) => {
      if (val) {
        refresh()
      }
    }, { immediate: true })

    return {
      categories,
      child,
      children,
      loading,
      studentId,
      uploadedWorksheets,
      refresh
    }
  }
})
</script>

<style lang="scss">
.portfolio {
  &-subtitle {
    font-size: 20px;
  }
  &-no-uploads {
    font-size: 28px;
    font-weight: bold;
    text-align: center;
  }
  &-text {
    font-size: 20px;
    text-align: center;
  }
}
</style>
