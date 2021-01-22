<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            {{ title }}
            <v-spacer />
            <v-btn
              class="text-none"
              color="accent darken-1"
              depressed
              nuxt
              small
              :to="{ name: 'admin-activity-management' }"
            >
              Back
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <validation-observer v-slot="{ invalid, passes }">
            <v-card-text>
              <v-form>
                <v-row>
                  <v-col class="text-md-right" cols="12" sm="3">
                    <span class="subheader">Teachers' name:</span>
                  </v-col>

                  <v-col cols="12" sm="9" lg="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Teachers' name"
                      rules="required"
                    >
                      <pg-text-field
                        v-model="activity.name"
                        :error-messages="errors"
                        label="Teachers' name"
                        solo-labeled
                      />
                    </validation-provider>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="text-md-right" cols="12" sm="3">
                    <span class="subheader">Video Description:</span>
                  </v-col>

                  <v-col cols="12" sm="9" lg="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Video Description"
                      rules="required"
                    >
                      <pg-textarea
                        v-model="activity.description"
                        :error-messages="errors"
                        label="Video Description"
                        solo-labeled
                      />
                    </validation-provider>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="text-md-right" cols="12" sm="3">
                    <span class="subheader">Category:</span>
                  </v-col>

                  <v-col cols="12" sm="9" lg="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Category"
                      rules="required"
                    >
                      <pg-select
                        v-model="activity.activityTypeId"
                        :error-messages="errors"
                        :items="activityTypes"
                        label="Select a category"
                        solo-labeled
                      />
                    </validation-provider>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="text-md-right" cols="12" sm="3">
                    <span class="subheader">Curriculum:</span>
                  </v-col>

                  <v-col cols="12" sm="9" lg="6">
                    <pg-select
                      v-model="activity.curriculumTypeId"
                      :items="curriculumTypes"
                      label="Curriculum"
                      solo-labeled
                    />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="text-md-right" cols="12" sm="3">
                    <span class="subheader">Video:</span>
                  </v-col>

                  <v-col class="text-center" cols="12" sm="9" lg="6">
                    <pg-inline-video-player
                      v-if="video && video.videoUrl"
                      @ready="onPlayerReady"
                    />

                    <v-progress-circular
                      v-else-if="
                        video &&
                          ['PROCESSING', 'UPLOADING'].includes(video.status)
                      "
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

                    <validation-provider
                      v-slot="{ errors }"
                      name="Video"
                      :rules="{ required: Boolean(!id && !file) }"
                    >
                      <file-uploader
                        ref="fileUploader"
                        v-model="file"
                        :error-messages="errors"
                        append-icon="mdi-video"
                        label="Upload Video"
                        mode="video"
                        multi-part
                        path="activity-video"
                        placeholder="Select a video for this activity"
                        solo-labeled
                        mp4
                        mov
                        mpeg
                        webm
                      />
                    </validation-provider>
                  </v-col>
                </v-row>

                <v-row>
                  <select-file
                    ref="fileUploaderDropBox"
                    v-model="file"
                    mode="video"
                    multi-part
                    path="activity-video"
                    @sendFile="setFileDropBox" />
                </v-row>

                <v-row>
                  <v-col class="text-md-right" cols="12" sm="3">
                    <span class="subheader">Video Thumbnail:</span>
                  </v-col>

                  <v-col class="text-center" cols="12" sm="9" lg="6">
                    <v-img
                      v-if="activity.thumbnail"
                      max-width="250"
                      :src="activity.thumbnail"
                    />

                    <validation-provider
                      v-slot="{ errors }"
                      name="Thumbnail"
                      :rules="{
                        required: !activity.thumbnail && !thumbnail,
                        size: 10000
                      }"
                    >
                      <file-uploader
                        ref="fileUploader2"
                        v-model="thumbnail"
                        append-icon="mdi-camera"
                        :error-messages="errors"
                        label="Upload Thumbnail"
                        mode="image"
                        path="activity-thumbnail"
                        placeholder="Select a thumbnail for this activity video"
                        solo-labeled
                        jpg
                        png
                        svg
                      />
                    </validation-provider>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn
                class="px-5 text-none"
                color="primary"
                :disabled="invalid || loading"
                :loading="loading"
                x-large
                @click.stop="passes(save)"
              >
                Finalize
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </validation-observer>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
// import PgInlineVideoPlayer from '@/components/pg-video-js-player/PgInlineVideoPlayer.vue'
import SelectFile from '@/components/dropbox/SelectFile.vue'

