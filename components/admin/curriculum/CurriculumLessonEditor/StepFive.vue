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
            v-for="(data, indexR) in resources"
            :key="indexR"
            cols="12"
            md="4"
            sm="6"
            xl="3"
          >
            <v-card>
              <v-list-item class="activities-selected">
                <v-list-item-avatar @click="loadDataSelected(data)">
                  <v-img :src="data.activity.activityType.icon" height="200" />
                </v-list-item-avatar>

                <v-list-item-content @click="loadDataSelected(data)">
                  <v-list-item-title class="headline">
                    {{ data.activity.videos.name }}
                  </v-list-item-title>

                  <v-list-item-subtitle @click="loadDataSelected(data)">
                    {{ data.activity.activityType.description }}
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn icon @click="remove(data.activity)">
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
                <v-icon color="#81A1F7" dense @click="itemSelected=item; dialogAssociateActivity=true;">
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
    <validation-observer ref="obs" v-slot="{ invalid, passes }">
      <v-dialog
        v-model="dialogAssociateActivity"
        :fullscreen="$vuetify.breakpoint.xs"
        max-width="500px"
        persistent
        scrollable
      >
        <v-card v-if="dialogAssociateActivity">
          <v-toolbar class="flex-grow-0" color="primary darken-1" dark dense flat>
            <v-toolbar-title class="white--text">
              {{ itemSelected.videos.name }}
            </v-toolbar-title>

            <v-spacer />

            <v-btn :disabled="loading" icon @click.stop="dialogAssociateActivity = false">
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
          </v-toolbar>

          <v-card-text>
            <v-container>
              <v-form ref="activityTypeForm" @submit.prevent="passes(associateActivity)">
                <validation-provider
                  v-slot="{ errors }"
                  name="Order"
                  rules="required"
                >
                  <pg-text-field
                    v-model="order"
                    :error-messages="errors"
                    label="Order"
                    solo
                  />
                </validation-provider>
              </v-form>
            </v-container>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-spacer />

            <v-btn
              class="white--text"
              color="green"
              :disabled="invalid"
              :loading="loading"
              :text="$vuetify.breakpoint.smAndUp"
              @click.stop="passes(associateActivity)"
            >
              Save
            </v-btn>

            <v-btn
              class="white--text"
              color="red"
              :disabled="loading"
              :text="$vuetify.breakpoint.smAndUp"
              @click.stop="dialogAssociateActivity = false"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </validation-observer>
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
    itemSelected: null,
    order: null,
    idCurrent: null,
    dialogAssociateActivity: false,
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
        value: 'videos.description'
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
      'updateActivityByLessonId',
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

    async associateActivity () {
      this.loading = true
      try {
        if (this.idCurrent) {
          await this.updateActivityByLessonId({
            idCurrent: this.idCurrent,
            activityId: this.itemSelected.id,
            lessonId: this.lessonId,
            order: this.order
          })
        } else {
          await this.createActivityByLessonId({
            activityId: this.itemSelected.id,
            lessonId: this.lessonId,
            order: this.order
          })
        }

        this.order = null
        this.dialogAssociateActivity = false
        this.itemSelected = null
        this.idCurrent = null
        await this.getActivitiesLesson()
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    loadDataSelected (data) {
      this.itemSelected = data.activity
      this.order = data.order
      this.idCurrent = data.id
      this.dialogAssociateActivity = true
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

<style>
.activities-selected:hover {
  cursor: pointer !important;
}
</style>
