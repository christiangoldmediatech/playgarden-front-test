<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Kids corner videos - Management

            <v-spacer />

            <v-btn
              class="mr-2 text-none"
              color="primary darken-1"
              dark
              :icon="$vuetify.breakpoint.xs"
              nuxt
              :to="{ name: 'admin-kids-corner-videos-editor' }"
            >
              <v-icon class="hidden-sm-and-up">
                mdi-plus-circle
              </v-icon>

              <v-icon class="hidden-xs-only" small>
                mdi-plus
              </v-icon>
              <span class="hidden-xs-only white--text">
                Add new kids corner video
              </span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete kids corner videos.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card width="100%">
      <v-card-text>
        <pg-admin-data-table
          :headers="headers"
          :items="KidsCornerVideos"
          :loading="loading"
          :page.sync="page"
          :server-items-length="total"
          top-justify="space-between"
          @search="handleSearch"
          @search-text-cleared="handleSearchTextClearance"
          @refresh="refetchKidsCornerData"
          @update:page="page = $event"
          @edit-item="
            $router.push({
              name: 'admin-kids-corner-videos-editor',
              query: { id: $event.id },
            })
          "
          @remove-item="remove"
        >
          <template v-slot:[`top.prepend`]>
            <v-col class="fkex-shrink-1 flex-grow-0">
              <v-icon class="my-4 mx-1" color="accent">
                mdi-tune
              </v-icon>
            </v-col>
          </template>

          <template v-slot:[`item.video.name`]="{ item }">
            {{ item.video.name }}
          </template>
        </pg-admin-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { useKidsCorner } from '@/composables/kids-corner'
import { defineComponent, onMounted, ref, watch } from '@nuxtjs/composition-api'
import paginable from '@/utils/mixins/paginable'

export default defineComponent({
  name: 'KidsCornerVideosDataTable',
  mixins: [paginable],
  data () {
    return {
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: true,
          value: 'video.name'
        },
        {
          text: 'Category',
          align: 'start',
          sortable: true,
          value: 'activityType.name'
        },
        {
          text: 'Letter',
          align: 'start',
          sortable: false,
          value: 'curriculumType.letter'
        },
        {
          text: '',
          align: 'right',
          sortable: false,
          value: 'actions',
          width: 173
        }
      ]
    }
  },
  setup () {
    const loading = ref(false)
    const searchText = ref<string | null>(null)
    const activeFilters = ref<any | null >('')
    const filterList = ref<any[]>([])

    const { KidsCornerVideos, page, total, limit, getKidsCorner, deleteKidsCorner } = useKidsCorner()

    watch(page, (val) => {
      if (!loading.value) {
        refetchKidsCornerData()
      }
    })

    function handleSearch (searchString: string) {
      searchText.value = searchString
      refetchKidsCornerData()
    }

    function handleSearchTextClearance () {
      searchText.value = null
      refetchKidsCornerData()
    }
    async function refetchKidsCornerData () {
      loading.value = true
      const name = searchText.value
      const params = {
        page: page.value,
        limit: limit.value,
        ...name && { name }
      }

      try {
        await getKidsCorner(params)
      } catch (e) {
      } finally {
        loading.value = false
      }
    }

    onMounted(async () => {
      await refetchKidsCornerData()
    })

    return {
      handleSearch,
      activeFilters,
      loading,
      page,
      total,
      filterList,
      KidsCornerVideos,
      refetchKidsCornerData,
      deleteKidsCorner,
      handleSearchTextClearance
    }
  },
  methods: {
    remove ({ id, video }: any) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete playdate?',
        message: `Are you sure you want to delete <b>${video.name}</b>?`,
        action: () => this.deleteKidsCorner(id).then(this.refetchKidsCornerData)
      })
    }
  }
})
</script>
