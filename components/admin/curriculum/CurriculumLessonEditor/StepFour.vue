<template>
  <validation-observer v-slot="{ invalid, passes, reset }">
    <p class="primary--text text-h5">
      {{ editing ? "Editing" : "New" }} offline worksheet
    </p>

    <v-form @submit.prevent="passes(onSubmit)">
      <!-- Name -->
      <validation-provider v-slot="{ errors }" name="Name" rules="required">
        <pg-text-field
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
        <pg-textarea
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
          <v-badge avatar color="white" overlap>
            <template v-slot:badge>
              <v-avatar class="clickable" @click.native="draft.pdfUrl = null">
                <v-icon color="#757575" size="20">
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
          label="Upload File"
          mode="document"
          path="lesson"
          placeholder="Select a pdf for this lesson"
          prepend-icon="mdi-file"
          solo
          pdf
        />
      </validation-provider>

      <v-row class="mb-6" justify="center">
        <v-btn
          class="ma-3"
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

        <v-btn
          class="ma-3"
          color="primary"
          :disabled="invalid"
          :loading="loading"
          type="submit"
          x-large
        >
          NEXT
        </v-btn>
      </v-row>
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
