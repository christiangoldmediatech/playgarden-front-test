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
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-container>
            <validation-provider
              v-slot="{ errors }"
              name="Type"
              rules="required"
            >
              <pg-select
                v-model="item.type"
                :error-messages="errors"
                placeholder="Select type"
                :items="listTypes"
                solo
              />
            </validation-provider>

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
              name="Active"
              rules="required"
            >
              <label>Status</label>
              <v-switch
                v-model="item.active"
                :label="getActiveLabel"
                :error-messages="errors"
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
              name="Day"
              rules="required"
            >
              <pg-text-field
                v-model="item.day"
                :error-messages="errors"
                readonly
                label="Day"
                solo-labeled
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
                min="1"
                solo-labeled
                type="text"
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
                solo-labeled
                type="number"
              />
            </validation-provider>

            <validation-provider
              v-if="item.type === 'Playdate'"
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

            <validation-provider
              v-slot="{ errors }"
              name="Document"
            >
              <pg-file-uploader
                ref="documentFileUploaderDropBox"
                v-model="file"
                append-icon="mdi-camera"
                :error-messages="errors"
                label="Upload Document"
                mode="document"
                path="document-recurring-live"
                placeholder="Select a document"
                solo-labeled
                api="dropbox"
                pdf
                @sendFile="setDocumentFile"
              />
            </validation-provider>
          </v-container>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="green"
            :disabled="invalid"
            :loading="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="passes(save)"
          >
            Save
          </v-btn>

          <v-btn
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
import { timezoneOptions } from '@/utils/dateTools'
import { mapActions, mapGetters } from 'vuex'
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

function generateItemTemplate () {
  return {
    activityTypeId: null,
    title: null,
    active: false,
    description: null,
    link: null,
    teacher: null,
    file: null,
    ages: null,
    duration: null,
    dateStart: null,
    spots: 0,
    day: null,
    type: 'LiveClass'
  }
}

export default {
  name: 'RecurringLiveSessionEditorDialog',

  data: () => ({
    dateStart: null,
    dateEnd: null,
    timeStart: null,
    timeEnd: null,
    file: null,
    timezoneOptions,
    selectedTimezone: 'America/New_York',
    menuDateStart: false,
    menuDateEnd: false,
    menuTimeStart: false,
    menuTimeEnd: false,
    dialog: false,
    loading: false,
    id: null,
    listTypes: ['Playdate', 'LiveClass'],
    typeSelectDocumentFile: null,
    item: generateItemTemplate()
  }),

  computed: {
    ...mapGetters('admin/activity', ['types']),
    ...mapGetters('auth', ['getUserInfo']),

    dataStartFormatted () {
      return this.dateStart ? dayjs(this.dateStart).format('MM/DD/YYYY') : null
    },

    title () {
      return this.id === null ? 'New Recurring LiveSession' : 'Edit Recurring LiveSession'
    },

    getActiveLabel () {
      return (this.item.active) ? 'Active' : 'Inactive'
    }
  },

  watch: {
    dateStart (val) {
      this.item.day = dayjs(this.dateStart).format('dddd').toUpperCase()
    },
    selectedTimezone (val) {
      this.loadFormatTimezone(this.item)
    },
    'item.type' (val) {
      if (val === 'Playdate') {
        this.item.spots = (this.item.spots) ? this.item.spots : null
      }
    }
  },

  created () {
    this.loadCurrentTimezone()
  },

  methods: {
    ...mapActions('admin/recurring-live-sessions', ['createRecurringLiveSession', 'updateRecurringLiveSession']),

    loadCurrentTimezone () {
      const { timezone } = this.getUserInfo
      if (timezone) {
        this.selectedTimezone = timezone
      }
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
        this.file = null
        this.$refs.obs.reset()
        this.loadCurrentTimezone()
      })
    },

    setDocumentFile (type) {
      this.typeSelectDocumentFile = type
    },

    async save () {
      this.loading = true
      const start = dayjs(`${this.dateStart} ${this.timeStart}`).utc().format()
      this.item.dateStart = dayjs.utc(start)
      this.item.active = (this.item.active) ? 'true' : 'false'

      try {
        if (this.file) {
          if (this.typeSelectDocumentFile !== 'dropBox') {
            this.item.file = await this.$refs.documentFileUploaderDropBox.handleUpload()
          } else {
            const { filePath } = await this.$refs.documentFileUploaderDropBox.handleDropBoxFileUpload()
            this.item.file = filePath
          }
        }

        if (this.id === null) {
          await this.createRecurringLiveSession(this.item)
        } else {
          await this.updateRecurringLiveSession({ id: this.id, data: this.item })
        }

        this.$emit('saved')
        this.dateStart = null
        this.timeStart = null
        this.close()
      } catch (err) {
      } finally {
        this.loading = false
      }
    },

    resetItem () {
      this.id = null
      this.item = generateItemTemplate()
    },

    loadFormatTimezone (item) {
      if (item.dateStart) {
        this.dateStart = dayjs(item.dateStart).tz(this.selectedTimezone).format('YYYY-MM-DD')
        this.timeStart = dayjs(item.dateStart).tz(this.selectedTimezone).format('HH:mm')
      }
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
        this.loadFormatTimezone(item)
      }

      if (item.dateEnd) {
        const dateEnd = item.dateEnd.replace(':00.000Z', '').split('T')

        this.dateEnd = dateEnd[0]
        this.timeEnd = dateEnd[1]
      }

      if (item.activityType) {
        this.item.activityTypeId = item.activityType.id
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
