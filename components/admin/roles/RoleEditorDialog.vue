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

      <validation-observer ref="obs" v-slot="{ invalid, passes }">
        <v-card-text>
          <v-container>
            <v-form
              ref="roleForm"
              @submit.prevent="passes(save)"
            >
              <validation-provider v-slot="{ errors }" name="Role Name" rules="required">
                <v-text-field
                  v-model="item.name"
                  :error-messages="errors"
                  label="Name"
                  outlined
                />
              </validation-provider>

              <validation-provider v-slot="{ errors }" name="Role Description" rules="required">
                <v-textarea
                  v-model="item.description"
                  :error-messages="errors"
                  label="Description"
                  outlined
                />
              </validation-provider>

              <validation-provider v-slot="{ errors }" name="Role Section" rules="required">
                <v-text-field
                  v-model="item.section"
                  :error-messages="errors"
                  label="Section"
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
  name: 'RoleEditorDialog',

  data () {
    return {
      dialog: false,
      loading: false,
      valid: true,
      id: null,
      item: {
        name: '',
        description: '',
        section: ''
      }
    }
  },

  computed: {
    title () {
      return this.id === null ? 'New Role' : 'Edit Role'
    }
  },

  methods: {
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
          await this.$store.dispatch('admin/roles/create', this.item)
        } else {
          await this.$store.dispatch('admin/roles/update', { id: this.id, data: this.item })
        }
        await this.$store.dispatch('admin/roles/get')
      } catch (err) {
        this.loading = false
        return
      } finally {
        this.close()
      }
    },

    open ({ id = null, name = '', description = '', section = '' } = {}) {
      this.id = id
      this.item.name = name
      this.item.description = description
      this.item.section = section

      this.$nextTick(() => {
        this.dialog = true
      })
    }
  }
}
</script>
