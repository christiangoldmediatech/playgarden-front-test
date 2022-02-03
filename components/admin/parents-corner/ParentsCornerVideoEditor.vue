<template>
  <validation-observer ref="obs" v-slot="{ invalid, passes }">
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="800px"
      persistent
    >
      <v-card>
        <v-toolbar class="flex-grow-0" color="primary darken-1" dark dense flat>
          <v-toolbar-title class="white--text">
            {{ title }}
          </v-toolbar-title>

          <v-spacer />

          <v-btn :disabled="loading" icon @click.stop="close">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pt-5">
          <v-container>
            <v-form ref="roleForm" @submit.prevent="passes(save)">
              <validation-provider
                v-slot="{ errors }"
                name="Video Name"
                rules="required"
              >
                <pg-text-field
                  v-model="item.name"
                  :error-messages="errors"
                  label="Name"
                  solo-labeled
                />
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Video Description"
                rules="required"
              >
                <pg-textarea
                  v-model="item.description"
                  :error-messages="errors"
                  label="Description"
                  solo-labeled
                />
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Video Category"
                rules="required"
              >
                <pg-select
                  v-model="item.categoryId"
                  :error-messages="errors"
                  label="Category"
                  :items="categories"
                  item-text="category"
                  item-value="id"
                  solo-labeled
                />
              </validation-provider>

              <!-- Video -->
              <div v-if="video && video.videoUrl" class="video-player-16-9-container">
                <pg-video-player
                  :control-config="{ favorite: false }"
                  inline
                  @ready="onPlayerReady"
                />
              </div>

              <v-row
                v-else-if="
                  video &&
                    ['PROCESSING', 'UPLOADING'].includes(video.status)
                "
                justify="center"
              >
                <v-progress-circular
                  class="mb-3"
                  color="primary"
                  width="8"
                  size="256"
                  indeterminate
                >
                  <span class="black--text">
                    <span v-if="video.status === 'UPLOADING'">
                      Uploading
                    </span>

                    <span v-else>
                      Processing
                    </span>
                  </span>
                </v-progress-circular>
              </v-row>

              <validation-provider
                v-slot="{ errors }"
                name="Video"
                :rules="{ required: Boolean(!id && !file) }"
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
                  path="activity-video"
                  placeholder="Select a file for this video"
                  solo-labeled
                  mp4
                  mov
                  mpeg
                  webm
                  @sendFile="setVideoFile"
                />
              </validation-provider>

              <!-- Thumbnail -->
              <v-img
                v-if="item.thumbnail"
                class="mx-auto"
                max-width="640"
                :src="item.thumbnail"
              />

              <validation-provider
                v-slot="{ errors }"
                name="Video Thumbnail"
                :rules="{
                  required: !item.thumbnail && !thumbnail,
                  size: 10000
                }"
              >
                <pg-file-uploader
                  ref="imageFileUploaderDropBox"
                  v-model="thumbnail"
                  append-icon="mdi-camera"
                  :error-messages="errors"
                  label="Upload Thumbnail"
                  mode="image"
                  path="parents-corner-thumbnail"
                  placeholder="Select a thumbnail for this video"
                  solo-labeled
                  api="dropbox"
                  jpg
                  png
                  svg
                  @sendFile="setImageFile"
                />
              </validation-provider>
            </v-form>
          </v-container>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="green"
            :dark="$vuetify.breakpoint.xs"
            :disabled="invalid"
            :loading="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="passes(save)"
          >
            Save
          </v-btn>

          <v-btn
            color="red"
            :dark="$vuetify.breakpoint.xs"
            :disabled="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="close"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </validation-observer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import PgVideoPlayer from '@gold-media-tech/pg-video-player'

const itemTemplate = {
  name: '',
  description: '',
  categoryId: null,
  thumbnail: '',
  videoId: null
}

export default {
  name: 'ParentsCornerVideoEditor',

  components: {
    PgVideoPlayer
  },

  data: () => {
    return {
      dialog: false,
      loading: false,
      player: null,
      id: null,
      file: null,
      video: null,
      thumbnail: null,
      typeSelectImageFile: null,
      typeSelectVideoFile: null,
      item: JSON.parse(JSON.stringify(itemTemplate))
    }
  },

  computed: {
    ...mapGetters('parents-corner', { categories: 'getCategories' }),

    title () {
      return this.id === null ? 'New Video' : 'Edit Video'
    }
  },

  methods: {
    ...mapActions('parents-corner', {
      create: 'createVideo',
      update: 'updateVideo'
    }),

    onPlayerReady (player) {
      this.player = player
    },

    reset () {
      this.id = null
      this.video = null
      this.file = null
      this.thumbnail = null
      this.item = JSON.parse(JSON.stringify(itemTemplate))
    },

    open (item = null) {
      this.reset()
      if (item) {
        const { id, category, video } = item
        const { name, description, thumbnail } = video
        const videoId = video.id
        const categoryId = category.id
        this.id = id
        this.video = video
        this.item = { name, description, categoryId, videoId, thumbnail }

        if (video.videoUrl) {
          const mediaObject = {
            title: name,
            poster: thumbnail,
            src: {
              url: video.videoUrl.HLS,
              type: 'application/x-mpegURL'
            },
            videoId
          }

          if (this.player) {
            this.player.loadPlaylist([mediaObject], 0)
          } else {
            const waitAndLoad = window.setInterval(() => {
              if (this.player) {
                this.player.loadPlaylist([mediaObject], 0)
                window.clearInterval(waitAndLoad)
              }
            }, 50)
          }
        }
      }
      this.dialog = true
    },

    close () {
      this.dialog = false
      if (this.player) {
        this.player.pause()
      }
    },

    setImageFile (type) {
      this.typeSelectImageFile = type
    },

    setVideoFile (type) {
      this.typeSelectVideoFile = type
    },

    async save () {
      try {
        this.loading = true

        let data
        if (this.typeSelectVideoFile !== 'dropBox') {
          data = await this.$refs.videoFileUploaderDropBox.handleUpload()
        } else {
          this.loadingDropBox = true
          data = await this.$refs.videoFileUploaderDropBox.handleDropBoxFileUpload()
        }

        if (data) {
          this.item.videoId = data.video.id
        }

        if (this.thumbnail) {
          if (this.typeSelectImageFile !== 'dropBox') {
            this.item.thumbnail = await this.$refs.imageFileUploaderDropBox.handleUpload()
          } else {
            const { filePath } = await this.$refs.imageFileUploaderDropBox.handleDropBoxFileUpload()
            this.item.thumbnail = filePath
          }
        }

        if (this.id) {
          await this.update({ id: this.id, payload: this.item })
        } else {
          await this.create(this.item)
        }

        this.$emit('saved')
        this.close()
      } catch (error) {
        Promise.reject(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
