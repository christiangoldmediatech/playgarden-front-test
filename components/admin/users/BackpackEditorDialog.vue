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
            <v-row>
              <v-col cols="12">
                <validation-provider v-slot="{ errors }" name="Backpack">
                  <pg-select
                    v-model="user.backpackSent"
                    :error-messages="errors"
                    :items="sentOptions"
                    label="Backpack"
                    solo-labeled
                  />
                </validation-provider>
              </v-col>
              <v-col v-if="user.backpackSent" cols="12" md="12">
                <v-menu
                  v-model="backpackSentDate"
                  :close-on-content-click="false"
                  min-width="290px"
                  offset-y
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Backpack Sent Date"
                      :rules="{required: user.backpackSent}"
                    >
                      <pg-text-field
                        :disabled="loading"
                        :error-message="errors"
                        label="Backpack Sent Date"
                        readonly
                        solo-labeled
                        :value="dataStartFormatted"
                        v-bind="attrs"
                        v-on="on"
                      />
                    </validation-provider>
                  </template>
                  <v-date-picker v-model="backpackDate" />
                </v-menu>
              </v-col>
            </v-row>
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
import dayjs from 'dayjs'
import { mapActions } from 'vuex'

function generateItemTemplate () {
  return {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    roleId: null,
    backpackSent: false
  }
}

export default {
  name: 'BackpackEditorDialog',

  data: vm => ({
    userId: vm.$route.query.id
      ? parseInt(vm.$route.query.id)
      : null,
    dialog: false,
    loading: false,
    id: null,
    backpackSentDate: false,
    backpackDate: null,
    user: generateItemTemplate(),
    sentOptions: [
      {
        text: 'Sent',
        value: true
      },
      {
        text: 'Pending',
        value: false
      }
    ]
  }),

  computed: {
    title () {
      return this.id === null ? 'New Backpack Sent Dates' : 'Edit Backpack Sent Dates'
    },
    dataStartFormatted () {
      return this.backpackDate ? dayjs(this.backpackDate).format('MM/DD/YYYY') : null
    }
  },

  methods: {
    ...mapActions('admin/users', ['update']),

    close () {
      if (this.$refs.obs) {
        this.$nextTick(() => {
          this.dialog = false
          this.loading = false
          this.$refs.obs.reset()
        })
      }
    },

    async save () {
      this.loading = true
      this.user.backpackSentDate = dayjs(this.backpackDate)
      try {
        await this.update({ id: this.id, data: this.user })
        this.$emit('saved')
        this.close()
      } catch (err) {
      } finally {
        this.loading = false
      }
    },

    resetItem () {
      this.id = null
      this.backpackSent = null
      this.backpackSentDate = false
      this.user = generateItemTemplate()
    },

    loadItem (item) {
      this.id = item.id
      this.user.firstName = item.firstName
      this.user.lastName = item.lastName
      this.user.phoneNumber = item.phoneNumber
      this.user.roleId = item.role.id
      if (item.shipments) {
        this.user.backpackSent = item.shipments.backpack
        const dateStart = (item.shipments.backpackDate) ? new Date(item.shipments.backpackDate) : new Date()
        this.backpackDate = `${dateStart.getFullYear()}-${(dateStart.getMonth() + 1).toString().padStart(2, '0')}-${dateStart.getDate().toString().padStart(2, '0')}`
      }
    },

    open (evt, item = null) {
      this.userId = item
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
