<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Children
            <v-spacer />

            <v-btn
              class="mr-2 text-none"
              color="primary darken-1"
              dark
              :icon="$vuetify.breakpoint.xs"
              nuxt
              @click.stop="childrenExport"
            >
              <v-icon class="hidden-sm-and-up">
                mdi-plus-circle
              </v-icon>

              <v-icon class="hidden-xs-only" small>
                mdi-plus
              </v-icon>

              <span class="hidden-xs-only white--text">Export</span>
            </v-btn>
          </v-card-title>
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
              :items-per-page="paginationLimit"
              :page.sync="page"
              :server-items-length="total"
              :action="action"
              top-justify="space-between"
              @search="onSearch"
              @update:page="page = $event"
              @refresh="refresh(true)"
              @edit-item="
                $router.push({
                  name: 'admin-user-manager-specialists-editor',
                  query: { id: $event.id }
                })
              "
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

              <template v-slot:[`item.backpack.image`]="{ item }">
                <img
                  v-if="item.backpack && item.backpack.image"
                  :src="item.backpack.image"
                  width="32px"
                >
                <span v-else>
                  N/A
                </span>
              </template>

              <template v-slot:[`item.lesson.curriculumType.letter`]="{ item }">
                <span
                  v-if="item.lesson && item.lesson.curriculumType.letter"
                >{{ item.lesson.curriculumType.letter }}
                </span>
                <span v-else>
                  N/A
                </span>
              </template>

              <template v-slot:[`item.lesson.day`]="{ item }">
                <span
                  v-if="item.lesson && item.lesson.day"
                >{{ item.lesson.day }}
                </span>
                <span v-else>
                  N/A
                </span>
              </template>

              <template v-slot:[`item.actions`]="{ item }">
                <v-row>
                  <div class="pl-1">
                    <nuxt-link
                      :to="{
                        name: 'admin-user-manager-profile',
                        query: { id: (item.user) ? item.user.id : '' }
                      }"
                      title="Go to Parent"
                    >
                      <v-img
                        width="20"
                        height="20"
                        :src="require('@/assets/png/Parent.png')"
                      />
                    </nuxt-link>
                  </div>

                  <div :key="`child-${item.id}`" class="pl-4">
                    <v-btn
                      icon
                      width="16"
                      height="16"
                      title="Show Progress"
                      @click.stop="openTimeline(item)"
                    >
                      <v-img :src="require('@/assets/png/progress-1.png')" height="20" width="20" />
                    </v-btn>
                  </div>
                </v-row>
              </template>
            </pg-admin-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <user-child-timeline-dialog />
    <user-child-lesson-overlay />
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import onSearch from '@/mixins/OnSearchMixin.js'
import UserChildLessonOverlay from '@/components/admin/users/UserChildLessonOverlay.vue'
import UserChildTimelineDialog from '@/components/admin/users/UserChildTimelineDialog.vue'

export default {
  name: 'ChildrenDataTable',

  components: {
    UserChildTimelineDialog,
    UserChildLessonOverlay
  },

  mixins: [onSearch],

  data () {
    return {
      loading: false,
      action: true,
      search: '',
      page: 1,
      allFilters: false,
      children: [],
      activeFilters: ['firstName'],
      filterList: [
        {
          text: 'First Name',
          value: 'firstName'
        }
      ],
      headers: [
        {
          text: 'Image',
          align: 'start',
          sortable: false,
          value: 'backpack.image'
        },
        {
          text: 'Children name',
          align: 'start',
          sortable: false,
          value: 'firstName'
        },
        {
          text: 'Current Letter',
          align: 'start',
          sortable: false,
          value: 'lesson.curriculumType.letter'
        },
        {
          text: 'Current Day',
          align: 'start',
          sortable: false,
          value: 'lesson.day'
        },
        {
          align: 'right',
          sortable: false,
          value: 'actions',
          width: 120
        }
      ]
    }
  },
  computed: {
    ...mapState('admin', ['paginationLimit']),
    ...mapGetters('admin/children', ['rows', 'total', 'types'])
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
    }
  },

  methods: {
    ...mapActions('admin/children', ['getChildrensProgress']),
    ...mapActions('children/progress', ['getChildrenProgressExport']),

    openTimeline (child) {
      this.$nuxt.$emit('open-timeline', child)
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
      if (clear) {
        this.search = ''
      }
      try {
        const params = {
          limit: this.paginationLimit,
          page: this.page,
          firstName: this.search
        }
        await this.getChildrensProgress(params)
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    async childrenExport () {
      this.exporting = true

      try {
        const { data } = await this.getChildrenProgressExport()

        if (data.export) {
          this.$snotify.success(
            'Export is complete and will be sent to your email.'
          )
        }
      } catch (e) {
      } finally {
        this.exporting = false
      }
    }
  }
}
</script>
