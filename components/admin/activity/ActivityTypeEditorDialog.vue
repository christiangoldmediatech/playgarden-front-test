<template>
  <validation-observer ref="obs" v-slot="{ invalid, passes }">
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="650px"
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
            <v-form ref="activityTypeForm" @submit.prevent="passes(save)">
              <validation-provider
                v-slot="{ errors }"
                name="Activity Type Name"
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
                name="Activity Type Description"
                rules="required"
              >
                <pg-textarea
                  v-model="item.description"
                  :error-messages="errors"
                  label="Description"
                  solo-labeled
                />
              </validation-provider>

              <span class="subtitle-2">Type:</span>

              <v-row justify="space-around">
                <v-checkbox
                  v-model="item.extra"
                  class="mt-1"
                  dense
                  label="Extra"
                />

                <v-checkbox
                  v-model="item.lesson"
                  class="mt-1"
                  dense
                  label="Lesson"
                />

                <v-checkbox
                  v-model="item.activity"
                  class="mt-1"
                  dense
                  label="Activity"
                />

                <v-checkbox
                  v-model="item.kidsCorner"
                  class="mt-1"
                  dense
                  label="Kids Corner"
                />
              </v-row>

              <span class="subtitle-2">Color:</span>

              <v-row justify="center">
                <v-color-picker
                  v-model="item.color"
                  hide-mode-switch
                  hide_inputs
                  mode="hexa"
                  :show-swatches="false"
                />
              </v-row>

              <p class="mb-5 subtitle-2">
                Icon:
              </p>

              <v-row v-if="item.icon" class="mb-5" justify="center">
                <v-col cols="5" sm="3">
                  <v-img contain :src="item.icon" />
                </v-col>
              </v-row>

              <validation-provider
                v-slot="{ errors }"
                name="Icon"
                rules="size:10000"
              >
                <file-uploader
                  ref="fileUploader"
                  v-model="file"
                  :error-messages="errors"
                  label="Upload Icon"
                  mode="image"
                  path="activity-type"
                  placeholder="Select an icon for this activity type"
                  prepend-icon="mdi-camera"
                  solo-labeled
                  jpg
                  png
                  svg
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
import { mapActions } from 'vuex'

function generateItemTemplate () {
  return {
    name: '',
    description: '',
    lesson: false,
    extra: false,
    activity: false,
    kidsCorner: false,
    color: '#FF0000',
    icon: null
  }
}

export default {
  name: 'ActivityTypeEditorDialog',

  data () {
    return {
      file: null,
      dialog: false,
      loading: false,
      valid: true,
      id: null,
      item: generateItemTemplate()
    }
  },

  computed: {
    title () {
      return this.id === null ? 'New Activity Type' : 'Edit Activity Type'
    }
  },

  methods: {
    ...mapActions('admin/activity', ['createType', 'updateType', 'getTypes']),

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
          this.item.icon = await this.$refs.fileUploader.handleUpload()
        }

        if (this.id === null) {
          await this.createType(this.item)
        } else {
          await this.updateType({ id: this.id, data: this.item })
        }

        await this.getTypes()

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

      // Handle types
      Object.keys(item.type).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(this.item, key)) {
          this.item[key] = item.type[key]
        }
      })
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
