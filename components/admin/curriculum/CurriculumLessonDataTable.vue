<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Lesson Management

            <v-spacer />

            <v-btn
              class="mr-2 text-none"
              color="primary darken-1"
              dark
              :icon="$vuetify.breakpoint.xs"
              nuxt
              :to="{ name: 'admin-curriculum-management-editor' }"
            >
              <v-icon class="hidden-sm-and-up">
                mdi-plus-circle
              </v-icon>

              <v-icon class="hidden-xs-only" small>
                mdi-plus
              </v-icon>

              <span class="hidden-xs-only white--text">Add new lesson</span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete lesson.
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
              :items="resources"
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
                    label="Letter"
                    solo-labeled
                    @change="refresh(false)"
                  />
                </v-col>

                <v-col cols="12" md="5">
                  <v-radio-group
                    v-if="$vuetify.breakpoint.lgAndUp"
                    v-model="filters.level"
                    hide-details
                    @change="refresh(false)"
                  >
                    <v-row align="start" justify="start" no-gutters>
                      <v-radio
                        v-for="(item, i) in levels"
                        :key="`filters-level-${i}`"
                        class="mx-1 pa-0"
                        color="primary darken-2"
                        :label="item.label"
                        :value="item.value"
                      />
                    </v-row>
                  </v-radio-group>

                  <pg-select
                    v-else
                    v-model="filters.level"
                    :items="levels"
                    hide-details
                    item-text="label"
                    item-value="value"
                    label="Level"
                    solo-labeled
                    @change="refresh(false)"
                  />
                </v-col>
              </template>

              <template v-slot:[`item.actions.prepend`]="{ item }">
                <nuxt-link
                  :to="{
                    name: 'admin-curriculum-management-lessonId-preview',
                    params: { lessonId: item.id }
                  }"
                >
                  <v-icon color="accent" dense>
                    mdi-play
                  </v-icon>
                </nuxt-link>
              </template>
            </pg-admin-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import onSearch from '@/mixins/OnSearchMixin.js'
import paginable from '@/utils/mixins/paginable'

export default {
  name: 'CurriculumLessonDataTable',

  mixins: [paginable, onSearch],

  data: () => ({
    loading: false,
    search: '',
    filters: {
      curriculumTypeId: null,
      level: null
    },
    resources: [],
    headers: [
      {
        text: 'Level',
        sortable: false,
        value: 'level'
      },
      {
        text: 'Letter',
        sortable: false,
        value: 'curriculumType.name'
      },
      {
        align: 'center',
        sortable: false,
        text: 'Day',
        value: 'day'
      },
      {
        text: 'Lesson',
        sortable: false,
        value: 'name'
      },
      {
        text: 'Status',
        sortable: false,
        value: 'status'
      },
      {
        align: 'right',
        sortable: false,
        value: 'actions',
        width: 100
      }
    ],
    levels: [
      { label: 'All', value: null },
      { label: 'Beginner', value: 'BEGINNER' },
      { label: 'Intermediate', value: 'INTERMEDIATE' },
      { label: 'Advanced', value: 'ADVANCED' }
    ]
  }),

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
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete curriculum lesson?',
        message: `Are you sure you want to delete <b>${name}</b>?`,
        action: () => this.deleteLesson(id).then(this.refresh)
      })
    }
  }
}
</script>
