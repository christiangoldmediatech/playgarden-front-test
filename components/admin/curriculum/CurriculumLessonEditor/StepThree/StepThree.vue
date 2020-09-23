<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            <p class="primary--text text-h5">
              Worksheet online details
            </p>

            <v-spacer />

            <v-btn
              class="mr-2 text-none"
              color="primary darken-1"
              dark
              :icon="$vuetify.breakpoint.xs"
              @click="openModal({})"
            >
              <v-icon class="hidden-sm-and-up">
                mdi-plus-circle
              </v-icon>

              <v-icon class="hidden-xs-only" small>
                mdi-plus
              </v-icon>

              <span class="hidden-xs-only white--text">
                Add new worksheet
              </span>
            </v-btn>
          </v-card-title>
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
              :page.sync="page"
              @update:page="page = $event"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn icon @click="openModal(item)">
                  <v-icon color="#81A1F7" dense>
                    mdi-pencil-outline
                  </v-icon>
                </v-btn>

                <v-icon color="#d30909" dense @click="remove(item)">
                  mdi-delete-outline
                </v-icon>
              </template>

              <template v-slot:no-data>
                <v-btn color="primary" text @click="refresh">
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
                      @click.stop="page--"
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
                        @click.stop="page = i"
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
                      @click.stop="page++"
                      v-text="'mdi-greater-than'"
                    />
                  </v-row>
                </v-container>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>

        <v-dialog
          v-model="showModal"
          content-class="white"
          :fullscreen="$vuetify.breakpoint.smAndDown"
          max-width="1000"
          persistent
        >
          <v-col cols="12">
            <v-row class="pr-3" justify="end">
              <v-btn icon @click.stop="showModal = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-row>

            <step-three-form
              v-if="showModal"
              :lesson-id="lessonId"
              :resource="resourceSelected"
              @click:cancel="showModal = false"
              @click:submit="onSubmit"
            />
          </v-col>
        </v-dialog>

        <v-row class="mb-6" justify="center">
          <v-btn
            class="ma-3"
            color="primary"
            :loading="loading"
            text
            :to="{
              name: 'admin-curriculum-management-editor',
              query: {
                step: 2,
                lessonId
              }
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

import StepThreeForm from './StepThreeForm'

export default {
  name: 'StepThree',

  components: {
    StepThreeForm
  },

  props: {
    lessonId: {
      type: [Number, String],
      required: false,
      default: null
    }
  },

  data: () => ({
    showModal: false,
    resourceSelected: {},
    loading: false,
    page: 1,
    resources: [],
    headers: [
      {
        text: 'Name',
        sortable: false,
        value: 'name'
      },
      {
        text: 'Type',
        sortable: false,
        value: 'worksheetTable.type'
      },
      {
        align: 'right',
        sortable: false,
        value: 'actions',
        width: 100
      }
    ]
  }),

  created () {
    this.refresh()
  },

  methods: {
    ...mapActions('admin/curriculum/worksheet', [
      'deleteWorksheetByLessonId',
      'fetchWorksheetsByLessonId'
    ]),

    onSubmit () {
      this.showModal = false
      this.refresh()
    },

    openModal (resource = {}) {
      this.resourceSelected = resource
      this.showModal = true
    },

    async refresh () {
      this.loading = true

      try {
        this.resources = await this.fetchWorksheetsByLessonId({
          lessonId: this.lessonId,
          type: 'ONLINE'
        })
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete curriculum lesson worksheet?',
        message: `Are you sure you wish to delete '${name}' curriculum lesson worksheet?`,
        action: () =>
          this.deleteWorksheetByLessonId({
            id,
            lessonId: this.lessonId
          }).then(this.refresh)
      })
    }
  }
}
</script>
