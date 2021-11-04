<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Playdates Management
            <v-spacer />

            <v-btn
              class="mr-2 text-none"
              color="primary darken-1"
              dark
              :icon="$vuetify.breakpoint.xs"
              :to="{ name: 'admin-playdates-management-editor' }"
            >
              <v-icon class="hidden-sm-and-up">
                mdi-plus-circle
              </v-icon>

              <v-icon class="hidden-xs-only" small>
                mdi-plus
              </v-icon>
              <span class="hidden-xs-only white--text">
                Add new Playdate
              </span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            Update, or delete playdate.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="showList">
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            <pg-admin-data-table
              :headers="headers"
              :items="playdates"
              :loading="loading"
              :page.sync="page"
              :server-items-length="total"
              @update:page="page = $event"
              @refresh="refetchPlayDates"
              @search="handleSearch"
              @search-text-cleared="handleSearchTextClearance"
              @edit-item="$router.push({
                name: 'admin-playdates-management-editor',
                query: { id: $event.id }
              })"
              @remove-item="remove"
            >
              <template v-slot:[`top.prepend`]>
                <v-col class="mt-2" cols="1">
                  <v-icon class="my-1" color="accent">
                    mdi-tune
                  </v-icon>
                </v-col>

                <v-col cols="11" md="4">
                  <pg-select
                    v-model="selectedStatus"
                    clearable
                    hide-details
                    :items="states"
                    label="Status"
                    solo-labeled
                    @change="refetchPlayDates"
                  />
                </v-col>
              </template>
            </pg-admin-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <v-card width="100%">
          <playdates-list />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, computed, useRoute } from '@nuxtjs/composition-api'
import PlaydatesList from '@/components/admin/playdates/PlaydatesList.vue'
import { usePlaydates } from '@/composables/playdates'
import paginable from '@/utils/mixins/paginable'

export default defineComponent({
  name: 'PlaydatesDataTable',
  components: { PlaydatesList },
  mixins: [paginable],
  data: () => ({
    headers: [
      {
        text: 'Name',
        sortable: false,
        value: 'name'
      },
      {
        text: 'Description',
        sortable: false,
        value: 'description'
      },
      {
        align: 'center',
        sortable: false,
        text: 'Day',
        value: 'day'
      },
      {
        text: 'Status',
        sortable: false,
        value: 'state'
      },
      {
        align: 'right',
        sortable: false,
        value: 'actions',
        width: 85
      }
    ]
  }),

  setup (_, { emit }) {
    const loading = ref<Boolean>(false)
    const showList = ref<Boolean>(false)
    const searchText = ref<string | null>(null)
    const selectedStatus = ref<string | null>(null)
    const { page, total, limit, playdates, states, getPlaydates, deletePlaydate } = usePlaydates()

    const fetchPlaydates = async (params: any) => {
      await getPlaydates(params)
    }

    onMounted(async () => {
      await fetchPlaydates({ page: page.value, total: total.value, limit: limit.value })
    })

    watch(page, (val) => {
      if (!loading.value) {
        refetchPlayDates()
      }
    })

    function handleSearch (searchString: string) {
      searchText.value = searchString
      refetchPlayDates()
    }

    function handleSearchTextClearance () {
      searchText.value = null
      refetchPlayDates()
    }

    async function refetchPlayDates () {
      loading.value = false
      const state = selectedStatus.value
      const name = searchText.value
      const params = {
        page: page.value,
        limit: limit.value,
        ...name && { name },
        ...state && { state }
      }

      try {
        await fetchPlaydates(params)
      } catch (e) {
      } finally {
        loading.value = false
      }
    }

    return {
      playdates,
      page,
      limit,
      total,
      states,
      selectedStatus,
      loading,
      showList,
      fetchPlaydates,
      deletePlaydate,
      refetchPlayDates,
      handleSearch,
      handleSearchTextClearance
    }
  },

  methods: {
    remove ({ id, name }: any) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete playdate?',
        message: `Are you sure you want to delete <b>${name}</b>?`,
        action: () => this.deletePlaydate(id).then(this.refetchPlayDates)
      })
    }
  }
})
</script>
