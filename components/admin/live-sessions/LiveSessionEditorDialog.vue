<template>
  <validation-observer ref="obs" v-slot="{ invalid, passes }">
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="700px"
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
            <v-icon> mdi-close </v-icon>
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

            <validation-provider v-if="mode === 'LiveClass'" v-slot="{ errors }" name="Letter">
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
              name="timezone"
              rules="required"
              class="mb-6"
            >
              <pg-select
                v-model="selectedTimezone"
                :error-messages="errors"
                item-text="name"
                item-value="value"
                solo
                placeholder="Timezone"
                :items="timezoneOptions"
                class="select"
              />
            </validation-provider>

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
              v-if="!createLink"
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

            <span>Automatically create link:</span>
            <v-switch
              v-model="createLink"
              class="mx-1 my-1 pa-0"
              dense
              hide-details
              inset
              :label="createLink ? 'Enabled' : 'Disabled'"
            />

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

            <span>Status:</span>
            <v-switch
              v-model="item.active"
              class="mx-1 my-1 pa-0"
              dense
              hide-details
              inset
              :label="item.active ? 'Active' : 'Inactive'"
            />

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
                solo-labeled
                type="number"
              />
            </validation-provider>

            <validation-provider
              v-if="mode === 'Playdate'"
              v-slot="{ errors }"
              name="Spots"
              rules="required|integer|min_value:1"
            >
              <pg-text-field
                v-model="item.spots"
                :error-messages="errors"
                label="Spots"
                min="1"
                solo-labeled
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
              name="Document"
            >
              <pg-file-uploader
                ref="documentFileUploaderDropBox"
                v-model="documentFile"
                append-icon="mdi-file-document"
                :error-messages="errors"
                label="Upload Document"
                mode="document"
                path="document-live-session"
                placeholder="Select a document"
                solo-labeled
                api="dropbox"
                pdf
                @sendFile="setDocumentFile"
              />
            </validation-provider>
            <div v-if="item.file" class="text-container mb-4 mt-n3">
              <div class="link">
                <a
                  target="_blank"
                  :href="item.file"
                >View Document</a>
              </div>
            </div>

            <validation-provider
              v-slot="{ errors }"
              name="Icon"
              rules="size:10000"
            >
              <pg-file-uploader
                ref="imageFileUploaderDropBox"
                v-model="image"
                append-icon="mdi-camera"
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
            <validation-provider v-slot="{ errors }" name="Video">
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
            color="green"
            :dark="!isDesktop"
            :text="isDesktop"
            :disabled="invalid"
            :loading="loading"
            @click.stop="passes(save)"
          >
            Save
          </v-btn>

          <v-btn
            color="orange"
            :dark="!isDesktop"
            :text="isDesktop"
            :disabled="loading"
            @click.stop="close"
          >
            Cancel
          </v-btn>

          <v-btn
            v-if="id"
            color="red"
            :dark="!isDesktop"
            :text="isDesktop"
            :disabled="loading"
            @click="remove(item.title)"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </validation-observer>
</template>

<script>
import dayjs from 'dayjs'
import { mapActions, mapGetters } from 'vuex'
import { timezoneOptions } from '@/utils/dateTools'

