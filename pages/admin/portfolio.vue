<template>
  <v-container>
    <v-row>
      <v-card width="100%">
        <v-col v-if="categories.length > 0" cols="12">
          <portfolio-carousel
            v-for="category in categories"
            :key="`portfolio-category-${category.id}`"
            :show-child="true"
            v-bind="{ category }"
          />
        </v-col>
        <v-col v-else cols="12">
          <p
            class="font-weight-bold mb-6 pg-letter-spacing text-center text-h5 text-md-left"
          >
            <underlined-title class="text-h6 text-md-h5" text="NO FILES UPLOADED" />
          </p>
        </v-col>
      </v-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, useRoute, computed, onMounted, watch, useStore } from '@nuxtjs/composition-api'
import PortfolioCarousel from '@/components/app/student-cubby/PortfolioCarousel.vue'
import { useOfflineWorksheet, useSnotifyHelper } from '@/composables'
import { OfflineWorksheet, TypedStore } from '@/models'

export default defineComponent({
  name: 'Portfolio',

  layout: 'admin',

  components: {
    PortfolioCarousel
  },

  setup () {
    const route = useRoute()
    const store = useStore<TypedStore>()
    const snotify = useSnotifyHelper()
    const studentId = computed(() => Number(route.value.query.id))
    const uploadedWorksheets = ref<OfflineWorksheet[]>([])

    const { getUploaded } = useOfflineWorksheet({ store })

    const categories = computed(() => {
      return uploadedWorksheets.value.filter(({ worksheetUploads }) => worksheetUploads.length > 0)
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
        uploadedWorksheets.value = await getUploaded(studentId.value)
      } catch (error) {
        snotify.error('Sorry! There was an error loading your progress.')
      }
    }

    onMounted(() => {
      refresh()
    })

    return {
      categories
    }
  }
})
</script>
