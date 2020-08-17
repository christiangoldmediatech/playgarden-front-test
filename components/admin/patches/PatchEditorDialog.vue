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
          <v-toolbar-title>
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
                name="Activity"
                rules="required"
              >
                <v-select
                  v-model="item.activityTypeId"
                  clearable
                  :disabled="loading"
                  :error-messages="errors"
                  :items="types"
                  item-text="name"
                  item-value="id"
                  label="Activity"
                  solo
                />
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Name"
                rules="required"
              >
                <v-text-field
                  v-model="item.name"
                  :error-messages="errors"
                  label="Name"
                  solo
                />
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Description"
                rules="required"
              >
                <v-textarea
                  v-model="item.description"
                  :error-messages="errors"
                  label="Description"
                  solo
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

              <v-row>
                <file-uploader
                  ref="fileUploader"
                  :file.sync="file"
                  label="Upload Image"
                  mode="image"
                  path="patch"
                  placeholder="Select an image for this patch"
                  prepend-icon="mdi-camera"
                  gif
                  png
                  svg
                />
              </v-row>
            </v-form>
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
import { mapActions, mapGetters } from 'vuex'

function generateItemTemplate () {
  return {
    activityTypeId: null,
    name: null,
    description: null,
    image: null
  }
}

export default {
  name: 'PatchEditorDialog',

  data: () => ({
    file: null,
    dialog: false,
    loading: false,
    id: null,
    item: generateItemTemplate()
  }),

  computed: {
    ...mapGetters('admin/activity', ['types']),

    title () {
      return this.id === null ? 'New Patch' : 'Edit Patch'
    }
  },

  methods: {
    ...mapActions('patches', ['createPatch', 'updatePatch']),

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
          await this.createPatch(this.item)
        } else {
          await this.updatePatch({ id: this.id, data: this.item })
        }

        this.$emit('saved')
      } catch (err) {
        this.loading = false
      } finally {
        this.close()
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