export default {
  name: 'Editor',

  layout: 'admin',

  components: {
    SelectFile
  //   PgInlineVideoPlayer
  },

  data () {
    return {
      loading: false,
      file: null,
      thumbnail: null,
      video: null,
      player: null,
      fileDropBox: null,
      showSelected: true,
      activity: {
        featured: false,
        name: '',
        description: '',
        activityTypeId: null,
        curriculumTypeId: null,
        videoId: null,
        thumbnail: null,
        type: 'VIDEO'
      }
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', { curriculumTypeRows: 'types' }),
    ...mapGetters('admin/activity', ['rows', 'types']),
    ...mapGetters('upload', ['uploads']),

    id () {
      return this.$route.query.id ? parseInt(this.$route.query.id) : null
    },

    title () {
      return this.id ? 'Edit Activity' : 'New Activity'
    },

    activityTypes () {
      return this.types.map(type => ({
        text: type.name,
        value: type.id
      }))
    },

    curriculumTypes () {
      return [
        {
          text: 'None',
          value: null
        },
        ...this.curriculumTypeRows.map(type => ({
          text: type.name,
          value: type.id
        }))
      ]
    }
  },

  watch: {
    file () {
      this.thumbnail = null
    }
  },

  async created () {
    this.loading = true
    const promises = []

    promises.push(this.getTypes(), this.getCurriculumTypes())

    if (this.id) {
      promises.push(this.getActivityById(this.id))
    }

    const results = await Promise.all(promises)
    const data = results[2]

    if (data) {
      this.activity.featured = data.featured
      this.activity.activityTypeId = data.activityType.id

      if (data.curriculumType) {
        this.activity.curriculumTypeId = data.curriculumType.id
      }

      if (data.videos) {
        this.activity.name = data.videos.name
        this.activity.description = data.videos.description
        this.activity.videoId = data.videos.id
        this.activity.thumbnail = data.videos.thumbnail
        this.video = data.videos
        this.waitAndLoad()
      }
    }

    this.loading = false
  },

  methods: {
    ...mapActions('admin/activity', [
      'getActivities',
      'getActivityById',
      'createActivity',
      'updateActivity',
      'getTypes'
    ]),

    ...mapActions('admin/curriculum', { getCurriculumTypes: 'getTypes' }),

    onPlayerReady (player) {
      this.player = player
    },

    playVideo () {
      this.player.play()
    },

    waitAndLoad () {
      return new Promise((resolve, reject) => {
        const start = new Date().getTime()
        const { name, thumbnail, videoUrl } = this.video
        const mediaObject = {
          title: name,
          poster: thumbnail,
          src: [
            {
              src: videoUrl.HLS,
              type: 'application/x-mpegURL'
            }
          ]
        }
        const interval = window.setInterval(() => {
          if (this.player) {
            this.player.loadMedia(mediaObject)
            window.clearInterval(interval)
            resolve()
            return
          }
          const elapsed = ((new Date().getTime()) - start)
          if (elapsed > 30000) {
            window.clearInterval(interval)
            reject(new Error('Player loading timed out'))
          }
        }, 50)
      })
    },

    setFileDropBox (file) {
      this.file = file
      this.fileDropBox = file
    },

    async save () {
      this.loading = true
      let id = this.id

      try {
        const thumbnail = await this.$refs.fileUploader2.handleUpload()
        if (thumbnail) {
          this.activity.thumbnail = thumbnail
        }
        let data = null
        if (!this.fileDropBox) {
          data = await this.$refs.fileUploader.handleUpload()
        } else {
          console.log('guardand archivo dropBox')
          data = await this.$refs.fileUploaderDropBox.handleUpload()
        }
        if (data) {
          this.activity.videoId = data.video.id
        }
        const activity = this.activity
        if (id === null) {
          // const response = await this.createActivity(activity)
          // id = response.id
          id = null
        } else {
          console.log('activity', activity)
          // await this.updateActivity({ id, data: activity })
        }
      } catch (err) {
        this.loading = false
        // return
      } finally {
        // this.$router.push({ name: 'admin-activity-management' })
      }
    }
  }
}
</script>
