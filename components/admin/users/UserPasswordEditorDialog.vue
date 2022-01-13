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
              <!-- Password -->
              <v-tooltip
                class="tooltip-password"
                :bottom="$vuetify.breakpoint.xs"
                :right="$vuetify.breakpoint.smAndUp"
              >
                <template v-slot:activator="{ on, attrs }">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Password"
                    rules="required|min:6|max:20|w_number|w_special|w_upper"
                    vid="password_field"
                  >
                    <pg-password-field
                      v-model="item.password"
                      clearable
                      :disabled="loading"
                      :error-messages="errors"
                      label="Password"
                      :loading="loading"
                      maxlength="20"
                      solo
                      v-bind="attrs"
                      v-on="on"
                    />
                  </validation-provider>
                </template>

                <span class="white--text">
                  At least 6 characters—the more characters, the better.
                </span>
                <br>
                <span class="white--text">
                  A mixture of both uppercase and lowercase letters.
                </span>
                <br>
                <span class="white--text">
                  A mixture of letters and numbers.
                </span>
                <br>
                <span class="white--text">
                  Inclusion of at least one special character, e.g., !@#?]
                </span>
                <br>
              </v-tooltip>

              <!-- Password confirmation -->
              <validation-provider
                v-slot="{ errors }"
                name="Password"
                rules="required|confirmed:password_field"
              >
                <pg-password-field
                  v-model="item.passwordConfirmation"
                  clearable
                  :disabled="loading"
                  :error-messages="errors"
                  label="Confirm password"
                  :loading="loading"
                  maxlength="20"
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
    password: null,
    passwordConfirmation: null
  }
}

export default {
  name: 'UserPasswordEditorDialog',

  data: vm => ({
    dialog: false,
    loading: false,
    id: null,
    title: 'Change Password',
    item: generateItemTemplate()
  }),

  methods: {
    ...mapActions('admin/users', ['updateUserPasswordByAdmin']),

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
        await this.updateUserPasswordByAdmin({ id: this.id, data: this.item })
        this.$emit('saved')
        this.close()
      } catch (err) {
      } finally {
        this.loading = false
      }
    },

    resetItem () {
      this.item = generateItemTemplate()
    },

    loadItem (item) {
      Object.keys(item).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(this.item, key)) {
          this.item[key] = item[key]
        }
      })
    },

    open (evt, item = null) {
      this.id = item
      this.resetItem()
      this.$nextTick(() => {
        this.dialog = true
      })
    }
  }
}
</script>

<style>
.v-tooltip__content {
  z-index: 2999 !important;
}
</style>
