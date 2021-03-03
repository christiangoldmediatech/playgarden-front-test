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
          solo-labeled
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
          solo-labeled
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
      <upload-multiple-files v-else ref="multiDocsLoad" @sendFile="setDocumentFile" />

      <!-- Video -->
      <span class="v-label theme--light">Video</span>

      <template v-if="draft.videoDetail && draft.videoDetail.videoUrl && draft.videoDetail.videoUrl.HLS">
        <div class="mb-6 mt-3">
          <v-badge avatar class="video-badge" color="error" overlap>
            <template v-slot:badge>
              <v-avatar class="clickable" @click.native="draft.videoDetail.videoUrl = null">
                <v-icon>
                  mdi-close
                </v-icon>
              </v-avatar>
            </template>
            <pg-inline-video-player @ready="onPlayerReady({ player: $event, video: draft.videoDetail })" />
          </v-badge>
        </div>
      </template>

      <validation-provider
        v-slot="{ errors }"
        name="Video"
      >
        <pg-file-uploader
          ref="videoFileUploaderDropBox"
          v-model="videoFile"
          :error-messages="errors"
          prepend-icon="mdi-video"
          label="Upload Video"
          mode="video"
          multi-part
          api="dropbox"
          path="lesson"
          placeholder="Select a video for this lesson"
          solo-labeled
          mp4
          mov
          mpeg
          webm
          @sendFile="setVideoFile"
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
import { mapActions, mapGetters } from 'vuex'

import submittable from '@/utils/mixins/submittable'
import UploadMultipleFiles from './UploadMultipleFiles'

export default {
  name: 'StepFour',

  components: {
    UploadMultipleFiles
  },

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
    fileName: null,
    videoFile: null,
    loading: false,
    path: 'lesson',
    typeSelectDocumentFile: null,
    typeSelectVideoFile: null
  }),

  computed: {
    editing () {
      return Boolean(this.draft.id)
    },
    ...mapGetters('admin/curriculum', [
      'getLesson'
    ])
  },

  created () {
    this.refresh()
    this.getLessonById(this.lessonId).then((data) => {
      this.fileName = data.name.replace(/ /g, '-')
      this.loading = false
    })
  },

  methods: {
    ...mapActions('admin/curriculum/worksheet', [
      'createWorksheetByLessonId',
      'fetchWorksheetsByLessonId',
      'updateWorksheetByLessonId'
    ]),
    ...mapActions('upload', ['doUploadJoinMultilpe', 'doUploadJoinMultilpeDropBox']),
    ...mapActions('admin/curriculum', [
      'getLessonById'
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

    setVideoFile (type) {
      this.typeSelectVideoFile = type
    },

    setDocumentFile (type) {
      this.typeSelectDocumentFile = type
    },

    async handleMultiFileUpload (files) {
      try {
        const formData = new FormData()
        files.map((file) => {
          formData.append('file', file)
        })
        const { filePath } = await this.doUploadJoinMultilpe({
          type: 'upload-document',
          path: this.path,
          formData
        })
        return filePath
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async handleMultiFileUploadDropBox (files) {
      const listFiles = files.map((file) => {
        return { ...file, mode: 'document', type: 'upload-document-dropbox', path: this.path }
      })
      const { filePath } = await this.doUploadJoinMultilpeDropBox({
        type: 'upload-document-dropbox',
        path: this.path,
        files: listFiles
      })
      return filePath
    },

    validateSize (files) {
      const total = files.map(file => file.size).reduce((a, b) => a + b)
      return total / 1000000
    },

    async onSubmit () {
      this.loading = true
      let size = 0
      try {
        if (this.$refs.multiDocsLoad) {
          const files = await this.$refs.multiDocsLoad.joinFiles()
          if (files) {
            size = this.validateSize(files)
            const path = (this.typeSelectDocumentFile !== 'dropBox') ? await this.handleMultiFileUpload(files) : await this.handleMultiFileUploadDropBox(files)
            this.draft.pdfUrl = path
          }
        }

        if (this.videoFile) {
          const { video } = (this.typeSelectVideoFile !== 'dropBox') ? await this.$refs.videoFileUploaderDropBox.handleUpload() : await this.$refs.videoFileUploaderDropBox.handleDropBoxFileUpload()
          this.draft.videoId = video.id
        }

        if (size <= 1000000) {
          const data = await this.submitMethod(this.getSubmittableData())
          this.$emit('click:submit', data)
        } else {
          this.$snotify.warning('The size of the documents cannot be larger than 10MB', 'Warning', {})
        }
      } catch (e) {
      } finally {
        this.fileDropBox = null
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
    },

    onPlayerReady ({ player, video }) {
      player.loadMedia({
        title: video.name,
        poster: require('assets/jpg/abacus_counting_lesson.jpg'),
        src: [
          {
            src: video.videoUrl.HLS,
            type: 'application/x-mpegURL'
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.video-badge {
  width: 90%;
}
</style>
