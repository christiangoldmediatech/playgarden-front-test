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

        <v-card-text>
          <v-container>
            <validation-provider
              v-slot="{ errors }"
              name="Activity"
              rules="required"
            >
              <pg-select
                v-model="item.activityTypeId"
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

            <validation-provider
              v-slot="{ errors }"
              name="Letter"
            >
              <pg-select
                v-model="item.curriculumTypeId"
                clearable
                :disabled="loading"
                :error-messages="errors"
                :items="curriculumTypes"
                item-text="name"
                item-value="id"
                label="Letter"
                solo-labeled
              />
            </validation-provider>

            <validation-provider
              v-slot="{ errors }"
              name="Title"
              rules="required"
            >
              <pg-text-field
                v-model="item.title"
                :error-messages="errors"
                label="Title"
                solo-labeled
              />
            </validation-provider>

            <v-row>
              <v-col>
                <v-menu
                  v-model="menuDateStart"
                  :close-on-content-click="false"
                  min-width="290px"
                  offset-y
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Date Start"
                      rules="required"
                    >
                      <pg-text-field
                        :disabled="loading"
                        :error-message="errors"
                        label="Date Start"
                        readonly
                        solo-labeled
                        :value="dataStartFormatted"
                        v-bind="attrs"
                        v-on="on"
                      />
                    </validation-provider>
                  </template>

                  <v-date-picker v-model="dateStart" />
                </v-menu>
              </v-col>

              <v-col>
                <v-menu
                  v-model="menuTimeStart"
                  :close-on-content-click="false"
                  min-width="290px"
                  offset-y
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Time Start"
                      rules="required"
                    >
                      <pg-text-field
                        :disabled="loading"
                        :error-message="errors"
                        label="Time Start"
                        readonly
                        solo-labeled
                        :value="timeStart"
                        v-bind="attrs"
                        v-on="on"
                      />
                    </validation-provider>
                  </template>

                  <v-time-picker v-model="timeStart" format="24hr" />
                </v-menu>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-menu
                  v-model="menuDateEnd"
                  :close-on-content-click="false"
                  min-width="290px"
                  offset-y
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Date End"
                      rules="required"
                    >
                      <pg-text-field
                        :disabled="loading"
                        :error-message="errors"
                        label="Date End"
                        readonly
                        solo-labeled
                        :value="dataEndFormatted"
                        v-bind="attrs"
                        v-on="on"
                      />
                    </validation-provider>
                  </template>

                  <v-date-picker v-model="dateEnd" />
                </v-menu>
              </v-col>

              <v-col>
                <v-menu
                  v-model="menuTimeEnd"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Time End"
                      rules="required"
                    >
                      <pg-text-field
                        :disabled="loading"
                        :error-message="errors"
                        label="Time End"
                        readonly
                        solo-labeled
                        :value="timeEnd"
                        v-bind="attrs"
                        v-on="on"
                      />
                    </validation-provider>
                  </template>

                  <v-time-picker v-model="timeEnd" format="24hr" />
                </v-menu>
              </v-col>
            </v-row>

            <validation-provider
              v-slot="{ errors }"
              name="Description"
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
              name="Teacher"
              rules="required"
            >
              <pg-text-field
                v-model="item.teacher"
                :error-messages="errors"
                label="Teacher"
                solo-labeled
              />
            </validation-provider>

            <validation-provider
              v-slot="{ errors }"
              name="Link"
              rules="required|url"
            >
              <pg-text-field
                v-model="item.link"
                :error-messages="errors"
                label="Link"
                solo-labeled
              />
            </validation-provider>

            <validation-provider
              v-slot="{ errors }"
              name="Ages"
              rules="required"
            >
              <pg-text-field
                v-model="item.ages"
                :error-messages="errors"
                label="Ages"
                solo-labeled
              />
            </validation-provider>

            <validation-provider
              v-slot="{ errors }"
              name="Duration"
              rules="required|integer|min_value:1"
            >
              <pg-text-field
                v-model="item.duration"
                :error-messages="errors"
                label="Duration"
                min="1"
                solo
                type="number"
              />
            </validation-provider>

            <img
              v-if="item.inCollaborationWith"
              class="collaborator-image"
              :src="item.inCollaborationWith"
            >

            <validation-provider
              v-slot="{ errors }"
              name="Icon"
              rules="size:10000"
            >
              <pg-file-uploader
                ref="imageFileUploaderDropBox"
                v-model="image"
                prepend-icon="mdi-camera"
                :error-messages="errors"
                label="Upload Image"
                mode="image"
                path="live-session-collaborator"
                placeholder="Select an image for collaborator"
                solo-labeled
                api="dropbox"
                jpg
                png
                svg
                @sendFile="setImageFile"
              />
            </validation-provider>

            <!-- Video -->
            <validation-provider
              v-slot="{ errors }"
              name="Video"
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
                path="live-session-video"
                placeholder="Select a file for this video"
                solo-labeled
                mp4
                mov
                mpeg
                webm
                @sendFile="setVideoFile"
              />
            </validation-provider>
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
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </validation-observer>
</template>

<script>
import dayjs from 'dayjs'
import { stringsToDate } from '@/utils/dateTools'
import { mapActions, mapGetters } from 'vuex'

