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
        <v-card width="100%">
          <v-card-text>
            <pg-admin-data-table
              :headers="headers"
              :items="rows"
              :loading="loading"
              :page.sync="page"
              :server-items-length="total"
              top-justify="space-between"
              @search="onSearch"
              @refresh="refresh(true)"
              @update:items-per-page="setLimit"
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
                    <v-checkbox
                      class="mx-1 my-1 pa-0"
                      color="primary darken-2"
                      hide-details
                      :input-value="allFilters"
                      label="All"
                      @click.stop="toggleAll"
                    />

                    <v-checkbox
                      v-for="(item, i) in filterList"
                      :key="`filter-item-${i}`"
                      v-model="activeFilters"
                      class="mx-1 my-1 pa-0"
                      color="primary darken-2"
                      hide-details
                      :label="item.text"
                      multiple
                      :value="item.value"
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import onSearch from '@/mixins/OnSearchMixin.js'
import VideoPreviewBtn from '@/components/admin/video-preview/VideoPreviewBtn.vue'
import GradesBtn from '@/components/admin/grades/GradesBtn.vue'

export default {
  name: 'ActivityDataTable',

  components: {
    VideoPreviewBtn,
    GradesBtn
  },

  mixins: [onSearch],

  data () {
    return {
      loading: false,
      search: '',
      limit: 10,
      page: 1,
      allFilters: false,
      activeFilters: [],
      checkStatusInterval: null,
      entityType: 'Activities',
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
          value: 'activityType.description'
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
      this.refresh()
    },

    limit () {
      this.refresh()
    },

    activeFilters (val) {
      if (val.length === 0 || val.length !== this.filterList.length) {
        this.allFilters = false
      }

      if (val.length === this.filterList.length) {
        this.allFilters = true
      }
    },

    rows () {
      this.checkStatus()
    }
  },

  created () {
    this.checkStatus()
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
      await this.refresh()
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

    setLimit (limit) {
      if (limit > 0) {
        this.limit = limit
      } else {
        this.limit = 0
      }
    },

    async refresh (clear = false) {
      this.loading = true

      if (this.clear) {
        this.search = ''
      }

      const params = {
        limit: this.limit,
        page: this.page,
        type: 'VIDEO',
        name: this.search
      }

      // params.name = this.search

      if (this.activeFilters.length > 0) {
        params.activityTypeId = this.activeFilters
      }

      await this.getActivities(params)
      this.stopInterval()
      this.loading = false
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete activity?',
        message: `Are you sure you wish to delete '${name}' activity?`,
        action: async () => {
          await this.deleteActivity(id)
          this.refresh()
        }
      })
    },

    checkStatus () {
      if (
        this.rows.filter(data => data.videos.status !== 'COMPLETED').length >
        0
      ) {
        this.checkStatusInterval = setInterval(() => {
          this.refresh()
        }, 120000)
      }
    },

    stopInterval () {
      if (
        this.rows.filter(data => data.videos.status !== 'COMPLETED')
          .length === 0
      ) {
        clearInterval(this.checkStatusInterval)
      }
    }
  }
}
</script>
