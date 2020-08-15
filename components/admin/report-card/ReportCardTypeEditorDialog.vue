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
            <v-form ref="reportCardTypeForm" @submit.prevent="passes(save)">
              <validation-provider
                v-slot="{ errors }"
                name="Report Card Type Name"
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
                name="Report Card Type Description"
                rules="required"
              >
                <v-textarea
                  v-model="item.description"
                  :error-messages="errors"
                  label="Description"
                  solo
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
      </v-card>
    </v-dialog>
  </validation-observer>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'ReportCardTypeEditorDialog',

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
      return this.id === null
        ? 'New Report Card Type'
        : 'Edit Report Card Type'
    }
  },

  methods: {
    ...mapActions('admin/report-card', [
      'createType',
      'updateType',
      'getTypes'
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
          await this.createType(this.item)
        } else {
          await this.updateType({ id: this.id, data: this.item })
        }

        await this.getTypes()
      } catch (err) {
        this.loading = false
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
