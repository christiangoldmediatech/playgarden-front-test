<template>
  <validation-observer v-slot="{ invalid, passes, reset }">
    <p class="primary--text text-h5">
      Lesson details
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

      <!-- Level -->
      <validation-provider v-slot="{ errors }" name="Level" rules="required">
        <v-select
          v-model="draft.level"
          clearable
          :disabled="loading"
          :error-messages="errors"
          :items="levels"
          item-text="label"
          item-value="value"
          label="Level"
          solo
        />
      </validation-provider>

      <!-- Letter -->
      <validation-provider v-slot="{ errors }" name="Letter" rules="required">
        <v-select
          v-model="draft.curriculumTypeId"
          clearable
          :disabled="loading"
          :error-messages="errors"
          :items="types"
          item-text="name"
          item-value="id"
          label="Letter"
          solo
        />
      </validation-provider>

      <!-- Day -->
      <validation-provider v-slot="{ errors }" name="Day" rules="required">
        <v-radio-group
          v-model="draft.day"
          :disabled="loading"
          :error-messages="errors"
          label="Day"
        >
          <v-row align="start" justify="start" no-gutters>
            <v-radio
              v-for="(item, i) in 5"
              :key="`draft-day-${i}`"
              class="mx-1 pa-0"
              color="primary darken-2"
              :label="`${item}`"
              :value="item"
            />
          </v-row>
        </v-radio-group>
      </validation-provider>

      <!-- Introduction -->
      <tiptap-field
        v-model="draft.introduction"
        :disabled="loading"
        label="Introduction"
        output-format="json"
      />

      <!-- Photo -->
      <span class="v-label theme--light">Photo</span>

      <template v-if="draft.photoUrl">
        <div class="mb-6 mt-3">
          <v-badge avatar color="white" overlap>
            <template v-slot:badge>
              <v-avatar class="clickable" @click.native="draft.photoUrl = null">
                <v-icon color="#757575" size="20">
                  mdi-close
                </v-icon>
              </v-avatar>
            </template>

            <v-img width="250" :src="draft.photoUrl" />
          </v-badge>
        </div>
      </template>

      <validation-provider
        v-else
        v-slot="{ errors }"
        name="File"
        rules="required|size:10000"
      >
        <file-uploader
          ref="fileUploader"
          v-model="file"
          :error-messages="errors"
          label="Upload Photo"
          mode="image"
          path="lesson"
          placeholder="Select a photo for this lesson"
          prepend-icon="mdi-camera"
          solo
          jpg
          png
          svg
        />
      </validation-provider>

      <v-row class="mb-6" justify="center">
        <v-btn
          class="ma-3"
          color="primary"
          :loading="loading"
          text
          x-large
          @click="onCancel(reset)"
        >
          CANCEL
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
import { mapActions, mapGetters } from 'vuex'

import submittable from '@/utils/mixins/submittable'

export default {
  name: 'StepOne',

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
    loading: false,

    levels: [
      { label: 'Beginner', value: 'BEGINNER' },
      { label: 'Intermediate', value: 'INTERMEDIATE' },
      { label: 'Advanced', value: 'ADVANCED' }
    ]
  }),

  computed: {
    ...mapGetters('admin/curriculum', ['types']),

    editing () {
      return Boolean(this.lessonId)
    }
  },

  created () {
    if (this.lessonId) {
      this.loading = true

      this.getLessonById(this.lessonId).then((data) => {
        this.draft = { ...data, curriculumTypeId: data.curriculumType.id }
        this.loading = false
      })
    }

    this.getTypes()
  },

  methods: {
    ...mapActions('admin/curriculum', [
      'createLesson',
      'getLessonById',
      'getTypes',
      'updateLesson'
    ]),

    async onSubmit () {
      this.loading = true

      try {
        if (this.file) {
          this.draft.photoUrl = await this.$refs.fileUploader.handleUpload()
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
        level: null,
        introduction: {},
        curriculumTypeId: null,
        day: null,
        photoUrl: null
      }
    },

    submitMethod (data) {
      return this.editing
        ? this.updateLesson({ id: this.lessonId, data })
        : this.createLesson(data)
    }
  }
}
</script>
