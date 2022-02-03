<template>
  <validation-observer v-slot="{ invalid, passes, reset }">
    <p class="primary--text text-h5">
      {{ editing ? "Editing" : "New" }} video
    </p>

    <v-form @submit.prevent="passes(onSubmit)">
      <!-- Name -->
      <validation-provider v-slot="{ errors }" name="Name" rules="required">
        <pg-text-field
          v-model="draft.name"
          clearable
          :disabled="loading"
          :error-messages="errors"
          label="Teacher's Name"
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
          label="lesson Video description"
          :loading="loading"
          solo-labeled
        />
      </validation-provider>

      <!-- Order -->
      <validation-provider v-slot="{ errors }" name="Order" rules="required">
        <pg-text-field
          v-model="draft.order"
          clearable
          :disabled="loading"
          :error-messages="errors"
          label="Order"
          :loading="loading"
          solo-labeled
        />
      </validation-provider>

      <!-- Activity -->
      <validation-provider v-slot="{ errors }" name="Activity" rules="required">
        <pg-select
          v-model="draft.activityTypeId"
          clearable
          :disabled="loading"
          :error-messages="errors"
          :items="types"
          item-text="name"
          item-value="id"
          label="Activity"
          solo-labeled
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

            <div class="video-player-16-9-container">
              <pg-video-player
                :control-config="{ favorite: false }"
                inline
                @ready="onPlayerReady({ player: $event, video: draft })"
              />
            </div>
          </v-badge>
        </div>
      </template>

      <validation-provider
        v-else
        v-slot="{ errors }"
        name="Video"
        rules="required"
      >
        <pg-file-uploader
          ref="videoFileUploaderDropBox"
          v-model="file"
          :error-messages="errors"
          append-icon="mdi-video"
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
        <pg-file-uploader
          ref="imageFileUploaderDropBox"
          v-model="thumbnail"
          append-icon="mdi-camera"
          :error-messages="errors"
          label="Upload Thumbnail"
          mode="image"
          path="curriculum-thumbnail"
          placeholder="Select a thumbnail for this lesson's video"
          solo-labeled
          api="dropbox"
          jpg
          png
          svg
          @sendFile="setImageFile"
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
import submittable from '@/utils/mixins/submittable'
import PgVideoPlayer from '@gold-media-tech/pg-video-player'

export default {
  name: 'StepTwoForm',

  components: {
    PgVideoPlayer
  },

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
    loading: false,
    typeSelectImageFile: null,
    typeSelectVideoFile: null
  }),

  computed: {
    ...mapGetters('admin/activity', ['types']),

    editing () {
      return Boolean(this.resource.id)
    }
  },

  created () {
    this.getTypes({ lesson: true })
  },

  methods: {
    ...mapActions('admin/activity', ['getTypes']),

    ...mapActions('admin/curriculum/video', ['updateVideoByLessonId']),

    onPlayerReady ({ player, video }) {
      player.loadPlaylist([
        {
          title: video.name,
          poster: video.thumbnail,
          src: {
            url: video.videoUrl.HLS,
            type: 'application/x-mpegURL'
          }
        }
      ])
    },

    setVideoFile (type) {
      this.typeSelectVideoFile = type
    },

    setImageFile (type) {
      this.typeSelectImageFile = type
    },

    async onSubmit () {
      this.loading = true
      let id = this.draft.id
      try {
        if (this.file) {
          const { video } = (this.typeSelectVideoFile !== 'dropBox') ? await this.$refs.videoFileUploaderDropBox.handleUpload() : await this.$refs.videoFileUploaderDropBox.handleDropBoxFileUpload()
          id = video.id
        }

        if (this.thumbnail) {
          if (this.typeSelectImageFile !== 'dropBox') {
            this.draft.thumbnail = await this.$refs.imageFileUploaderDropBox.handleUpload()
          } else {
            const { filePath } = await this.$refs.imageFileUploaderDropBox.handleDropBoxFileUpload()
            this.draft.thumbnail = filePath
          }
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
