<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.xs"
    max-width="500px"
    persistent
    scrollable
  >
    <v-card>
      <v-toolbar
        class="flex-grow-0"
        color="primary darken-1"
        dark
        dense
        flat
      >
        <v-toolbar-title>
          {{ title }}
        </v-toolbar-title>

        <v-spacer />

        <v-btn
          :disabled="loading"
          icon
          @click.stop="close"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-toolbar>

      <validation-observer v-slot="{ invalid, passes }">
        <v-card-text>
          <v-container>
            <v-form
              ref="activityTypeForm"
              @submit.prevent="passes(save)"
            >
              <validation-provider v-slot="{ errors }" name="Activity Type Name" rules="required">
                <v-text-field
                  v-model="item.name"
                  :error-messages="errors"
                  label="Name"
                  outlined
                />
              </validation-provider>

              <validation-provider v-slot="{ errors }" name="Activity Type Description" rules="required">
                <v-textarea
                  v-model="item.description"
                  :error-messages="errors"
                  label="Description"
                  outlined
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
            :dark="$vuetify.breakpoint.xs"
            :disabled="invalid"
            :loading="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="passes(save)"
          >
            Save
          </v-btn>
          <v-btn
            color="red"
            :dark="$vuetify.breakpoint.xs"
            :disabled="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="close"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </validation-observer>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ActivityTypeEditorDialog',

  data () {
    return {
      dialog: false,
      loading: false,
      valid: true,
      id: null,
      item: {
        name: '',
        description: ''
      }
    }
  },

  computed: {
    title () {
      return this.id === null ? 'New Activity Type' : 'Edit Activity Type'
    }
  },

  methods: {
    close () {
      this.$nextTick(() => {
        this.dialog = false
        this.loading = false
      })
    },

    async save () {
      this.loading = true
      try {
        if (this.id === null) {
          await this.$store.dispatch('admin/activity/createType', this.item)
        } else {
          await this.$store.dispatch('admin/activity/updateType', { id: this.id, data: this.item })
        }
        await this.$store.dispatch('admin/activity/getTypes')
      } catch (err) {
        this.loading = false
        return
      } finally {
        this.close()
      }
    },

    open ({ id = null, name = '', description = '' } = {}) {
      this.id = id
      this.item.name = name
      this.item.description = description

      this.$nextTick(() => {
        this.dialog = true
      })
    }
  }
}
</script>
