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
                  <v-col
                    class="text-md-right"
                    cols="12"
                    sm="3"
                  >
                    <span class="subheader">Activity title:</span>
                  </v-col>
                  <v-col cols="12" sm="9" lg="6">
                    <validation-provider v-slot="{ errors }" name="Activity Title" rules="required">
                      <v-text-field
                        v-model="activity.name"
                        :error-messages="errors"
                        solo
                      />
                    </validation-provider>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="text-md-right" cols="12" sm="3">
                    <span class="subheader">Description:</span>
                  </v-col>
                  <v-col cols="12" sm="9" lg="6">
                    <validation-provider v-slot="{ errors }" name="Description" rules="required">
                      <v-textarea
                        v-model="activity.description"
                        :error-messages="errors"
                        solo
                      />
                    </validation-provider>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="text-md-right" cols="12" sm="3">
                    <span class="subheader">Category:</span>
                  </v-col>
                  <v-col cols="12" sm="9" lg="6">
                    <validation-provider v-slot="{ errors }" name="Category" rules="required">
                      <v-select
                        v-model="activity.activityTypeId"
                        :error-messages="errors"
                        :items="activityTypes"
                        solo
                      />
                    </validation-provider>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="text-md-right" cols="12" sm="3">
                    <span class="subheader">Video:</span>
                  </v-col>
                  <v-col class="text-center" cols="12" sm="9" lg="6">
                    <video v-if="!['', 'https://activity-url.com/', 'https://activity-url-updated.com/', null].includes(activity.videoId)" class="mb-3" width="100%" controls autoplay>
                      <source :src="activity.videoId" type="video/mp4">
                    </video>
                    <v-progress-circular
                      v-else-if="isVideoUploading"
                      class="mb-3"
                      color="primary"
                      width="8"
                      size="256"
                      indeterminate
                    >
                      <span class="black--text">
                        Your video is uploading
                      </span>
                    </v-progress-circular>
                    <validation-provider ref="fileProvider" v-slot="{ errors }" name="Video" :rules="`${(activity.videoId === null && file === null) ? 'required' : ''}`">
                      <file-uploader
                        ref="fileUploader"
                        :error-messages="errors"
                        :file.sync="file"
                        label="Upload Video"
                        mode="video"
                        path="activity-video"
                        placeholder="Select a video for this activity"
                        prepend-icon=""
                        append-icon="mdi-video"
                        mp4
                        mov
                        mpeg
                        webm
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

export default {
  name: 'Editor',

  layout: 'admin',

  data () {
    return {
      loading: false,
      file: null,
      activity: {
        featured: false,
        name: '',
        description: '',
        activityTypeId: null,
        videoId: 1,
        type: 'VIDEO'
      }
    }
  },

  computed: {
    ...mapGetters('admin/activity', ['rows', 'types']),
    ...mapGetters('upload', ['uploads']),

    id () {
      return (this.$route.query.id) ? parseInt(this.$route.query.id) : null
    },

    title () {
      return this.id ? 'Edit Activity' : 'New Activity'
    },

    isVideoUploading () {
      if (this.id) {
        const upload = this.uploads.find(({ meta }) => {
          return meta.type === 'activity-video' && meta.id === this.id
        })
        if (upload) {
          return true
        }
      }
      return false
    },

    activityTypes () {
      return this.types.map(type => ({
        text: type.name,
        value: type.id
      }))
    }
  },

  watch: {
    file (val) {
      this.$refs.fileProvider.syncValue(val)
      this.$refs.fileProvider.validate()
    }
  },

  async created () {
    this.loading = true
    const promises = []

    promises.push(this.getTypes())

    if (this.id) {
      promises.push(this.getActivityById(this.id))
    }

    const results = await Promise.all(promises)

    if (results[1]) {
      const data = results[1]
      this.activity.featured = data.featured
      this.activity.name = data.name
      this.activity.description = data.description
      this.activity.activityTypeId = data.activityType.id
      this.activity.videoId = data.videoId
    }

    this.loading = false
  },

  mounted () {
    if (this.loading) {
      const interval = window.setInterval(() => {
        if (this.loading === false) {
          this.$refs.fileProvider.syncValue(this.file)
          this.$refs.fileProvider.validate()
          window.clearInterval(interval)
        }
      }, 50)
    }
  },

  methods: {
    ...mapActions('admin/activity', [
      'getActivities', 'getActivityById', 'createActivity', 'updateActivity', 'getTypes'
    ]),

    async save () {
      this.loading = true
      // let id = this.id
      // const activity = this.activity

      try {
        await this.$refs.fileUploader.handleMultiPartBackgroundFileUpload()
        /*
        if (id === null) {
          const response = await this.createActivity(activity)
          id = response.id
        } else {
          await this.updateActivity({ id, data: activity })
        }
        this.$refs.fileUploader.handleMultiPartBackgroundFileUpload(async ({ videoId }) => {
          activity.videoId = videoId
          await this.updateActivity({ id, data: activity })
        }, { type: 'activity-video', id })

      } catch (err) {
        this.loading = false
        return
        */
      } finally {
        // this.$router.push({ name: 'admin-activity-management' })
        this.loading = false
      }
    }
  }
}
</script>
