<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Playdates Management
          </v-card-title>

          <v-card-text>
            View, create, update, or delete playdate.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            total == {{ total }}
            page == {{ page }}
            <pg-admin-data-table
              :headers="headers"
              :items="playdates"
              :loading="loading"
              :page.sync="page"
              :server-items-length="total"
              @update:page="page = $event"
              @refresh="refresh(true)"
              @search="onSearch"
              @edit-item="$refs.playdatesRef.open(null, $event)"
              @remove-item="remove"
            >
              <template v-slot:[`top.prepend`]>
                <v-col class="mt-2" cols="1">
                  <v-icon class="my-1" color="accent">
                    mdi-tune
                  </v-icon>
                </v-col>

                <v-col cols="11" md="2">
                  <!-- <pg-select
                    v-model="filters.curriculumTypeId"
                    clearable
                    hide-details
                    :items="types"
                    item-text="name"
                    item-value="id"
                    label="Status"
                    solo-labeled
                    @change="refresh(false)"
                  /> -->
                </v-col>
              </template>
            </pg-admin-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <playdates-editor-dialog
      ref="playdatesRef"
      @saved="refresh(false)"
    />
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@nuxtjs/composition-api'
import { usePlaydates } from '@/composables/playdates'
import { mapActions, mapGetters, mapState } from 'vuex'
import onSearch from '@/mixins/OnSearchMixin.js'
import paginable from '@/utils/mixins/paginable'
import PlaydatesEditorDialog from '@/components/admin/playdates/PlaydatesEditorDialog.vue'
import { PlaydatesResponse, Playdate } from '@/models'

export default defineComponent({
  name: 'PlaydatesDataTable',

  mixins: [paginable, onSearch],

  components: {
    PlaydatesEditorDialog
  },

  data: () => ({
    search: '',
    filters: {
      curriculumTypeId: null,
      level: null
    },
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
        width: 155
      }
    ]
  }),

  setup () {
    const loading = ref<Boolean>(false)
    const { page, total, limit, playdates, getPlaydates, deletePlayadte } = usePlaydates()

    const fetchPlaydates = async (params: any) => {
      await getPlaydates(params)
    }
    onMounted(async () => {
      await fetchPlaydates({ page: page.value, total: total.value, limit: limit.value })
    })

    return {
      playdates,
      page,
      limit,
      total,
      loading,
      fetchPlaydates,
      deletePlayadte
    }
  },

  watch: {
    page () {
      if (!this.loading) {
        this.refresh()
      }
    }
  },

  methods: {
    async refresh (clear = false) {
      this.loading = true

      if (clear) {
        this.search = ''
      }

      try {
        const params = {
          page: this.page,
          limit: this.limit
        }
        await this.fetchPlaydates(params)
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    remove ({ id, name }) {
      /* this.$nuxt.$emit('open-prompt', {
        title: 'Delete curriculum lesson?',
        message: `Are you sure you want to delete <b>${name}</b>?`,
        action: () => this.deleteLesson(id).then(this.refresh)
      }) */
    }
  }
})
</script>
