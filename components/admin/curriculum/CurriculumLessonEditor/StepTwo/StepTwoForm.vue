<template>
  <validation-observer v-slot="{ invalid, validated, passes, reset }">
    <p class="primary--text text-h5">
      {{ editing ? "Editing" : "New" }} video
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

      <!-- Activity -->
      <validation-provider v-slot="{ errors }" name="Activity" rules="required">
        <v-select
          v-model="draft.activityTypeId"
          clearable
          :disabled="loading"
          :error-messages="errors"
          :items="types"
          item-text="name"
          item-value="id"
          label="Activity"
          solo
        />
      </validation-provider>

      <!-- Video -->
      <span class="v-label theme--light">Video</span>

      <template v-if="draft.videoUrl && draft.videoUrl.HLS">
        <div class="mb-6 mt-3">
          <v-badge avatar class="video-badge" color="error" overlap>
            <template v-slot:badge>
              <v-avatar class="clickable" @click.native="draft.videoUrl = null">
                <v-icon>
                  mdi-close
                </v-icon>
              </v-avatar>
            </template>

            <jw-player
              :file="draft.videoUrl.HLS"
              :title="draft.name"
              :description="draft.description"
            />
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
          label="Upload Video"
          mode="video"
          mov
          mp4
          mpeg
          multi-part
          path="lesson"
          placeholder="Select a video for this lesson"
          prepend-icon="mdi-video"
          webm
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
        SAVE
      </v-btn>

      <v-btn
        block
        class="mb-6"
        color="primary"
        :loading="loading"
        text
        x-large
        @click="onCancel(reset)"
      >
        CANCEL
      </v-btn>
    </v-form>
  </validation-observer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import submittable from '@/utils/mixins/submittable'

export default {
  name: 'StepTwoForm',

  mixins: [submittable],

  props: {
    lessonId: {
      type: [Number, String],
      required: false,
      default: null
    },

    resource: {
      type: Object,
      required: false,
      default: () => {}
    }
  },

  data: () => ({
    file: null,
    loading: false
  }),

  computed: {
    ...mapGetters('admin/activity', ['types']),

    editing () {
      return Boolean(this.resource.id)
    }
  },

  created () {
    this.getTypes()
  },

  methods: {
    ...mapActions('admin/activity', ['getTypes']),

    ...mapActions('admin/curriculum/video', ['updateVideoByLessonId']),

    async onSubmit () {
      this.loading = true
      let id = this.draft.id

      try {
        if (this.file) {
          const { video } = await this.$refs.fileUploader.handleUpload()

          id = video.id
        }

        const data = await this.updateVideoByLessonId({
          data: this.getSubmittableData(),
          lessonId: this.lessonId,
          id
        })

        this.$emit('click:submit', data)
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    resetDraft () {
      this.draft = this.editing
        ? this.$jsonCopy({
          ...this.resource,
          activityTypeId: this.resource.activityType.id
        })
        : {
          name: null,
          description: null,
          activityTypeId: null
        }
    }
  }
}
</script>

<style lang="scss" scoped>
.video-badge {
  width: 100%;
}
</style>