const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

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
    documentFile: null,
    type: null,
    spots: 0,
    active: false,
    duration: null,
    dateStart: null,
    dateEnd: null,
    file: null,
    inCollaborationWith: null
  }
}
export default {
  name: 'LiveSessionEditorDialog',
  props: {
    mode: {
      type: String,
      required: true,
      default: 'LiveClass'
    }
  },
  data: () => ({
    dateStart: null,
    dateEnd: null,
    timeStart: null,
    timeEnd: null,
    menuDateStart: false,
    menuDateEnd: false,
    selectedTimezone: 'America/New_York',
    timezoneOptions,
    menuTimeStart: false,
    menuTimeEnd: false,
    dialog: false,
    loading: false,
    documentFile: null,
    typeSelectDocumentFile: null,
    typeSelectImageFile: null,
    typeSelectVideoFile: null,
    id: null,
    video: null,
    player: null,
    file: null,
    image: null,
    createLink: false,
    item: generateItemTemplate()
  }),
  computed: {
    ...mapGetters('admin/activity', ['types']),
    ...mapGetters('admin/curriculum', { curriculumTypes: 'types' }),
    ...mapGetters('auth', ['getUserInfo']),

    dataStartFormatted () {
      return this.dateStart ? dayjs(this.dateStart).format('MM/DD/YYYY') : null
    },
    dataEndFormatted () {
      return this.dateEnd ? dayjs(this.dateEnd).format('MM/DD/YYYY') : null
    },
    title () {
      const meetingType = (this.mode === 'LiveClass') ? 'Live Class' : 'Playdate'
      return this.id === null ? `New ${meetingType}` : `Edit ${meetingType}`
    },
    isDesktop() {
      return this.$vuetify.breakpoint.smAndUp
    }
  },

  watch: {
    'item.type' (val) {
      if (val === 'Playdate') {
        this.item.spots = (this.item.spots) ? this.item.spots : null
      }
    },
    createLink (val) {
      if (val) {
        this.item.link = null
      }
    }
  },
  created () {
    this.getTypes({ extra: true })
    this.getCurriculumTypes()
    const { timezone } = this.getUserInfo
    this.selectedTimezone = timezone
  },
  methods: {
    ...mapActions('live-sessions', ['createLiveSession', 'updateLiveSession', 'deleteLiveSession']),
    ...mapActions('admin/activity', ['getTypes']),
    ...mapActions('admin/curriculum', {
      getCurriculumTypes: 'getTypes'
    }),
    ...mapActions('admin/users', ['setTimezone']),
    ...mapActions('auth', ['fetchUserInfo']),

    onPlayerReady (player) {
      this.player = player
    },
    setDocumentFile (type) {
      this.typeSelectDocumentFile = type
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
    remove (title) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete Live Class?',
        message: `Are you sure you want to delete <b>${title}</b>?`,
        action: async () => {
          await this.deleteLiveSession(this.id)
          this.$emit('saved')
          this.$nuxt.$emit('update-calendar')
          await this.close()
        }
      })
    },
    loadFormatTimezone (item) {
      if (item.dateStart) {
        this.dateStart = dayjs(item.dateStart).tz(this.selectedTimezone).format('YYYY-MM-DD')
        this.timeStart = dayjs(item.dateStart).tz(this.selectedTimezone).format('HH:mm')

        this.dateEnd = dayjs(item.dateEnd).tz(this.selectedTimezone).format('YYYY-MM-DD')
        this.timeEnd = dayjs(item.dateEnd).tz(this.selectedTimezone).format('HH:mm')
      }
    },
    async loadCurrentTimezone () {
      await this.setTimezone({ timezone: this.selectedTimezone })
      await this.fetchUserInfo()
      const { timezone } = this.getUserInfo
      if (timezone) {
        this.selectedTimezone = timezone
      }
    },
    close () {
      this.$nextTick(() => {
        this.dialog = false
        this.loading = false
        this.image = null
        this.video = null
        this.file = null
        this.documentFile = null
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
      this.item.type = (this.mode === 'LiveClass') ? this.type : 'Playdate'
      if (imageData) {
        this.item.inCollaborationWith = imageData
      }

      if (this.dateStart) {
        this.item.day = dayjs(new Date(this.dateStart)).format('dddd').toUpperCase()
      }

      if (this.file) {
        const { video } = (this.typeSelectVideoFile !== 'dropBox') ? await this.$refs.videoFileUploaderDropBox.handleUpload() : await this.$refs.videoFileUploaderDropBox.handleDropBoxFileUpload()
        const data = video.id
        if (data) {
          this.item.videoId = data
        }
      }
      if (this.documentFile) {
        if (this.typeSelectDocumentFile !== 'dropBox') {
          this.item.file = await this.$refs.documentFileUploaderDropBox.handleUpload()
        } else {
          const { filePath } = await this.$refs.documentFileUploaderDropBox.handleDropBoxFileUpload()
          this.item.file = filePath
        }
      }

      const timezoneStart = dayjs.tz(`${this.dateStart} ${this.timeStart}`, this.selectedTimezone).format()
      this.item.dateStart = dayjs(timezoneStart).utc().format()
      const timezoneEnd = dayjs.tz(`${this.dateEnd} ${this.timeEnd}`, this.selectedTimezone).format()
      this.item.dateEnd = dayjs(timezoneEnd).utc().format()
      this.item.active = (this.item.active) ? 'true' : 'false'
      try {
        if (this.id === null) {
          await this.createLiveSession(this.item)
        } else {
          await this.updateLiveSession({ id: this.id, data: this.item })
        }
        this.$nuxt.$emit('update-calendar')
        this.close()
        this.loadCurrentTimezone()
        this.$emit('saved')
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

      if (item.dateStart && item.dateEnd) {
        this.loadFormatTimezone(item)
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