function generateItemTemplate () {
  return {
    activityTypeId: null,
    curriculumTypeId: null,
    title: null,
    description: null,
    link: null,
    videos: null,
    teacher: null,
    ages: null,
    duration: null,
    dateStart: null,
    dateEnd: null,
    inCollaborationWith: null
  }
}

export default {
  name: 'LiveSessionEditorDialog',

  data: () => ({
    dateStart: null,
    dateEnd: null,
    timeStart: null,
    timeEnd: null,
    menuDateStart: false,
    menuDateEnd: false,
    menuTimeStart: false,
    menuTimeEnd: false,
    dialog: false,
    loading: false,
    typeSelectImageFile: null,
    typeSelectVideoFile: null,
    id: null,
    video: null,
    player: null,
    file: null,
    image: null,
    item: generateItemTemplate()
  }),

  computed: {
    ...mapGetters('admin/activity', ['types']),
    ...mapGetters('admin/curriculum', { curriculumTypes: 'types' }),

    dataStartFormatted () {
      return this.dateStart ? dayjs(this.dateStart).format('MM/DD/YYYY') : null
    },

    dataEndFormatted () {
      return this.dateEnd ? dayjs(this.dateEnd).format('MM/DD/YYYY') : null
    },

    title () {
      return this.id === null ? 'New LiveSession' : 'Edit LiveSession'
    }
  },

  methods: {
    ...mapActions('live-sessions', ['createLiveSession', 'updateLiveSession']),

    onPlayerReady (player) {
      this.player = player
    },

    setVideoFile (type) {
      this.typeSelectVideoFile = type
    },

    setImageFile (type) {
      this.typeSelectImageFile = type
    },

    async refresh (clear = false) {
      this.loading = true

      if (clear) {
        this.search = ''
      }

      try {
        const { lessons, page, total } = await this.fetchLessons({
          name: this.search || null,
          curriculumTypeId: this.filters.curriculumTypeId || null,
          level: this.filters.level || null,
          page: this.pagination.page
        })

        this.resources = lessons
        this.setPagination({ page, total })
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    close () {
      this.$nextTick(() => {
        this.dialog = false
        this.loading = false
        this.image = null
        this.video = null
        this.file = null
        this.$refs.obs.reset()
      })
    },

    async save () {
      this.loading = true

      let imageData
      if (this.image) {
        if (this.typeSelectImageFile !== 'dropBox') {
          imageData = await this.$refs.imageFileUploaderDropBox.handleUpload()
        } else {
          const { filePath } = await this.$refs.imageFileUploaderDropBox.handleDropBoxFileUpload()
          imageData = filePath
        }
      }

      if (imageData) {
        this.item.inCollaborationWith = imageData
      }

      const { video } = (this.typeSelectVideoFile !== 'dropBox') ? await this.$refs.videoFileUploaderDropBox.handleUpload() : await this.$refs.videoFileUploaderDropBox.handleDropBoxFileUpload()
      const data = video.id

      if (data) {
        this.item.videoId = data
      }

      const start = stringsToDate(this.dateStart, this.timeStart)
      const end = stringsToDate(this.dateEnd, this.timeEnd)

      this.item.dateStart = start
      this.item.dateEnd = end

      try {
        if (this.id === null) {
          await this.createLiveSession(this.item)
        } else {
          await this.updateLiveSession({ id: this.id, data: this.item })
        }

        this.$emit('saved')

        this.close()
      } catch (err) {
      } finally {
        this.loading = false
      }
    },

    resetItem () {
      this.id = null
      this.video = null
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

      if (item.dateStart) {
        // const dateStart = item.dateStart.replace(':00.000Z', '').split('T')

        // this.dateStart = dateStart[0]
        // this.timeStart = dateStart[1]
        const dateStart = new Date(item.dateStart)
        this.dateStart = `${dateStart.getFullYear()}-${(dateStart.getMonth() + 1).toString().padStart(2, '0')}-${dateStart.getDate().toString().padStart(2, '0')}`
        this.timeStart = `${dateStart.getHours().toString().padStart(2, '0')}:${dateStart.getMinutes().toString().padStart(2, '0')}`
      }

      if (item.dateEnd) {
        // const dateEnd = item.dateEnd.replace(':00.000Z', '').split('T')

        // this.dateEnd = dateEnd[0]
        // this.timeEnd = dateEnd[1]
        const dateEnd = new Date(item.dateEnd)
        this.dateEnd = `${dateEnd.getFullYear()}-${(dateEnd.getMonth() + 1).toString().padStart(2, '0')}-${dateEnd.getDate().toString().padStart(2, '0')}`
        this.timeEnd = `${dateEnd.getHours().toString().padStart(2, '0')}:${dateEnd.getMinutes().toString().padStart(2, '0')}`
      }

      if (item.activityType) {
        this.item.activityTypeId = item.activityType.id
      }

      if (item.curriculumType) {
        this.item.curriculumTypeId = item.curriculumType.id
      }

      if (item.inCollaborationWith) {
        this.item.inCollaborationWith = item.inCollaborationWith
      }

      if (item.videos && item.videos.videoUrl) {
        this.item.videoId = item.videos.id
        this.video = item.videos
        const mediaObject = {
          title: item.name,
          // poster: thumbnail,
          src: {
            src: item.videos.videoUrl.HLS,
            type: 'application/x-mpegURL'
          },
          videoId: item.videos.id
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

<style lang="scss">
.collaborator-image {
  width: 100%;
  max-width: 100%;
}
</style>
