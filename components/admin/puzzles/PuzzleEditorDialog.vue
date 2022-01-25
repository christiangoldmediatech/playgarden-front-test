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
              name="Name"
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
              name="Columns"
              rules="required|integer|min_value:1"
            >
              <pg-text-field
                v-model="item.columns"
                :error-messages="errors"
                label="Columns"
                min="1"
                type="number"
                solo-labeled
              />
            </validation-provider>

            <validation-provider
              v-slot="{ errors }"
              name="Rows"
              rules="required|integer|min_value:1"
            >
              <pg-text-field
                v-model="item.rows"
                :error-messages="errors"
                label="Rows"
                min="1"
                type="number"
                solo-labeled
              />
            </validation-provider>

            <validation-provider
              v-slot="{ errors }"
              name="Lesson"
              rules="required"
            >
              <pg-select
                v-model="item.curriculumTypeId"
                clearable
                :disabled="loading"
                :error-messages="errors"
                :items="[{ name: 'ALL', id: 0 }, ...types]"
                item-text="name"
                item-value="id"
                label="lesson"
                solo-labeled
              />
            </validation-provider>

            <validation-provider
              v-slot="{ errors }"
              name="Level"
              rules="required"
            >
              <pg-select
                v-model="item.level"
                clearable
                :disabled="loading"
                :error-messages="errors"
                :items="levels"
                item-text="label"
                item-value="value"
                label="Level"
                solo-labeled
              />
            </validation-provider>

            <p class="mb-5 subtitle-2">
              Image:
            </p>

            <v-row v-if="item.image" class="mb-5" justify="center">
              <v-col cols="5" sm="3">
                <v-img contain :src="item.image" />
              </v-col>
            </v-row>

            <validation-provider
              v-slot="{ errors }"
              name="Image"
              rules="size:10000"
            >
              <file-uploader
                ref="fileUploader"
                v-model="file"
                :error-messages="errors"
                label="Upload Image"
                mode="image"
                path="puzzle"
                placeholder="Select an image for this puzzle"
                prepend-icon="mdi-camera"
                solo-labeled
                jpg
                png
                svg
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
import { mapActions, mapGetters } from 'vuex'

function generateItemTemplate () {
  return {
    name: null,
    pieces: 5,
    columns: 5,
    rows: 1,
    image: null,
    level: null,
    curriculumTypeId: null
  }
}

export default {
  name: 'PuzzleEditorDialog',

  data: () => ({
    file: null,
    dialog: false,
    loading: false,
    id: null,
    item: generateItemTemplate(),
    levels: [
      { label: 'Beginner', value: 'BEGINNER' },
      { label: 'Intermediate', value: 'INTERMEDIATE' },
      { label: 'Advanced', value: 'ADVANCED' }
    ]
  }),

  computed: {
    ...mapGetters('admin/curriculum', ['types']),

    title () {
      return this.id === null ? 'New Puzzle' : 'Edit Puzzle'
    }
  },

  methods: {
    ...mapActions('puzzles', ['createPuzzle', 'updatePuzzle']),

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

    async save () {
      this.loading = true
      try {
        if (this.file) {
          this.item.image = await this.$refs.fileUploader.handleUpload()
        }

        if (this.id === null) {
          await this.createPuzzle(this.item)
        } else {
          await this.updatePuzzle({ id: this.id, data: this.item })
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
      this.item = generateItemTemplate()
      this.file = null
    },

    loadItem (item) {
      this.id = item.id

      // Handle keys
      Object.keys(item).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(this.item, key)) {
          this.item[key] = item[key]
        }
      })

      if (item.curriculumType) {
        this.item.curriculumTypeId = item.curriculumType.id
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
