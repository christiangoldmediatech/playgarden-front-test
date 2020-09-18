<template>
  <validation-observer v-slot="{ invalid, passes, reset }">
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
            <!-- <video-js-player
              :options="{
                title: draft.name,
                poster: draft.thumbnail,
                sources: [
                  {
                    src: draft.videoUrl.HLS,
                    type: 'application/x-mpegURL'
                  }
                ]
              }"
            /> -->
          </v-badge>
        </div>
      </template>

      <validation-provider
        v-else
        v-slot="{ errors }"
        name="Video"
        rules="required"
      >
        <file-uploader
          ref="videoUploader"
          v-model="file"
          :error-messages="errors"
          label="Upload Video"
          mode="video"
          multi-part
          path="lesson"
          placeholder="Select a video for this lesson"
          prepend-icon="mdi-video"
          solo
          mov
          mp4
          mpeg
          webm
        />
      </validation-provider>

      <!-- Thumbnail -->
      <span class="v-label theme--light">Thumbnail</span>

      <template v-if="draft.thumbnail">
        <div class="mb-6 mt-3">
          <v-badge avatar color="white" overlap>
            <template v-slot:badge>
              <v-avatar
                class="clickable"
                @click.native="draft.thumbnail = null"
              >
                <v-icon color="#757575" size="20">
                  mdi-close
                </v-icon>
              </v-avatar>
            </template>

            <v-img width="250" :src="draft.thumbnail" />
          </v-badge>
        </div>
      </template>

      <validation-provider
        v-else
        v-slot="{ errors }"
        name="Thumbnail"
        rules="required|size:10000"
      >
        <file-uploader
          ref="thumbnailUploader"
          v-model="thumbnail"
          :error-messages="errors"
          label="Upload Thumbnail"
          mode="image"
          path="curriculum-thumbnail"
          placeholder="Select a thumbnail for this lesson's video"
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
          SAVE
        </v-btn>
      </v-row>
    </v-form>
  </validation-observer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
// import VideoJsPlayer from '@/components/video-player/VideoJsPlayer'
import submittable from '@/utils/mixins/submittable'

export default {
  name: 'StepTwoForm',

  // components: {
  //   VideoJsPlayer
  // },

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
    thumbnail: null,
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
          const { video } = await this.$refs.videoUploader.handleUpload()

          id = video.id
        }

        if (this.thumbnail) {
          this.draft.thumbnail = await this.$refs.thumbnailUploader.handleUpload()
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
          activityTypeId: null,
          name: null,
          description: null,
          thumbnail: null
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
