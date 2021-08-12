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
              name="Status"
              rules="required"
            >
              <pg-select
                v-model="item.state"
                clearable
                :disabled="loading"
                :error-messages="errors"
                :items="states"
                item-text="name"
                item-value="id"
                label="Status"
                solo-labeled
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

function generateItemTemplate () {
  return {
    activityTypeId: null,
    title: null,
    state: null,
    active: false,
    description: null,
    link: null,
    teacher: null,
    ages: null,
    duration: null,
    dateStart: null,
    day: null
  }
}

export default {
  name: 'PlaydatesEditorDialog',

  data: () => ({
    dialog: false,
    loading: false,
    id: null,
    item: generateItemTemplate(),
    states: ['REQUESTED', 'PENDING', 'APPROVED', 'REJECTED']
  }),

  computed: {
    title () {
      return this.id === null ? 'New Playdate' : 'Edit Playdate'
    }
  },

  watch: {},

  methods: {
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
        this.$refs.obs.reset()
      })
    },

    /* async */ save () {
      this.loading = true

      /* try {
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
      } */
    },

    resetItem () {
      this.id = null
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
        const dateStart = new Date(item.dateStart)
        this.dateStart = `${dateStart.getFullYear()}-${(dateStart.getMonth() + 1).toString().padStart(2, '0')}-${dateStart.getDate().toString().padStart(2, '0')}`
        this.timeStart = `${dateStart.getHours().toString().padStart(2, '0')}:${dateStart.getMinutes().toString().padStart(2, '0')}`
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
