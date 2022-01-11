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
            <v-form @submit.prevent="passes(save)">
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
                name="Subject"
                rules="required"
              >
                <pg-text-field
                  v-model="item.description"
                  :error-messages="errors"
                  label="Subject"
                  solo-labeled
                />
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Email Message"
                rules="required"
              >
                <pg-tiptap-field
                  v-model="item.template.email"
                  :disabled="loading"
                  :error-messages="errors"
                  label="Email Message"
                />
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="SMS Message"
                rules="required"
              >
                <pg-textarea
                  v-model="item.template.sms"
                  :disabled="loading"
                  :error-messages="errors"
                  label="SMS Message"
                />
              </validation-provider>
            </v-form>
          </v-container>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn
            color="accent"
            :disabled="invalid"
            :loading="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="passes(() => (previewDialog = true))"
          >
            Preview
          </v-btn>

          <v-spacer />

          <v-btn
            v-if="isNotificationActive(item)"
            color="green"
            :disabled="invalid"
            :loading="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="passes(save)"
          >
            Save
          </v-btn>
          <v-btn
            v-else
            text
            disabled
          >
            Restore to save
          </v-btn>

          <v-btn
            color="red"
            :disabled="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="close"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="previewDialog"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="80%"
      persistent
      scrollable
    >
      <v-card>
        <v-toolbar class="flex-grow-0" color="primary darken-1" dark dense flat>
          <v-toolbar-title>
            Message preview
          </v-toolbar-title>

          <v-spacer />

          <v-btn :disabled="loading" icon @click.stop="previewDialog = false">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <pg-tiptap-field flat readonly :value="item.template.email" />
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn
            class="white--text"
            color="red"
            :disabled="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="previewDialog = false"
          >
            Close
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
    description: null,
    deletedAt: null,
    template: {}
  }
}

export default {
  name: 'NotificationEditorDialog',

  data: () => ({
    previewDialog: false,
    dialog: false,
    loading: false,
    id: null,
    item: generateItemTemplate()
  }),

  computed: {
    title () {
      return this.id === null ? 'New Notification' : 'Edit Notification'
    }
  },

  methods: {
    ...mapActions('notifications', [
      'createNotification',
      'updateNotification'
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
        if (this.id === null) {
          await this.createNotification(this.item)
        } else {
          await this.updateNotification({ id: this.id, data: this.item })
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
    },

    isNotificationActive (notification) {
      return notification && notification.deletedAt === null
    }
  }
}
</script>
