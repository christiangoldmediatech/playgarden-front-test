<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Activities Management
            <v-spacer />

            <v-btn
              class="mr-2 text-none"
              color="primary darken-1"
              dark
              :icon="$vuetify.breakpoint.xs"
              nuxt
              :to="{ name: 'admin-activity-management-editor' }"
            >
              <v-icon class="hidden-sm-and-up">
                mdi-plus-circle
              </v-icon>

              <v-icon class="hidden-xs-only" small>
                mdi-plus
              </v-icon>

              <span class="hidden-xs-only white--text">Add new activity</span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete activities.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-tabs
          v-model="tab"
          grow
        >
          <v-tab
            v-for="item in items"
            :key="item"
          >
            {{ item }}
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-card width="100%">
              <v-card-text>
                <pg-admin-data-table
                  :headers="headers"
                  :items="rows"
                  :items-per-page="paginationLimit"
                  :loading="loading"
                  :page.sync="page"
                  :server-items-length="total"
                  top-justify="space-between"
                  @search="handleSearch"
                  @refresh="handleRefresh"
                  @search-text-cleared="handleSearchClearance"
                  @update:page="page = $event"
                  @edit-item="
                    $router.push({
                      name: 'admin-activity-management-editor',
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

                    <v-col cols="12" md="7" class="flex-shrink-0 flex-grow-1">
                      <v-row no-gutters>
                        <pg-select
                          v-model="activeFilters"
                          clearable
                          :items="filterList"
                          item-text="text"
                          item-value="value"
                          label="Filter"
                          solo-labeled
                          multiple
                        />
                      </v-row>
                    </v-col>
                  </template>

                  <template v-slot:[`item.videos.name`]="{ item }">
                    <v-btn
                      class="mr-2"
                      :disabled="loading"
                      icon
                      @click.stop="toggleFeatured(item)"
                    >
                      <v-icon
                        :color="item.featured ? 'accent' : ''"
                        v-text="item.featured ? 'mdi-star' : 'mdi-star-outline'"
                      />
                    </v-btn>
                    {{ item.videos.name }}
                  </template>

                  <template v-slot:[`item.actions.prepend`]="{ item }">
                    <video-preview-btn :video="item.videos" />
                    <grades-btn :data-item="item" :entity-type="entityType" />
                  </template>
                </pg-admin-data-table>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <analytics />
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import VideoPreviewBtn from '@/components/admin/video-preview/VideoPreviewBtn.vue'
import GradesBtn from '@/components/admin/grades/GradesBtn.vue'
import Analytics from './Analytics.vue'

export default {
  name: 'ActivityDataTable',

  components: {
    VideoPreviewBtn,
    GradesBtn,
    Analytics
  },
  data () {
    return {
      tab: null,
      loading: false,
      page: 1,
      allFilters: false,
      searchText: null,
      activeFilters: [],
      checkStatusInterval: null,
      entityType: 'Activities',
      items: [
        'Activities', 'Analytics'
      ],
      headers: [
        {
          text: 'Activity Title',
          align: 'start',
          sortable: true,
          value: 'videos.name'
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
          text: 'Status',
          align: 'start',
          sortable: false,
          value: 'videos.status'
        },
        {
          text: 'Description',
          sortable: false,
          value: 'videos.description'
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

  computed: {
    ...mapState('admin', ['paginationLimit']),
    ...mapGetters('admin/activity', ['rows', 'total', 'types']),

    filterList () {
      return this.types.map((type) => {
        return {
          text: type.name,
          value: type.id
        }
      })
    }
  },

  watch: {
    page () {
      this.refetchActivities()
    },

    limit () {
      this.refetchActivities()
    },

    activeFilters (val) {
      if (val.length === 0 || val.length !== this.filterList.length) {
        this.allFilters = false
      }

      if (val.length === this.filterList.length) {
        this.allFilters = true
      }
      this.refetchActivities()
    },

    rows () {
      this.checkStatus()
    }
  },
  mounted () {
    this.refetchActivities()
  },

  beforeDestroy () {
    clearInterval(this.checkStatusInterval)
  },

  methods: {
    ...mapActions('admin/activity', [
      'getActivities',
      'updateActivity',
      'deleteActivity'
    ]),

    async toggleFeatured (item) {
      this.loading = true
      await this.updateActivity({
        id: item.id,
        data: {
          name: item.name,
          type: item.type,
          activityTypeId: item.activityType.id,
          featured: !item.featured
        }
      })
      await this.refetchActivities()
    },

    toggleAll () {
      this.allFilters = !this.allFilters

      if (this.allFilters) {
        this.filterList.forEach((filter) => {
          if (!this.activeFilters.includes(filter.value)) {
            this.activeFilters.push(filter.value)
          }
        })
      } else {
        this.activeFilters = []
      }
    },
    handleSearch (searchText) {
      this.searchText = searchText
      this.refetchActivities()
    },
    handleSearchClearance () {
      this.searchText = null
      this.refetchActivities()
    },
    handleRefresh () {
      this.searchText = null
      this.refetchActivities()
    },
    async refetchActivities () {
      this.loading = true
      const name = this.searchText
      const params = {
        limit: this.paginationLimit,
        page: this.page,
        type: 'VIDEO',
        ...name && { name }
      }

      // params.name = this.search

      if (this.activeFilters.length > 0) {
        params.activityTypeId = this.activeFilters
      }

      await this.getActivities(params)
      this.loading = false
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete activity?',
        message: `Are you sure you want to delete <b>${name}</b>?`,
        action: async () => {
          await this.deleteActivity(id)
          this.refetchActivities()
        }
      })
    },

    checkStatus () {
      if (this.rows.filter(data => data.videos.status !== 'COMPLETED').length > 0) {
        if (this.checkStatusInterval === null) {
          this.checkStatusInterval = setInterval(() => {
            this.refetchActivities()
          }, 120000)
        }
      } else {
        clearInterval(this.checkStatusInterval)
      }
    }
  }
}
</script>
