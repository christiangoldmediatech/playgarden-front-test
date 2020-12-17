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
            <v-form ref="roleForm" @submit.prevent="passes(save)">
              <validation-provider
                v-slot="{ errors }"
                name="Role Name"
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
                name="Role Section"
                rules="required"
              >
                <v-radio-group
                  v-model="item.section"
                  :error-messages="errors"
                  label="Section"
                >
                  <v-radio label="Admin" value="ADMIN" />
                  <v-radio label="Users" value="USERS" />
                </v-radio-group>
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
  name: 'RoleEditorDialog',

  data () {
    return {
      dialog: false,
      loading: false,
      valid: true,
      id: null,
      item: {
        name: '',
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
    ...mapActions('admin/roles', {
      createRole: 'create',
      updateRole: 'update',
      getRoles: 'get'
    }),

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
          await this.createRole(this.item)
        } else {
          await this.updateRole({ id: this.id, data: this.item })
        }

        await this.getRoles()

        this.close()
      } catch (err) {
      } finally {
        this.loading = false
      }
    },

    open ({ id = null, name = '', section = '' } = {}) {
      this.id = id
      this.item.name = name
      this.item.section = section

      this.$nextTick(() => {
        this.dialog = true
      })
    }
  }
}
</script>
