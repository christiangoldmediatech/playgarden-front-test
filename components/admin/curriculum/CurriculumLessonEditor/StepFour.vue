<template>
  <!--  <v-container>-->
  <!--    <v-row>-->
  <!--      <v-col cols="12">-->
  <!--        <v-card width="100%">-->
  <!--          <v-card-title>-->
  <!--            <p class="primary&#45;&#45;text text-h5">-->
  <!--              Worksheet offline details-->
  <!--            </p>-->

  <!--            <v-spacer />-->

  <!--            <v-btn-->
  <!--              class="mr-2 text-none"-->
  <!--              color="primary darken-1"-->
  <!--              dark-->
  <!--              :icon="$vuetify.breakpoint.xs"-->
  <!--              @click="openModal({})"-->
  <!--            >-->
  <!--              <v-icon class="hidden-sm-and-up">-->
  <!--                mdi-plus-circle-->
  <!--              </v-icon>-->

  <!--              <v-icon class="hidden-xs-only" small>-->
  <!--                mdi-plus-->
  <!--              </v-icon>-->

  <!--              <span class="hidden-xs-only">Add new worksheet</span>-->
  <!--            </v-btn>-->
  <!--          </v-card-title>-->
  <!--        </v-card>-->
  <!--      </v-col>-->
  <!--    </v-row>-->

  <!--    <v-row>-->
  <!--      <v-col cols="12">-->
  <!--        <v-card width="100%">-->
  <!--          <v-card-text>-->
  <!--            <v-data-table-->
  <!--              :headers="headers"-->
  <!--              hide-default-footer-->
  <!--              :items="resources"-->
  <!--              :loading="loading"-->
  <!--              :page.sync="page"-->
  <!--              @update:page="page = $event"-->
  <!--            >-->
  <!--              <template v-slot:item.pdfUrl="{ item }">-->
  <!--                <a v-if="item.pdfUrl" :href="item.pdfUrl" target="_blank">-->
  <!--                  <v-btn icon large>-->
  <!--                    <v-icon>mdi-open-in-new</v-icon>-->
  <!--                  </v-btn>-->
  <!--                </a>-->
  <!--              </template>-->

  <!--              <template v-slot:item.actions="{ item }">-->
  <!--                <v-btn icon @click="openModal(item)">-->
  <!--                  <v-icon color="#81A1F7" dense>-->
  <!--                    mdi-pencil-outline-->
  <!--                  </v-icon>-->
  <!--                </v-btn>-->

  <!--                <v-icon color="#d30909" dense @click="remove(item)">-->
  <!--                  mdi-delete-outline-->
  <!--                </v-icon>-->
  <!--              </template>-->

  <!--              <template v-slot:no-data>-->
  <!--                <v-btn color="primary" text @click="refresh">-->
  <!--                  Refresh-->
  <!--                </v-btn>-->
  <!--              </template>-->

  <!--              <template v-slot:loading>-->
  <!--                <v-skeleton-loader class="mx-auto" type="table-row-divider@3" />-->
  <!--              </template>-->

  <!--              <template v-slot:footer="{ props }">-->
  <!--                <v-container fluid>-->
  <!--                  <v-row align="center" justify="end">-->
  <!--                    <v-icon-->
  <!--                      class="clickable mr-2"-->
  <!--                      color="green"-->
  <!--                      :disabled="props.pagination.page === 1 || loading"-->
  <!--                      x-small-->
  <!--                      @click.stop="page&#45;&#45;"-->
  <!--                      v-text="'mdi-less-than'"-->
  <!--                    />-->

  <!--                    <template v-for="i in props.pagination.pageCount">-->
  <!--                      <span-->
  <!--                        :key="`footer-page-number-${i}`"-->
  <!--                        :class="[-->
  <!--                          'font-weight-normal',-->
  <!--                          {-->
  <!--                            'accent&#45;&#45;text text&#45;&#45;darken-1':-->
  <!--                              props.pagination.page === i,-->
  <!--                            clickable: props.pagination.page !== i-->
  <!--                          }-->
  <!--                        ]"-->
  <!--                        @click.stop="page = i"-->
  <!--                      >-->
  <!--                        {{ i }}-->
  <!--                      </span>-->
  <!--                      <span-->
  <!--                        v-if="i !== props.pagination.pageCount"-->
  <!--                        :key="`footer-page-dot-${i}`"-->
  <!--                        class="font-weight-normal mx-1"-->
  <!--                      >-->
  <!--                        &centerdot;-->
  <!--                      </span>-->
  <!--                    </template>-->

  <!--                    <v-icon-->
  <!--                      class="clickable ml-2"-->
  <!--                      color="green"-->
  <!--                      :disabled="-->
  <!--                        props.pagination.page === props.pagination.pageCount ||-->
  <!--                          loading-->
  <!--                      "-->
  <!--                      x-small-->
  <!--                      @click.stop="page++"-->
  <!--                      v-text="'mdi-greater-than'"-->
  <!--                    />-->
  <!--                  </v-row>-->
  <!--                </v-container>-->
  <!--              </template>-->
  <!--            </v-data-table>-->
  <!--          </v-card-text>-->
  <!--        </v-card>-->

  <!--        <v-dialog-->
  <!--          v-model="showModal"-->
  <!--          content-class="white"-->
  <!--          :fullscreen="$vuetify.breakpoint.smAndDown"-->
  <!--          max-width="1000"-->
  <!--          persistent-->
  <!--        >-->
  <!--          <v-col cols="12">-->
  <!--            <v-row class="pr-3" justify="end">-->
  <!--              <v-btn icon @click.stop="showModal = false">-->
  <!--                <v-icon>mdi-close</v-icon>-->
  <!--              </v-btn>-->
  <!--            </v-row>-->

  <!--            <step-three-form-->
  <!--              v-if="showModal"-->
  <!--              :lesson-id="lessonId"-->
  <!--              :resource="resourceSelected"-->
  <!--              @click:cancel="showModal = false"-->
  <!--              @click:submit="onSubmit"-->
  <!--            />-->
  <!--          </v-col>-->
  <!--        </v-dialog>-->

  <!--        <v-btn-->
  <!--          block-->
  <!--          class="my-6"-->
  <!--          color="primary"-->
  <!--          :disabled="!resources.length"-->
  <!--          :loading="loading"-->
  <!--          x-large-->
  <!--          @click="$emit('click:submit')"-->
  <!--        >-->
  <!--          NEXT-->
  <!--        </v-btn>-->
  <!--      </v-col>-->
  <!--    </v-row>-->
  <!--  </v-container>-->

  <validation-observer v-slot="{ invalid, validated, passes, reset }">
    <p class="primary--text text-h5">
      {{ editing ? "Editing" : "New" }} offline worksheet
    </p>

    <v-form @submit.prevent="passes(onSubmit)">
      <!-- Name -->
      <validation-provider v-slot="{ errors }" name="Name" rules="required">
        <v-text-field
          v-model="draft.name"
          clearable
          :disabled="loading"
          :error-messages="errors"
          label="Name"
          :loading="loading"
          solo
        />
      </validation-provider>

      <!-- Description -->
      <validation-provider
        v-slot="{ errors }"
        name="Description"
        rules="required"
      >
        <v-textarea
          v-model="draft.description"
          clearable
          :disabled="loading"
          :error-messages="errors"
          label="Description"
          :loading="loading"
          solo
        />
      </validation-provider>

      <!-- File -->
      <span class="v-label theme--light">File</span>

      <template v-if="draft.pdfUrl">
        <div class="mb-6 mt-3">
          <v-badge avatar color="error" overlap>
            <template v-slot:badge>
              <v-avatar class="clickable" @click.native="draft.pdfUrl = null">
                <v-icon>
                  mdi-close
                </v-icon>
              </v-avatar>
            </template>

            <v-btn :href="draft.pdfUrl" icon target="_blank" x-large>
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </v-badge>
        </div>
      </template>

      <validation-provider
        v-else
        v-slot="{ errors }"
        name="File"
        rules="required"
      >
        <file-uploader
          ref="fileUploader"
          v-model="file"
          :error-messages="errors"
          :file.sync="file"
          label="Upload File"
          mode="document"
          path="lesson"
          placeholder="Select a pdf for this lesson"
          pdf
          prepend-icon="mdi-file"
        />
      </validation-provider>

      <v-btn
        block
        class="mb-6"
        color="primary"
        :disabled="invalid"
        :loading="loading"
        type="submit"
        x-large
      >
        NEXT
      </v-btn>

      <v-btn
        block
        class="mb-6"
        color="primary"
        :loading="loading"
        text
        :to="{
          name: 'admin-curriculum-management-editor',
          query: {
            step: 3,
            lessonId
          }
        }"
        x-large
        @click="onCancel(reset)"
      >
        BACK
      </v-btn>
    </v-form>
  </validation-observer>
