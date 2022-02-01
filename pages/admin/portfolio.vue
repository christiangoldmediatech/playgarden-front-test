<template>
  <v-container>
    <v-row>
      <v-col v-if="categories.length > 0" cols="12">
        <v-card width="100%" outline class="mb-5">
          <v-card-title>
            <underlined-title class="text-h6 text-md-h5" text="Uploaded worksheet" />

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

        <v-card v-if="loading" width="100%">
          <v-row v-for="n in 5" :key="n">
            <v-col cols="12">
              <v-skeleton-loader
                type="list-item-avatar, divider"
              />
            </v-col>

            <v-col v-for="i in 4" :key="i" cols="3">
              <v-skeleton-loader
                type="card"
              />
            </v-col>
          </v-row>
        </v-card>
        <v-card v-else width="100%">
          <portfolio-carousel
            v-for="category in categories"
            :key="`portfolio-category-${category.curriculumType.id}`"
            :show-child="true"
            class="mx-2 pt-2"
            v-bind="{ category }"
          />
          <portfolio-overlay :child="child" :no-share="true" :info-user="true" />
        </v-card>
      </v-col>
      <v-col v-else cols="12">
        <v-card width="100%" outline class="mb-5">
          <v-card-title>
            <underlined-title class="text-h6 text-md-h5" text="There is not any uploaded worksheet" />

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
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, useRoute, computed, onMounted, watch, useStore } from '@nuxtjs/composition-api'
import PortfolioCarousel from '@/components/app/student-cubby/PortfolioCarousel.vue'
import PortfolioOverlay from '@/components/app/student-cubby/PortfolioOverlay.vue'
import { useOfflineWorksheet, useSnotifyHelper } from '@/composables'
import { OfflineWorksheetLesson, Child, TypedStore } from '@/models'

export default defineComponent({
  name: 'Portfolio',

  layout: 'admin',

  components: {
    PortfolioCarousel,
    PortfolioOverlay
  },

  setup () {
    const route = useRoute()
    const store = useStore<TypedStore>()
    const snotify = useSnotifyHelper()
    const studentId = computed(() => Number(route.value.query.id))
    const uploadedWorksheets = ref<OfflineWorksheetLesson[]>([])
    const child = ref<Child>()
    const loading = ref<Boolean>()

    const { getOfflineWorksheetsByChildId, getChild } = useOfflineWorksheet({ store })
    loading.value = false
    const categories = computed(() => {
      const filtered = uploadedWorksheets.value.filter(({ worksheetUploads }) => worksheetUploads.length > 0)
      return filtered.map((owLesson) => {
        const mappedUploads = owLesson.worksheetUploads.map((owUpload) => {
          return {
            ...owUpload,
            children: child.value
          }
        })

        return {
          ...owLesson,
          worksheetUploads: mappedUploads
        }
      })
    })

    watch(studentId, (val) => {
      if (val) {
        refresh()
      }
    })

    const refresh = async () => {
      if (!studentId.value) {
        return
      }

      try {
        loading.value = true
        uploadedWorksheets.value = await getOfflineWorksheetsByChildId(studentId.value)
        child.value = await getChild(studentId.value)
      } catch (error) {
        snotify.error('Sorry! There was an error loading your progress.')
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      refresh()
    })

    return {
      loading,
      child,
      categories
    }
  },

  methods: {
    goToBack () {
      this.$router.go(-1)
    }
  }
})
</script>
