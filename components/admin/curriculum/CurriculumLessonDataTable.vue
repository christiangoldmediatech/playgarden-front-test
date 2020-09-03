<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Curriculum Management

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

              <span class="hidden-xs-only white--text">Add new curriculum</span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete curriculum.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            <v-data-table
              :headers="headers"
              hide-default-footer
              :items="resources"
              :loading="loading"
              :page.sync="pagination.page"
              :server-items-length="pagination.total"
              @update:page="pagination.page = $event"
            >
              <template v-slot:top>
                <v-row>
                  <v-col class="mt-2" cols="1">
                    <v-icon class="my-1" color="accent">
                      mdi-tune
                    </v-icon>
                  </v-col>

                  <v-col cols="11" md="2">
                    <v-select
                      v-model="filters.curriculumTypeId"
                      clearable
                      hide-details
                      :items="types"
                      item-text="name"
                      item-value="id"
                      label="Letter"
                      solo
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

                    <v-select
                      v-else
                      v-model="filters.level"
                      :items="levels"
                      hide-details
                      item-text="label"
                      item-value="value"
                      label="Level"
                      solo
                      @change="refresh(false)"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="search"
                      append-icon="mdi-magnify"
                      clearable
                      hide-details
                      label="Search"
                      single-line
                      solo
                      @keydown.enter="refresh(false)"
                    />
                  </v-col>
                </v-row>
              </template>

              <template v-slot:item.createdAt="{ item }">
                {{ item.createdAt | formatDate }}
              </template>

              <template v-slot:item.actions="{ item }">
                <nuxt-link
                  :to="{
                    name: 'admin-curriculum-management-editor',
                    query: { lessonId: item.id }
                  }"
                >
                  <v-icon color="#81A1F7" dense>
                    mdi-pencil-outline
                  </v-icon>
                </nuxt-link>

                <v-icon color="#d30909" dense @click="remove(item)">
                  mdi-delete-outline
                </v-icon>
              </template>

              <template v-slot:no-data>
                <v-btn color="primary" text @click="refresh(true)">
                  Refresh
                </v-btn>
              </template>

              <template v-slot:loading>
                <v-skeleton-loader class="mx-auto" type="table-row-divider@3" />
              </template>

              <template v-slot:footer="{ props }">
                <v-container fluid>
                  <v-row align="center" justify="end">
                    <v-icon
                      class="clickable mr-2"
                      color="green"
                      :disabled="props.pagination.page === 1 || loading"
                      x-small
                      @click.stop="pagination.page--"
                      v-text="'mdi-less-than'"
                    />

                    <template v-for="i in props.pagination.pageCount">
                      <span
                        :key="`footer-page-number-${i}`"
                        :class="[
                          'font-weight-normal',
                          {
                            'accent--text text--darken-1':
                              props.pagination.page === i,
                            clickable: props.pagination.page !== i
                          }
                        ]"
                        @click.stop="pagination.page = i"
                      >
                        {{ i }}
                      </span>
                      <span
                        v-if="i !== props.pagination.pageCount"
                        :key="`footer-page-dot-${i}`"
                        class="font-weight-normal mx-1"
                      >
                        &centerdot;
                      </span>
                    </template>

                    <v-icon
                      class="clickable ml-2"
                      color="green"
                      :disabled="
                        props.pagination.page === props.pagination.pageCount ||
                          loading
                      "
                      x-small
                      @click.stop="pagination.page++"
                      v-text="'mdi-greater-than'"
                    />
                  </v-row>
                </v-container>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import paginable from '@/utils/mixins/paginable'

export default {
  name: 'CurriculumLessonDataTable',

  mixins: [paginable],

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
    ...mapGetters('admin/curriculum', ['types'])
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
          page: this.pagination.page
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
        message: `Are you sure you wish to delete '${name}' curriculum lesson?`,
        action: () => this.deleteLesson(id).then(this.refresh)
      })
    }
  }
}
</script>
