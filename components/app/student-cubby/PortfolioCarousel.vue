<template>
  <v-row no-gutters class="mb-4">
    <v-col cols="12">
      <v-row no-gutters align="end" class="mb-2">
        <template v-if="isLetter(category.curriculumType.name)">
          <div class="mr-3">
            <span
              class="text-uppercase font-weight-bold portfolio-carousel-title d-flex align-center"
            >
              LETTER
              <recorded-letter
                :letter="category.curriculumType"
                small
                list-mode
              />
            </span>
          </div>
        </template>
        <template v-else>
          <div class="mr-3">
            <span
              class="text-uppercase font-weight-bold portfolio-carousel-title d-flex align-center"
            >
              {{ category.curriculumType.name }}
            </span>
          </div>

          <img :src="category.curriculumType.icon" height="32" class="mr-2">
        </template>
      </v-row>
    </v-col>

    <v-col cols="12">
      <v-row no-gutters>
        <v-col
          v-for="upload in list"
          :key="`category-${category.curriculumType.id}-card-${upload.id}`"
          cols="12"
          sm="6"
          lg="3"
        >
          <portfolio-card
            :entity-id="upload.id"
            entity-type="WORKSHEET"
            :image="upload.url"
            :created="upload.uploadedDate"
            :lesson="{
              curriculumType: category.curriculumType,
              day: upload.day
            }"
            :child="getChild(upload)"
          />
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="6">
      <v-btn text :disabled="page === 1" @click.stop="moveCarousel(-1)">
        <v-img
          :src="require('@/assets/png/player/left-arrow.svg')"
          max-width="32px"
        />
      </v-btn>
    </v-col>

    <v-col class="text-right" cols="6">
      <v-btn
        text
        :disabled="page * limit >= total"
        @click.stop="moveCarousel(1)"
      >
        <v-img
          :src="require('@/assets/png/player/right-arrow.svg')"
          max-width="32px"
        />
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  computed,
  useRoute
} from '@nuxtjs/composition-api'
import { useNuxtHelper, useVuetifyHelper } from '@/composables'
import { OfflineWorksheetLesson } from '@/models'
import { jsonCopy, isLetter } from '@/utils'
import RecordedLetter from '@/components/app/live-sessions/recorded/RecordedLetter.vue'
import PortfolioCard from './PortfolioCard.vue'

export default defineComponent({
  name: 'PortfolioCarousel',

  components: {
    PortfolioCard,
    RecordedLetter
  },

  props: {
    category: {
      type: Object as PropType<OfflineWorksheetLesson>,
      required: true
    }
  },

  setup(props) {
    const nuxt = useNuxtHelper()
    const $vuetify = useVuetifyHelper()
    const page = ref(props.category.page ? props.category.page : 1)
    const route = useRoute()

    const isAdmin = computed(() => {
      return route.value.name!.includes('admin')
    })

    const limit = computed(() => {
      if (isAdmin.value) {
        return 20
      }
      if ($vuetify.breakpoint.sm) {
        return 2
      }
      if ($vuetify.breakpoint.xs) {
        return 1
      }
      return 4
    })

    const total = computed(() => {
      return props.category.worksheetUploads
        ? props.category.worksheetUploads.length
        : 0
    })

    const start = computed(() => {
      return (page.value - 1) * limit.value
    })

    const end = computed(() => {
      return start.value + limit.value < total.value
        ? start.value + limit.value
        : total.value
    })

    const list = computed(() => {
      if (total.value > 0) {
        const worksheets = jsonCopy(props.category.worksheetUploads)
        if (isAdmin.value) {
          return worksheets
        }
        return worksheets.slice(start.value, end.value)
      }
      return []
    })

    function moveCarousel(direction: number) {
      page.value += direction
      if (isAdmin.value) {
        nuxt.$emit('update-list-worksheets-uploads', { page: page.value })
      }
    }

    function getChild(upload: any) {
      return upload.children ? upload.children : null
    }

    return {
      page,
      limit,
      total,
      start,
      end,
      list,
      moveCarousel,
      getChild,
      isLetter,
      isAdmin
    }
  }
})
</script>

<style lang="scss" scoped>
.portfolio-carousel-title {
  color: #606060;
  font-size: 36px;
  line-height: 1.5;
  letter-spacing: 5.4px;
}
</style>
