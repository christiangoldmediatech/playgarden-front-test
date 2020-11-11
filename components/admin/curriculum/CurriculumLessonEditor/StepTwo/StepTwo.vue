<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            <p class="primary--text text-h5">
              Video Lesson
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
                Add new video
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
              <template v-slot:item.createdAt="{ item }">
                {{ item.createdAt | formatDate }}
              </template>

              <template v-slot:item.actions="{ item }">
                <video-preview-btn :video="item" />

                <grades-btn :data-item="item" :entity-type="entityType" :lesson-id="lessonId" />

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

            <step-two-form
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
                step: 1,
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
import VideoPreviewBtn from '@/components/admin/video-preview/VideoPreviewBtn.vue'
import GradesBtn from '@/components/admin/grades/GradesBtn.vue'
import StepTwoForm from './StepTwoForm'

export default {
  name: 'StepTwo',

  components: {
    StepTwoForm,
    VideoPreviewBtn,
    GradesBtn
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
    entityType: 'Videos',
    checkStatusInterval: null,
    resources: [],
    headers: [
      {
        text: 'Name',
        sortable: false,
        value: 'name'
      },
      {
        text: 'Status',
        sortable: false,
        value: 'status'
      },
      {
        text: 'Activity',
        sortable: false,
        value: 'activityType.name'
      },
      {
        align: 'right',
        sortable: false,
        value: 'actions',
        width: 125
      }
    ]
  }),

  watch: {
    resources () {
      this.checkStatus()
    }
  },

  created () {
    this.checkStatus()
    this.refresh()
  },

  beforeDestroy () {
    clearInterval(this.checkStatusInterval)
  },

  methods: {
    ...mapActions('admin/curriculum/video', [
      'deleteVideoByLessonId',
      'fetchVideosByLessonId'
    ]),

    onSubmit () {
      this.showModal = false
      this.refresh()
      this.checkStatus()
    },

    openModal (resource = {}) {
      this.resourceSelected = resource
      this.showModal = true
    },

    checkStatus () {
      if (this.resources.filter(data => data.status !== 'COMPLETED').length > 0) {
        this.checkStatusInterval = setInterval(() => {
          this.refresh()
        }, 120000)
      }
    },

    stopInterval () {
      if (this.resources.filter(data => data.status !== 'COMPLETED').length === 0) {
        clearInterval(this.checkStatusInterval)
      }
    },

    async refresh () {
      this.loading = true

      try {
        this.resources = await this.fetchVideosByLessonId({
          lessonId: this.lessonId
        })
        this.stopInterval()
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete curriculum lesson video?',
        message: `Are you sure you wish to delete '${name}' curriculum lesson video?`,
        action: () =>
          this.deleteVideoByLessonId({
            id,
            lessonId: this.lessonId
          }).then(this.refresh)
      })
    }
  }
}
</script>
