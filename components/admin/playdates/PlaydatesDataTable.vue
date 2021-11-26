<template>
  <v-container>
    <live-session-editor-dialog
      ref="editor"
      mode="Playdate"
      @saved="refetchPlayDates()"
    />
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
              @click.stop="$refs.editor.open"
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
            View, Create, Update, or delete playdate.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <playdates-list />
        </v-card>
      </v-col>
    </v-row>

    <v-expansion-panels
      v-model="panel"
    >
      <v-expansion-panel>
        <v-expansion-panel-header>Playdate list</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row no-gutters>
            <v-col cols="12">
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
              >
              <template v-slot:[`item.actions`]="{ item }">
                  <v-icon
                    color="#81A1F7"
                    dense
                    @click="$refs.editor.open(null, item)"
                  >
                    mdi-pencil-outline
                  </v-icon>

                  <v-icon color="#d30909" dense @click="remove(item)">
                    mdi-delete-outline
                  </v-icon>
                </template>
              </pg-admin-data-table>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from '@nuxtjs/composition-api'
import PlaydatesList from '@/components/admin/playdates/PlaydatesList.vue'
import { usePlaydates } from '@/composables/playdates'
import LiveSessionEditorDialog from '@/components/admin/live-sessions/LiveSessionEditorDialog.vue'
import paginable from '@/utils/mixins/paginable'

export default defineComponent({
  name: 'PlaydatesDataTable',
  components: { PlaydatesList, LiveSessionEditorDialog },
  mixins: [paginable],
  data: () => ({
    headers: [
      {
        text: 'Title',
        sortable: false,
        value: 'title'
      },
      {
        text: 'Description',
        sortable: false,
        value: 'description'
      },
      {
        align: 'center',
        sortable: false,
        text: 'Teacher',
        value: 'teacher'
      },
      {
        align: 'center',
        sortable: false,
        text: 'Spots',
        value: 'spots'
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
    const searchText = ref<string | null>(null)
    const panel = [0]
    const selectedStatus = ref<string | null>(null)
    const { page, total, limit, playdates, states, getPlaydates, deletePlaydate } = usePlaydates()

    const fetchPlaydates = async (params: any) => {
      await getPlaydates(params)
    }

    onMounted(async () => {
      await fetchPlaydates({ page: page.value, total: total.value, limit: limit.value, type: 'Playdate' })
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
        type: 'Playdate',
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
      panel,
      fetchPlaydates,
      deletePlaydate,
      refetchPlayDates,
      handleSearch,
      handleSearchTextClearance
    }
  },

  methods: {
    remove ({ id, title }: any) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete playdate?',
        message: `Are you sure you want to delete <b>${title}</b>?`,
        action: () => this.deletePlaydate(id).then(this.refetchPlayDates)
      })
    }
  }
})
</script>
