<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Children
            <v-spacer />
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
              :items="children"
              :loading="loading"
              :page.sync="page"
              :action="action"
              top-justify="space-between"
              @search="onSearch"
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
                        query: { id: item.user.id }
                      }"
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
                      @click.stop="openTimeline(item)"
                    >
                      <v-img :src="require('@/assets/png/progress.png')" />
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
import { mapActions, mapGetters } from 'vuex'
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
      limit: 10,
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
    ...mapGetters('children', ['rows'])
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
        this.children = await this.getChildrensProgress({
          firstName: this.search
        })
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
