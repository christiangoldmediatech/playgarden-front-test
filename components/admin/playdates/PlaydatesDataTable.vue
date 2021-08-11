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
            <pg-admin-data-table
              :headers="headers"
              :items="playdatesResponse.playdates"
              :items-per-page="paginationLimit"
              :loading="loading"
              :page.sync="pagination.page"
              :server-items-length="pagination.total"
              @refresh="refresh(true)"
              @search="onSearch"
              @update:page="pagination.page = $event"
              @edit-item="onEdit"
              @remove-item="remove"
            >
              <template v-slot:[`top.prepend`]>
                <v-col class="mt-2" cols="1">
                  <v-icon class="my-1" color="accent">
                    mdi-tune
                  </v-icon>
                </v-col>

                <v-col cols="11" md="2">
                  <pg-select
                    v-model="filters.curriculumTypeId"
                    clearable
                    hide-details
                    :items="types"
                    item-text="name"
                    item-value="id"
                    label="Status"
                    solo-labeled
                    @change="refresh(false)"
                  />
                </v-col>
              </template>
            </pg-admin-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@nuxtjs/composition-api'
import { usePlaydates } from '@/composables/playdates'
import { mapActions, mapGetters, mapState } from 'vuex'
import onSearch from '@/mixins/OnSearchMixin.js'
import paginable from '@/utils/mixins/paginable'

export default defineComponent({
  name: 'PlaydatesDataTable',

  mixins: [paginable, onSearch],

  data: () => ({
    search: '',
    filters: {
      curriculumTypeId: null,
      level: null
    },
    resources: [],
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
    ],
    levels: [
      { label: 'All', value: null },
      { label: 'Beginner', value: 'BEGINNER' },
      { label: 'Intermediate', value: 'INTERMEDIATE' },
      { label: 'Advanced', value: 'ADVANCED' }
    ]
  }),

  setup () {
    const loading = ref<Boolean>(false)
    const { playdatesResponse, getPlaydates } = usePlaydates()
    onMounted(async () => {
      await getPlaydates()
    })

    return {
      playdatesResponse,
      loading,
      getPlaydates
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', ['types']),
    ...mapState('admin', ['paginationLimit'])
  },

  watch: {
    'pagination.page' () {
      if (!this.loading) {
        this.refresh()
      }
    }
  },

  created () {
    this.getTypes()
    this.refresh()
  },

  methods: {
    ...mapActions('admin/curriculum', [
      'deleteLesson',
      'fetchLessons',
      'getTypes'
    ]),

    onEdit (item) {
      this.$router.push({
        name: 'admin-curriculum-management-editor',
        query: { lessonId: item.id }
      })
    },

    async refresh (clear = false) {
      this.loading = true

      if (clear) {
        this.search = ''
      }

      try {
        const { lessons, page, total } = await this.fetchLessons({
          name: this.search || null,
          curriculumTypeId: this.filters.curriculumTypeId || null,
          level: this.filters.level || null,
          page: this.pagination.page,
          limit: this.paginationLimit
        })

        this.resources = lessons
        this.setPagination({ page, total })
      } catch (e) {
      } finally {
        this.loading = false
      }
    }

    /* remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete curriculum lesson?',
        message: `Are you sure you want to delete <b>${name}</b>?`,
        action: () => this.deleteLesson(id).then(this.refresh)
      })
    } */
  }
})
</script>
