<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            <p class="primary--text text-h5">
              Lesson activities
            </p>
          </v-card-title>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-row>
          <v-col
            v-for="({ activity }, indexR) in resources"
            :key="indexR"
            cols="12"
            md="4"
            sm="6"
            xl="3"
          >
            <v-card>
              <v-list-item>
                <v-list-item-avatar>
                  <v-img :src="activity.activityType.icon" height="200" />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title class="headline">
                    {{ activity.videos.name }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    {{ activity.activityType.description }}
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn icon @click="remove(activity)">
                    <v-icon color="grey lighten-1">
                      mdi-close
                    </v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            <v-data-table
              :headers="headers"
              hide-default-footer
              :items="activities"
              :loading="loading"
              :page.sync="pagination.page"
              :server-items-length="pagination.total"
              @update:page="pagination.page = $event"
            >
              <template v-slot:item.actions="{ item }">
                <v-icon color="#81A1F7" dense @click="associateActivity(item)">
                  mdi-content-save-outline
                </v-icon>
              </template>

              <template v-slot:no-data>
                <v-btn color="primary" text @click="fetchActivities">
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
                            clickable: props.pagination.page !== i,
                          },
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

        <v-row class="mb-6" justify="center">
          <v-btn
            class="ma-3"
            color="primary"
            :loading="loading"
            text
            :to="{
              name: 'admin-curriculum-management-editor',
              query: {
                step: 4,
                lessonId,
              },
            }"
            x-large
          >
            BACK
          </v-btn>

          <v-btn
            class="ma-3"
            color="primary"
            :disabled="!resources.length"
            :loading="loading"
            x-large
            @click="$emit('click:submit')"
          >
            NEXT
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

import paginable from '@/utils/mixins/paginable'

export default {
  name: 'StepFive',

  mixins: [paginable],

  props: {
    lessonId: {
      type: [Number, String],
      required: false,
      default: null
    }
  },

  data: () => ({
    lesson: {},
    loading: false,
    activities: [],
    resources: [],
    headers: [
      {
        text: 'Name',
        sortable: false,
        value: 'videos.name'
      },
      {
        text: 'Activity type',
        sortable: false,
        value: 'activityType.name'
      },
      {
        text: 'Description',
        sortable: false,
        value: 'video.description'
      },
      {
        align: 'right',
        sortable: false,
        value: 'actions',
        width: 50
      }
    ]
  }),

  watch: {
    'pagination.page' () {
      if (!this.loading) {
        this.fetchActivities()
      }
    }
  },

  async created () {
    try {
      this.lesson = await this.getLessonById(this.lessonId)

      await this.fetchActivities()
      await this.getActivitiesLesson()
    } catch (e) {}
  },

  methods: {
    ...mapActions('admin/activity', ['getActivities']),

    ...mapActions('admin/curriculum', ['getLessonById']),

    ...mapActions('admin/curriculum/activity', [
      'createActivityByLessonId',
      'deleteActivityByLessonId',
      'fetchActivitiesByLessonId'
    ]),

    onSubmit () {
      this.fetchActivities()
    },

    async fetchActivities () {
      this.loading = true

      try {
        const { activities, page, total } = await this.getActivities({
          curriculumTypeId: this.lesson.curriculumType.id,
          page: this.pagination.page
        })

        this.activities = activities
        this.setPagination({ page, total })
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    async getActivitiesLesson () {
      this.loading = true

      try {
        this.resources = await this.fetchActivitiesByLessonId({
          lessonId: this.lessonId
        })
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    async associateActivity ({ id }) {
      this.loading = true

      try {
        await this.createActivityByLessonId({
          activityId: id,
          lessonId: this.lessonId
        })

        await this.getActivitiesLesson()
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete curriculum lesson activity?',
        message: `Are you sure you wish to delete '${name}' curriculum lesson activity?`,
        action: () =>
          this.deleteActivityByLessonId({
            id,
            lessonId: this.lessonId
          }).then(this.getActivitiesLesson)
      })
    }
  }
}
</script>
