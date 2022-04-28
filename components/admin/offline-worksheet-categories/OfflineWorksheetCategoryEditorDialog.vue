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
            <v-form ref="activityTypeForm" @submit.prevent="passes(save)">
              <validation-provider
                v-slot="{ errors }"
                name="Category"
                rules="required"
              >
                <pg-text-field
                  v-model="item.category"
                  :error-messages="errors"
                  label="Category"
                  solo-labeled
                />
              </validation-provider>

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
                  path="offline-worksheet-categories"
                  placeholder="Select an icon for this offline worksheet category"
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
    category: null,
    color: '#FF0000',
    icon: null
  }
}

export default {
  name: 'OfflineWorksheetCategoryEditorDialog',

  data () {
    return {
      file: null,
      dialog: false,
      loading: false,
      id: null,
      item: generateItemTemplate()
    }
  },

  computed: {
    title () {
      return this.id === null
        ? 'New Offline Worksheet Category'
        : 'Edit Offline  Worksheet Category'
    }
  },

  methods: {
    ...mapActions('offline-worksheet-categories', [
      'createOfflineWorksheetCategory',
      'updateOfflineWorksheetCategory'
    ]),

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
          await this.createOfflineWorksheetCategory(this.item)
        } else {
          await this.updateOfflineWorksheetCategory({
            id: this.id,
            data: this.item
          })
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
