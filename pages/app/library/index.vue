<template>
  <library-layout
    title="Library"
    :loading="isLoadingInitialData"
    show-favorites
  >
    <!-- Video of the Week / More for you -->
    <library-inline-player />

    <!-- Browse by letters / Browse by category -->
    <library-content-section
      :titles="{
        columnA: 'Browse by Letters',
        columnB: 'Browse by Category'
      }"
      :height-override="`${libraryLetterBrowserY + 64}px`"
    >
      <template #columnA>
        <library-letter-video-browser
          id="library-letter-video-browser"
          v-bind="{ letters }"
        />
      </template>
      <template #columnB>
        <category-video-card
          v-for="(category, index) in categories"
          :key="`libray-category-id-${category.id}`"
          :class="{
            'mr-2 mr-lg-0 mb-lg-2': !isLastIndex(index, categories)
          }"
          v-bind="{ ...category }"
        />
      </template>
    </library-content-section>
    <LibraryTutorial v-if="!isLoadingInitialData" />
  </library-layout>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  computed,
  onBeforeUnmount,
  nextTick,
  useStore,
  useRouter
} from '@nuxtjs/composition-api'
import { useLibraryV2, useWindowDimensions } from '@/composables'
import { isLastIndex } from '@/utils/array.util'

import LibraryLayout from '@/components/app/library/LibraryLayout.vue'
import LibraryContentSection from '@/components/app/library/LibraryContentSection.vue'
import LibraryInlinePlayer from '@/components/app/library/LibraryInlinePlayer.vue'
import LibraryLetterVideoBrowser from '@/components/app/library/LibraryLetterVideoBrowser.vue'
import CategoryVideoCard from '@/components/app/library/CategoryVideoCard.vue'
import LibraryTutorial from '@/components/tutorial/pages/LibraryTutorial.vue'

import {
  TypedStore
} from '@/models'

export default defineComponent({
  name: 'LibraryIndexPage',

  components: {
    LibraryLayout,
    LibraryContentSection,
    LibraryInlinePlayer,
    LibraryLetterVideoBrowser,
    CategoryVideoCard,
    LibraryTutorial
  },

  setup() {
    const router = useRouter()
    const store = useStore<TypedStore>()
    // Main important functions for library
    const {
      getInitialData,
      categories,
      letters
    } = useLibraryV2()

    // Watch library letter browser height
    const {
      generateUpdaterFunctions,
      addElementDimensionListeners,
      removeElementDimensionListeners
    } = useWindowDimensions()
    const libraryLetterBrowserX = ref<number>(0)
    const libraryLetterBrowserY = ref<number>(0)
    const {
      updater: updateLibLetterDimensions,
      throttled: throttledUpdateLibLetterDimensions
    } = generateUpdaterFunctions(
      '#library-letter-video-browser',
      libraryLetterBrowserX,
      libraryLetterBrowserY
    )

    // Get initial data to populate page
    const isLoadingInitialData = ref(true)

    const isRegistrationComplete = computed(() => {
      return store.getters['auth/isRegistrationComplete']
    })

    onMounted(async () => {
      if (!isRegistrationComplete.value) {
        router.push({ name: 'app-index' })
      } else {
        addElementDimensionListeners(
          updateLibLetterDimensions,
          throttledUpdateLibLetterDimensions
        )
        await getInitialData()
        isLoadingInitialData.value = false
        nextTick(() => {
          updateLibLetterDimensions()
        })
      }
    })

    onBeforeUnmount(() => {
      removeElementDimensionListeners(
        updateLibLetterDimensions,
        throttledUpdateLibLetterDimensions
      )
    })

    return {
      isLoadingInitialData,
      categories,
      letters,
      libraryLetterBrowserY,
      isLastIndex
    }
  }
})
</script>
