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
                name="Code"
                rules="required"
              >
                <pg-text-field
                  v-model="item.code"
                  :error-messages="errors"
                  label="Code"
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
                  path="backpack"
                  placeholder="Select an image for this backpack"
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
    name: null,
    code: null,
    image: null
  }
}

export default {
  name: 'BackpackEditorDialog',

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
      return this.id === null ? 'New Backpack' : 'Edit Backpack'
    }
  },

  methods: {
    ...mapActions('backpacks', ['createBackpack', 'updateBackpack']),

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
          await this.createBackpack(this.item)
        } else {
          await this.updateBackpack({ id: this.id, data: this.item })
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
