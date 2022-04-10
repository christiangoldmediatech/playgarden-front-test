<template>
  <v-main class="main-content" :class="{ 'fill-height': loading }">
    <v-row
      v-if="loading"
      no-gutters
      class="fill-height"
      justify="center"
      align="center"
    >
      <v-col>
        <v-container fill-height fluid>
          <pg-loading />
        </v-container>
      </v-col>
    </v-row>
    <template v-else>
      <v-container fluid>
        <!-- Title -->
        <v-row v-if="title" align="center">
          <v-col cols="12">
            <underlined-title fonts-size="58px" :text="title" />
          </v-col>
        </v-row>

        <!-- Top Header -->
        <v-row class="flex-lg-nowrap" align="center">
          <v-col cols="12" sm="5" md="3" order="1" order-sm="0">
            <child-select v-model="selectedChild" hide-details />
          </v-col>

          <v-col
            v-if="showChild"
            cols="12"
            sm="7"
            md="5"
            lg="auto"
            class="flex-lg-grow-1 flex-lg-shrink-0"
            order="2"
            order-sm="1"
          >
            <search-text-field @search="handleSearch" />
          </v-col>

          <library-links
            cols="12"
            md="4"
            lg="auto"
            order="0"
            order-sm="2"
            v-bind="{ showFavorites }"
          />
        </v-row>

        <!-- Back button  -->
        <v-row v-if="backBtn" class="d-none d-lg-flex" align="center">
          <v-col cols="12">
            <library-back-btn @click="goBack" />
          </v-col>
        </v-row>

        <slot />
      </v-container>
    </template>
  </v-main>
</template>

<script lang="ts">
import {
  defineComponent,
  useRouter,
  useStore,
  WritableComputedRef,
  computed
} from '@nuxtjs/composition-api'

import LibraryBackBtn from '@/components/app/library/LibraryBackBtn.vue'
import ChildSelect from '@/components/app/ChildSelect.vue'
import SearchTextField from '@/components/app/library/SearchTextField.vue'
import LibraryLinks from '@/components/app/library/LibraryLinks.vue'

export default defineComponent({
  name: 'LibraryLayout',

  components: {
    LibraryBackBtn,
    ChildSelect,
    SearchTextField,
    LibraryLinks
  },

  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },

    loading: {
      type: Boolean,
      required: false,
      default: false
    },

    backBtn: {
      type: Boolean,
      required: false,
      default: false
    },

    showFavorites: {
      type: Boolean,
      required: false,
      default: true
    },

    showChild: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  setup() {
    const store = useStore()

    // Handle child selection
    const selectedChild: WritableComputedRef<number | null> = computed({
      get(): number | null {
        return store.getters.getCurrentChild[0].id || null
      },
      set(newId: number | null): void {
        if (newId === null) {
          return
        }
        const allChildren = store.getters['children/rows']
        const child = allChildren.find(({ id }: { id: number }) => id === newId)
        store.dispatch('setChild', { value: [child], save: true })
        location.reload()
      }
    })

    // Handle seaarch request
    const router = useRouter()
    function handleSearch(criteria: string) {
      router.push({
        name: 'app-library-search',
        query: {
          q: criteria
        }
      })
    }

    function goBack(): void {
      router.push({
        name: 'app-library'
      })
    }

    return {
      handleSearch,
      goBack,
      selectedChild
    }
  }
})
</script>

<style lang="scss" scoped>
// For fullscreen pages
.v-main.main-content {
  padding-top: 98px !important;
  margin-top: 0px !important;
}
</style>