</template>

<script>
import { mapActions } from 'vuex'

import submittable from '@/utils/mixins/submittable'

export default {
  name: 'StepFour',

  mixins: [submittable],

  props: {
    lessonId: {
      type: [Number, String],
      required: false,
      default: null
    }
  },

  data: () => ({
    file: null,
    loading: false
  }),

  computed: {
    editing () {
      return Boolean(this.draft.id)
    }
  },

  created () {
    this.refresh()
  },

  methods: {
    ...mapActions('admin/curriculum/worksheet', [
      'createWorksheetByLessonId',
      'fetchWorksheetsByLessonId',
      'updateWorksheetByLessonId'
    ]),

    async refresh () {
      this.loading = true

      try {
        const data = await this.fetchWorksheetsByLessonId({
          lessonId: this.lessonId,
          type: 'OFFLINE'
        })

        if (data.length) {
          this.draft = data[0]
        }
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    async onSubmit () {
      this.loading = true

      try {
        if (this.file) {
          this.draft.pdfUrl = await this.$refs.fileUploader.handleUpload()
        }

        const data = await this.submitMethod(this.getSubmittableData())

        this.$emit('click:submit', data)
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    resetDraft () {
      this.draft = {
        name: null,
        description: null,
        pdfUrl: null,
        type: 'OFFLINE'
      }
    },

    submitMethod (data) {
      return this.editing
        ? this.updateWorksheetByLessonId({
          id: this.draft.id,
          lessonId: this.lessonId,
          data
        })
        : this.createWorksheetByLessonId({ lessonId: this.lessonId, data })
    }
  }
}
</script>
