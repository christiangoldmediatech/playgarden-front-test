<template>
  <validation-observer ref="obs" v-slot="{ invalid, passes }">
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="500px"
      persistent
      scrollable
    >
      <v-card>
        <v-toolbar class="flex-grow-0" color="primary darken-1" dark dense flat>
          <v-toolbar-title>
            {{ title }}
          </v-toolbar-title>

          <v-spacer />

          <v-btn :disabled="loading" icon @click.stop="close">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-container>
            <v-form @submit.prevent="passes(save)">
              <validation-provider
                v-slot="{ errors }"
                name="Name"
                rules="required"
              >
                <v-text-field
                  v-model="item.name"
                  :error-messages="errors"
                  label="Name"
                  solo
                />
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Description"
                rules="required"
              >
                <v-textarea
                  v-model="item.description"
                  :error-messages="errors"
                  label="Description"
                  solo
                />
              </validation-provider>

              <span class="v-label theme--light">Video</span>

              <template v-if="item.videoId">
                <div class="mb-6 mt-3">
                  <v-badge avatar class="video-badge" color="error" overlap>
                    <template v-slot:badge>
                      <v-avatar
                        class="clickable"
                        @click.native="item.videoId = null"
                      >
                        <v-icon>
                          mdi-close
                        </v-icon>
                      </v-avatar>
                    </template>

                    <jw-player
                      :file="item.videos.videoUrl"
                      :title="item.videos.name"
                      :image="item.videos.thumbnail"
                      :description="item.videos.description"
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
                  ref="videoUploader"
                  v-model="video"
                  :error-messages="errors"
                  :file.sync="video"
                  label="Upload Video"
                  mode="video"
                  mov
                  mp4
                  mpeg
                  multi-part
                  path="onboarding"
                  placeholder="Select a video for this onboarding"
                  prepend-icon="mdi-video"
                  webm
                />
              </validation-provider>

              <span class="v-label theme--light">Thumbnail</span>

              <template v-if="item.thumbnail">
                <div class="mb-6 mt-3">
                  <v-badge avatar color="error" overlap>
                    <template v-slot:badge>
                      <v-avatar
                        class="clickable"
                        @click.native="item.thumbnail = null"
                      >
                        <v-icon>
                          mdi-close
                        </v-icon>
                      </v-avatar>
                    </template>

                    <v-img width="250" :src="item.thumbnail" />
                  </v-badge>
                </div>
              </template>

              <validation-provider
                v-else
                v-slot="{ errors }"
                name="Thumbnail"
                rules="required"
              >
                <file-uploader
                  ref="thumbnailUploader"
                  v-model="thumbnail"
                  :error-messages="errors"
                  :file.sync="thumbnail"
                  label="Upload Thumbnail"
                  mode="image"
                  path="onboarding-thumbnail"
                  placeholder="Select a thumbnail for this onboarding"
                  prepend-icon="mdi-camera"
                  png
                  jpg
                />
              </validation-provider>
            </v-form>
          </v-container>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn
            class="white--text"
            color="green"
            :disabled="invalid"
            :loading="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="passes(save)"
          >
            Save
          </v-btn>

          <v-btn
            class="white--text"
            color="red"
            :disabled="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="close"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </validation-observer>
</template>

<script>
import { mapActions } from 'vuex'

function generateItemTemplate () {
  return {
    videoId: null,
    name: null,
    description: null,
    videos: {},
    thumbnail: null
  }
}

export default {
  name: 'OnboardingEditorDialog',

  data: () => ({
    dialog: false,
    loading: false,
    id: null,
    video: null,
    thumbnail: null,
    item: generateItemTemplate()
  }),

  computed: {
    title () {
      return this.id === null ? 'New Onboarding' : 'Edit Onboarding'
    }
  },

  methods: {
    ...mapActions('onboarding', ['createOnboarding', 'updateOnboarding']),

    close () {
      this.$nextTick(() => {
        this.dialog = false
        this.loading = false
        this.$refs.obs.reset()
      })
    },

    async save () {
      this.loading = true

      try {
        if (this.video) {
          const { video } = await this.$refs.videoUploader.handleUpload()

          this.item.videoId = video.id
        }

        if (this.thumbnail) {
          this.item.thumbnail = await this.$refs.thumbnailUploader.handleUpload()
        }

        if (this.id === null) {
          await this.createOnboarding(this.item)
        } else {
          await this.updateOnboarding({ id: this.id, data: this.item })
        }

        this.$emit('saved')
      } catch (err) {
        this.loading = false
      } finally {
        this.close()
      }
    },

    resetItem () {
      this.id = null
      this.video = null
      this.thumbnail = null
      this.item = generateItemTemplate()
    },

    loadItem (item) {
      this.id = item.id

      // Handle keys
      Object.keys(item).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(this.item, key)) {
          this.item[key] = item[key]
        }
      })

      if (item.videos) {
        this.item.videoId = item.videos.id
        this.item.thumbnail = item.videos.thumbnail
      }
    },

    open (evt, item = null) {
      this.resetItem()

      if (item) {
        this.loadItem(item)
      }

      this.$nextTick(() => {
        this.dialog = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.video-badge {
  width: 100%;
}
</style>
